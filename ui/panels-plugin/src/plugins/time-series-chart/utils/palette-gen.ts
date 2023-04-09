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

import ColorHash from 'color-hash';
import { PaletteOptions } from '../time-series-chart-model';

/**
 * Get line color as well as color for tooltip and legend, account for whether palette is 'Cateogrical' or 'Auto' (generative)
 */
export function getSeriesColor(
  name: string,
  seriesCount: number,
  palette: string[],
  fallbackColor: string,
  paletteKind: PaletteOptions['kind'] = 'Auto'
): string {
  // Loop through predefined static color palette
  if (paletteKind === 'Categorical' && Array.isArray(palette)) {
    const colorIndex = seriesCount % palette.length;
    // fallback color comes from echarts theme
    const seriesColor = palette[colorIndex];
    if (seriesColor !== undefined) {
      return seriesColor;
    }
  }

  // corresponds to 'Auto' in palette.kind for generative color palette
  const generatedColor = getConsistentSeriesNameColor(name);
  return generatedColor ?? fallbackColor;
}

/*
 * Check whether a color was already generated for a given series name
 * https://github.com/zenozeng/color-hash#custom-hue
 */
export const getConsistentSeriesNameColor = (() => {
  // Valid hue values are 0 to 360 and can be adjusted to control the generated colors.
  // Picked min of 80 and max of 340 to exclude common threshold colors (orange / reddish)
  const colorHash = new ColorHash({ hue: { min: 90, max: 340 } });
  const stringToColorHash: Record<string, string> = {};
  return (inputString: string) => {
    // Check whether color has already been generated for a given series name.
    // Ensures colors are consistent across panels
    if (!stringToColorHash[inputString]) {
      const hslColor = colorHash.hsl(inputString);
      const hue = hslColor[0];
      const saturation = `${(hslColor[1] * 100).toFixed(0)}%`;
      const lightness = `${(hslColor[2] * 100).toFixed(0)}%`;
      const colorString = `hsla(${hue},${saturation},${lightness},0.8)`;
      stringToColorHash[inputString] = colorString;
    }
    return stringToColorHash[inputString];
  };
})();
