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

import type { Meta, StoryObj } from '@storybook/react';
import { TimeSeriesTooltip } from '@perses-dev/components';

const meta: Meta<typeof TimeSeriesTooltip> = {
  component: TimeSeriesTooltip,
  argTypes: {},
  parameters: {
    happo: false,
  },
};

export default meta;

type Story = StoryObj<typeof TimeSeriesTooltip>;

export const SingleSeries: Story = {
  args: {
    chartData: {
      timeSeries: [
        {
          type: 'line',
          name: 'env="demo", instance="demo.do.prometheus", job="node", mode="test"',
          color: 'hsla(-1365438424,50%,50%,0.8)',
          data: [
            0.0002315202231525094, 0.00022873082287300112, 0.00023152022315149463, 0.00023152022315149463,
            0.00022873082287300112,
          ],
          symbol: 'circle',
        },
        {
          type: 'line',
          name: 'env="demo", instance="demo.do.prometheus", job="node", mode="test alt"',
          color: 'hsla(286664040,50%,50%,0.8)',
          data: [
            0.05245188284519867, 0.0524463040446356, 0.0524463040446356, 0.05247140864723438, 0.052482566248230646,
          ],
          symbol: 'circle',
        },
      ],
      xAxis: [1654007865000, 1654007880000, 1654007895000, 1654007910000, 1654007925000],
      rangeMs: 60000,
    },
    pinnedPos: null,
  },
  render: (args) => {
    return (
      <div style={{ width: '100px' }}>
        <TimeSeriesTooltip {...args} />
      </div>
    );
  },
};
