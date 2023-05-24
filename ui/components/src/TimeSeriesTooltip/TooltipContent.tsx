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

import { useMemo } from 'react';
import { Box } from '@mui/material';
import { FocusedSeriesArray } from './focused-series';
import { SeriesInfo } from './SeriesInfo';

export interface TooltipContentProps {
  series: FocusedSeriesArray | null;
  wrapLabels?: boolean;
  // tooltipPinned: boolean;
  // showAllSeries: boolean;
  // onShowAllClick: (showAll: boolean) => void;
  // onUnpinClick: () => void;
}

export function TooltipContent(props: TooltipContentProps) {
  const { series, wrapLabels } = props;

  const seriesTime = series && series[0] && series[0].date ? series[0].date : null;

  const sortedFocusedSeries = useMemo(() => {
    if (series === null) return null;
    return series.sort((a, b) => (a.y > b.y ? -1 : 1));
  }, [series]);

  if (sortedFocusedSeries === null || seriesTime === null) {
    return null;
  }

  // TODO: use react-virtuoso to improve performance
  return (
    <Box
      sx={{
        display: 'table',
      }}
    >
      {sortedFocusedSeries.map(({ datumIdx, seriesIdx, seriesName, y, formattedY, markerColor, isClosestToCursor }) => {
        if (datumIdx === null || seriesIdx === null) return null;
        const key = seriesIdx.toString() + datumIdx.toString();

        return (
          <SeriesInfo
            key={key}
            seriesName={seriesName}
            y={y}
            formattedY={formattedY}
            markerColor={markerColor}
            totalSeries={sortedFocusedSeries.length}
            wrapLabels={wrapLabels}
            emphasizeText={isClosestToCursor}
          />
        );
      })}
    </Box>
  );
}
