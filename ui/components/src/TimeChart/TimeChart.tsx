// Copyright 2023 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { MouseEvent, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import type {
  EChartsCoreOption,
  GridComponentOption,
  LineSeriesOption,
  LegendComponentOption,
  YAXisComponentOption,
  TooltipComponentOption,
} from 'echarts';
import { ECharts as EChartsInstance, use } from 'echarts/core';
import { LineChart as EChartsLineChart } from 'echarts/charts';
import {
  GridComponent,
  DataZoomComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChart, OnEventsType } from '../EChart';
import { EChartsDataFormat, OPTIMIZED_MODE_SERIES_LIMIT } from '../model/graph';
import { UnitOptions } from '../model/units';
import { useChartsTheme } from '../context/ChartsThemeProvider';
import { TimeSeriesTooltip } from '../TimeSeriesTooltip';
import { enableDataZoom, getYAxes, restoreChart, ZoomEventData } from './utils';

use([
  EChartsLineChart,
  GridComponent,
  DataZoomComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

type TooltipConfig = {
  wrapLabels: boolean;
  hidden?: boolean;
};

export interface TimeChartProps {
  /**
   * Height of the chart
   */
  height: number;
  data: EChartsDataFormat;
  yAxis?: YAXisComponentOption;
  unit?: UnitOptions;
  grid?: GridComponentOption;
  legend?: LegendComponentOption;
  tooltipConfig?: TooltipConfig;
  onDataZoom?: (e: ZoomEventData) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  __experimentalEChartsOptionsOverride?: (options: EChartsCoreOption) => EChartsCoreOption;
}

export function TimeChart({
  height,
  data,
  yAxis,
  unit,
  grid,
  legend,
  tooltipConfig = { hidden: false, wrapLabels: true },
  onDataZoom,
  onDoubleClick,
  __experimentalEChartsOptionsOverride,
}: TimeChartProps) {
  const chartsTheme = useChartsTheme();
  const chartRef = useRef<EChartsInstance>();
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [pinTooltip, setPinTooltip] = useState<boolean>(false);
  // const { timeZone } = useTimeZone();

  const handleEvents: OnEventsType<LineSeriesOption['data'] | unknown> = useMemo(() => {
    return {
      datazoom: (params) => {
        if (onDataZoom === undefined) {
          setTimeout(() => {
            // workaround so unpin happens after click event
            setPinTooltip(false);
          }, 10);
        }
        if (onDataZoom === undefined || params.batch[0] === undefined) return;
        const startIndex = params.batch[0].startValue ?? 0;
        const endIndex = params.batch[0].endValue ?? data.xAxis.length - 1;
        const xAxisStartValue = data.xAxis[startIndex];
        const xAxisEndValue = data.xAxis[endIndex];

        if (xAxisStartValue !== undefined && xAxisEndValue !== undefined) {
          const zoomEvent: ZoomEventData = {
            start: xAxisStartValue,
            end: xAxisEndValue,
            startIndex,
            endIndex,
          };
          onDataZoom(zoomEvent);
        }
      },
      // TODO: use legendselectchanged event to fix tooltip when legend selected
    };
  }, [data, onDataZoom, setPinTooltip]);

  if (chartRef.current !== undefined) {
    enableDataZoom(chartRef.current);
  }

  const handleOnDoubleClick = (e: MouseEvent) => {
    setPinTooltip(false);
    // either dispatch ECharts restore action to return to orig state or allow consumer to define behavior
    if (onDoubleClick === undefined) {
      if (chartRef.current !== undefined) {
        restoreChart(chartRef.current);
      }
    } else {
      onDoubleClick(e);
    }
  };

  const { noDataOption } = chartsTheme;

  const option: EChartsCoreOption = useMemo(() => {
    if (data.timeSeries === undefined) return {};
    if (data.timeSeries === null || data.timeSeries.length === 0) return noDataOption;

    // show symbols and axisPointer dashed line on hover
    const isOptimizedMode = data.timeSeries.length > OPTIMIZED_MODE_SERIES_LIMIT;

    // const rangeMs = data.rangeMs ?? getDateRange(data.xAxis);

    const startTime = data.xAxis[0];
    const endTime = data.xAxis[data.xAxis.length - 1];

    // TODO: test with annotations branch:
    // - https://github.com/perses/perses/pull/1050/files#diff-59984d6680eeff8ff57e0546febed4b939f1e55510ed3c2702ef73f823f1c1de
    // - https://github.com/perses/perses/blob/94c8d976c32749e73a92d0372da729b505b851f6/ui/components/src/LineChart/LineChart.tsx
    const option: EChartsCoreOption = {
      dataset: data.dataset,
      series: data.timeSeries,
      xAxis: {
        type: 'time',
        // TODO: fix timezones using this approach
        // - https://github.com/apache/echarts/issues/14453#issuecomment-800163920
        min: startTime,
        max: endTime,
      },
      yAxis: getYAxes(yAxis, unit),
      animation: false,
      tooltip: {
        show: !isOptimizedMode,
        trigger: 'axis',
        showContent: false, // echarts tooltip content hidden since we use custom tooltip instead
        appendToBody: true,
      },
      // https://echarts.apache.org/en/option.html#axisPointer
      axisPointer: {
        type: isOptimizedMode ? 'none' : 'line',
        z: 0, // ensure point symbol shows on top of dashed line
        triggerEmphasis: false, // https://github.com/apache/echarts/issues/18495
        triggerTooltip: false,
        snap: true,
      },
      toolbox: {
        feature: {
          dataZoom: {
            icon: null, // https://stackoverflow.com/a/67684076/17575201
            yAxisIndex: 'none',
          },
        },
      },
      grid,
      legend,
    };

    if (__experimentalEChartsOptionsOverride) {
      return __experimentalEChartsOptionsOverride(option);
    }
    return option;
  }, [data, yAxis, unit, grid, legend, noDataOption, __experimentalEChartsOptionsOverride]);

  return (
    <Box
      sx={{ height }}
      onClick={() => {
        setPinTooltip((current) => !current);
      }}
      onMouseDown={(e) => {
        // hide tooltip when user drags to zoom, but allow clicking inside tooltip to copy labels
        if (e.target instanceof HTMLCanvasElement) {
          setShowTooltip(false);
        }
      }}
      onMouseUp={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
        setPinTooltip(false);
      }}
      onMouseEnter={() => {
        setShowTooltip(true);
        if (chartRef.current !== undefined) {
          enableDataZoom(chartRef.current);
        }
      }}
      onDoubleClick={handleOnDoubleClick}
    >
      {/* Allows overrides prop to hide custom tooltip and use the ECharts option.tooltip instead */}
      {showTooltip === true &&
        (option.tooltip as TooltipComponentOption)?.showContent === false &&
        tooltipConfig.hidden !== true && (
          <TimeSeriesTooltip
            chartRef={chartRef}
            chartData={data}
            wrapLabels={tooltipConfig.wrapLabels}
            pinTooltip={pinTooltip}
            unit={unit}
          />
        )}
      <EChart
        sx={{
          width: '100%',
          height: '100%',
        }}
        option={option}
        theme={chartsTheme.echartsTheme}
        onEvents={handleEvents}
        _instance={chartRef}
      />
    </Box>
  );
}
