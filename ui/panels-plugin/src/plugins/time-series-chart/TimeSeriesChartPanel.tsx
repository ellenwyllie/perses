// Copyright 2022 The Perses Authors
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

import { PanelProps, useTimeSeriesQueries, useTimeRange } from '@perses-dev/plugin-system';
import { useMemo } from 'react';
import { GridComponentOption } from 'echarts';
import { Box, Skeleton } from '@mui/material';
import { LineChart, EChartsDataFormat, ZoomEventData, ListLegend } from '@perses-dev/components';
import { useSuggestedStepMs } from '../../model/time';
import { StepOptions, ThresholdColors, ThresholdColorsPalette } from '../../model/thresholds';
import { TimeSeriesChartOptions } from './time-series-chart-model';
import { getLineSeries, getCommonTimeScale, getYValues, getXValues } from './utils/data-transform';
import { getRandomColor } from './utils/palette-gen';

export const EMPTY_GRAPH_DATA = {
  timeSeries: [],
  xAxis: [],
};

export type TimeSeriesChartProps = PanelProps<TimeSeriesChartOptions>;

export function TimeSeriesChartPanel(props: TimeSeriesChartProps) {
  const {
    spec: { queries, show_legend, thresholds },
    contentDimensions,
  } = props;

  const unit = props.spec.unit ?? {
    kind: 'Decimal',
    decimal_places: 2,
  };

  const suggestedStepMs = useSuggestedStepMs(contentDimensions?.width);
  const queryResults = useTimeSeriesQueries(queries, { suggestedStepMs });

  const { setTimeRange } = useTimeRange();

  // populate series data based on query results
  const { graphData, loading } = useMemo(() => {
    const timeScale = getCommonTimeScale(queryResults);
    if (timeScale === undefined) {
      for (const query of queryResults) {
        // does not show error message if any query is successful (due to timeScale check)
        if (query.error) throw query.error;
      }
      return {
        graphData: EMPTY_GRAPH_DATA,
        loading: true,
      };
    }

    const graphData: EChartsDataFormat = {
      timeSeries: [],
      xAxis: [],
      legendItems: [],
      rangeMs: timeScale.endMs - timeScale.startMs,
    };
    const xAxisData = [...getXValues(timeScale)];

    let queriesFinished = 0;
    for (const query of queryResults) {
      // Skip queries that are still loading and don't have data
      if (query.isLoading || query.data === undefined) continue;

      for (const timeSeries of query.data.series) {
        const yValues = getYValues(timeSeries, timeScale);
        const lineSeries = getLineSeries(timeSeries.name, yValues);
        graphData.timeSeries.push(lineSeries);
        if (graphData.legendItems !== undefined) {
          graphData.legendItems.push({
            id: timeSeries.name,
            // label: JSON.stringify(timeSeries.values),
            // label: timeSeries.values,
            label: timeSeries.name,
            isSelected: false,
            color: getRandomColor(timeSeries.name),
            // onClick: () => {}, // TODO (sjcobb): add filter data function
          });
        }
      }
      queriesFinished++;
    }
    graphData.xAxis = xAxisData;

    if (thresholds !== undefined && thresholds.steps !== undefined) {
      const defaultThresholdColor = thresholds.default_color ?? ThresholdColors.RED;
      thresholds.steps.forEach((step: StepOptions, index: number) => {
        const stepPaletteColor = ThresholdColorsPalette[index] ?? defaultThresholdColor;
        const thresholdLineColor = step.color ?? stepPaletteColor;
        const stepOption: StepOptions = {
          color: thresholdLineColor,
          value: step.value,
        };
        const thresholdName = step.name ?? `Threshold ${index + 1} `;
        const thresholdData = Array(xAxisData.length).fill(step.value);
        const thresholdLineSeries = getLineSeries(thresholdName, thresholdData, stepOption);
        graphData.timeSeries.push(thresholdLineSeries);
      });
    }

    return {
      graphData,
      loading: queriesFinished === 0,
      allQueriesLoaded: queriesFinished === queryResults.length,
    };
  }, [queryResults, thresholds]);

  if (contentDimensions === undefined) {
    return null;
  }

  if (loading === true) {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        width={contentDimensions.width}
        height={contentDimensions.height}
      >
        <Skeleton variant="text" width={contentDimensions.width - 20} height={contentDimensions.height / 2} />
      </Box>
    );
  }

  const gridOverrides: GridComponentOption = {
    // bottom: show_legend === true ? 40 : 0,
    bottom: show_legend === true ? 0 : 0,
  };

  const handleDataZoom = (event: ZoomEventData) => {
    // TODO: add ECharts transition animation on zoom
    setTimeRange({ start: new Date(event.start), end: new Date(event.end) });
  };

  return (
    <Box
      sx={{
        height: contentDimensions.height,
        overflowY: 'scroll',
      }}
    >
      <LineChart
        // // height={contentDimensions.height - 25}
        height={contentDimensions.height - 60}
        data={graphData}
        unit={unit}
        grid={gridOverrides}
        onDataZoom={handleDataZoom}
      />
      {show_legend && <ListLegend items={graphData.legendItems} />}
    </Box>
  );
}
