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

import { Box, Typography, Stack, Switch } from '@mui/material';
import Pin from 'mdi-material-ui/Pin';
import PinOutline from 'mdi-material-ui/PinOutline';
import React from 'react';
import { useTimeZone } from '../context/TimeZoneProvider';
import { TOOLTIP_MAX_WIDTH } from './tooltip-model';

export interface TooltipHeaderProps {
  seriesTimeMs: number;
  totalSeries: number;
  isTooltipPinned: boolean;
  showAllSeries: boolean;
  onShowAllClick?: (checked: boolean) => void;
  onUnpinClick?: () => void;
}

export const TooltipHeader = React.memo(function TooltipHeader({
  seriesTimeMs,
  isTooltipPinned,
  totalSeries,
  showAllSeries,
  onShowAllClick,
  onUnpinClick,
}: TooltipHeaderProps) {
  const { formatWithUserTimeZone } = useTimeZone();

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

  // Hide 'Show All' button when only one series returned
  const showAllSeriesToggle = totalSeries > 1;

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        maxWidth: TOOLTIP_MAX_WIDTH,
        height: 30,
        padding: theme.spacing(0.5, 2),
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
      })}
    >
      {formatTimeSeriesHeader(seriesTimeMs)}
      <Stack direction="row" gap={1} sx={{ marginLeft: 'auto' }}>
        {showAllSeriesToggle && (
          <Stack direction="row" gap={1} alignItems="center" sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 11 }}>Show All?</Typography>
            <Switch
              checked={showAllSeries}
              size="small"
              onChange={(_, checked) => {
                if (onShowAllClick !== undefined) {
                  return onShowAllClick(checked);
                }
              }}
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
  );
});
