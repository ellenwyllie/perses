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

import { Box, Divider, Portal, Typography, Stack, Switch } from '@mui/material';
import Pin from 'mdi-material-ui/Pin';
import PinOutline from 'mdi-material-ui/PinOutline';
import { ECharts as EChartsInstance } from 'echarts/core';
import React, { useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { EChartsDataFormat, UnitOptions } from '../model';
import { useTimeZone } from '../context/TimeZoneProvider';
import { TooltipContent } from './TooltipContent';
import { getNearbySeriesData } from './nearby-series';
import {
  CursorCoordinates,
  FALLBACK_CHART_WIDTH,
  TOOLTIP_MAX_HEIGHT,
  TOOLTIP_MAX_WIDTH,
  TOOLTIP_MULTI_SERIES_MIN_WIDTH,
  TOOLTIP_SINGLE_SERIES_MIN_WIDTH,
  useMousePosition,
} from './tooltip-model';
import { assembleTransform } from './utils';

interface TimeSeriesTooltipProps {
  chartRef: React.MutableRefObject<EChartsInstance | undefined>;
  chartData: EChartsDataFormat;
  wrapLabels?: boolean;
  unit?: UnitOptions;
  onUnpinClick?: () => void;
  pinnedPos: CursorCoordinates | null;
}

export const TimeSeriesTooltip = React.memo(function TimeSeriesTooltip({
  chartRef,
  chartData,
  wrapLabels,
  unit,
  onUnpinClick,
  pinnedPos,
}: TimeSeriesTooltipProps) {
  const { formatWithUserTimeZone } = useTimeZone();
  const [showAllSeries, setShowAllSeries] = useState(false);
  const mousePos = useMousePosition();
  const { height, width, ref: tooltipRef } = useResizeObserver();

  const isTooltipPinned = pinnedPos !== null;

  if (mousePos === null || mousePos.target === null) return null;

  // Ensure user is hovering over a chart before checking for nearby series.
  if (pinnedPos === null && (mousePos.target as HTMLElement).tagName !== 'CANVAS') return null;

  const chart = chartRef.current;
  const chartWidth = chart?.getWidth() ?? FALLBACK_CHART_WIDTH; // Fallback width not likely to ever be needed.
  const cursorTransform = assembleTransform(mousePos, chartWidth, isTooltipPinned, pinnedPos, height ?? 0, width ?? 0);

  const formatTimeSeriesHeader = (timeMs: number) => {
    const date = new Date(timeMs);
    const formattedDate = formatWithUserTimeZone(date, 'MMM dd, yyyy - ');
    const formattedTime = formatWithUserTimeZone(date, 'HH:mm:ss');
    return (
      <Box>
        <Typography
          variant="caption"
          sx={(theme) => ({
            color: theme.palette.common.white,
          })}
        >
          {formattedDate}
        </Typography>
        <Typography variant="caption">
          <strong>{formattedTime}</strong>
        </Typography>
      </Box>
    );
  };

  // Get series nearby the cursor and pass into tooltip content children.
  const nearbySeries = getNearbySeriesData({
    mousePos,
    chartData,
    isTooltipPinned,
    pinnedPos,
    chart,
    unit,
    showAllSeries,
  });

  // TODO: where is best place to set contentWidth and is there a better way to calculate?
  let contentWidth = TOOLTIP_MULTI_SERIES_MIN_WIDTH;
  if (nearbySeries.length === 0) {
    contentWidth = TOOLTIP_SINGLE_SERIES_MIN_WIDTH;
    return null;
  }

  const seriesTime = nearbySeries[0]?.date ? nearbySeries[0].date : null;
  if (seriesTime === null) {
    return null;
  }

  // Hide 'Show All' button when only one series returned
  const showAllSeriesToggle = chartData.timeSeries.length > 1;

  return (
    <Portal>
      <Box
        ref={tooltipRef}
        sx={(theme) => ({
          maxWidth: TOOLTIP_MAX_WIDTH,
          maxHeight: TOOLTIP_MAX_HEIGHT,
          padding: theme.spacing(0.5, 2),
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#2E313E', // TODO: use colors from theme, separate styles for dark mode
          borderRadius: '6px',
          color: '#fff',
          fontSize: '11px',
          visibility: 'visible',
          opacity: 1,
          transition: 'all 0.1s ease-out',
          zIndex: theme.zIndex.tooltip,
          overflow: 'hidden',
          '&:hover': {
            overflowY: 'auto',
          },
        })}
        style={{
          transform: cursorTransform,
        }}
      >
        <Stack pt={3} spacing={0.5} sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              position: 'fixed',
              top: 0,
              height: 30,
              width: contentWidth,
            }}
          >
            {formatTimeSeriesHeader(seriesTime)}
            <Stack direction="row" gap={1} sx={{ marginLeft: 'auto' }}>
              {showAllSeriesToggle && (
                <Stack direction="row" gap={1} alignItems="center" sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 11 }}>Show All?</Typography>
                  <Switch
                    checked={showAllSeries}
                    size="small"
                    onChange={(_, checked) => setShowAllSeries(checked)}
                    sx={(theme) => ({
                      '& .MuiSwitch-switchBase': {
                        color: theme.palette.common.white,
                      },
                    })}
                  />
                </Stack>
              )}
              <Stack direction="row" alignItems="center">
                <Typography
                  sx={{
                    marginRight: 0.5,
                    fontSize: 11,
                    verticalAlign: 'middle',
                  }}
                >
                  Click to {isTooltipPinned ? 'Unpin' : 'Pin'}
                </Typography>
                {isTooltipPinned ? (
                  <Pin
                    onClick={() => {
                      if (onUnpinClick !== undefined) {
                        onUnpinClick();
                      }
                    }}
                    sx={{
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                  />
                ) : (
                  <PinOutline sx={{ fontSize: 16 }} />
                )}
              </Stack>
            </Stack>
          </Box>

          <Divider
            sx={(theme) => ({
              borderColor: theme.palette.grey['500'],
            })}
          />
          <TooltipContent series={nearbySeries} wrapLabels={wrapLabels} />
        </Stack>
      </Box>
    </Portal>
  );
});
