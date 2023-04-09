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

import { getSeriesColor, getConsistentSeriesNameColor } from './palette-gen';

describe('getSeriesColor', () => {
  const fallbackColor = '#ff0000';

  it('should return generated color from series name', () => {
    const value = getSeriesColor(
      'Datapoint Processing Limit',
      2,
      ['#fff', '000', '#111', '#222', '#333'],
      '#ff0000',
      'Auto'
    );
    expect(value).toEqual('hsla(149.73865199449796,65%,35%,0.8)');
  });

  it('should return an alternate color based on series name', () => {
    const value = getSeriesColor('test series name', 3, ['#fff', '000', '#111', '#222', '#333'], '#ff0000', 'Auto');
    expect(value).toEqual('hsla(335.70839064649243,35%,35%,0.8)');
  });

  it('should return 1st color in Categorical palette', () => {
    const value = getSeriesColor(
      'p90 test api subdomain',
      0,
      ['#fff', '000', '#111', '#222', '#333'],
      fallbackColor,
      'Categorical'
    );
    expect(value).toEqual('#fff');
  });

  it('should return 3rd color in Categorical palette', () => {
    const value = getSeriesColor(
      'p90 test api subdomain',
      2,
      ['#fff', '000', '#111', '#222', '#333'],
      fallbackColor,
      'Categorical'
    );
    expect(value).toEqual('#111');
  });

  it('should return repeated 1st color in Categorical palette', () => {
    const value = getSeriesColor(
      'p90 test api subdomain',
      5,
      ['#fff', '000', '#111', '#222', '#333'],
      fallbackColor,
      'Categorical'
    );
    expect(value).toEqual('#fff');
  });
});

describe('getConsistentSeriesNameColor', () => {
  it('should generate a custom hsla color', () => {
    const value = getConsistentSeriesNameColor('test');
    expect(value).toEqual('hsla(285.9972489683631,35%,50%,0.8)');
  });

  it('should generate a color from the given series name', () => {
    const value = getConsistentSeriesNameColor(
      'node_memory_Buffers_bytes{env="demo",instance="demo.do.prometheus.io:9100",job="node"}'
    );
    expect(value).toEqual('hsla(163.32874828060523,50%,35%,0.8)');
  });
});
