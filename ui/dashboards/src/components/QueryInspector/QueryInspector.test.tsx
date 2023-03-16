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

import { Typography } from '@mui/material';
// import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { UnknownSpec } from '@perses-dev/core';
import {
  PluginRegistry,
  useTimeSeriesQueries,
  TimeSeriesData,
  TimeSeriesQueryPlugin,
  mockPluginRegistry,
  MockPlugin,
} from '@perses-dev/plugin-system';
import { renderWithContext } from '../../test';
import { PersesProviders } from '../../context';
import { TimeRangeControls } from '../TimeRangeControls';
import { QueryInspector } from './QueryInspector';

jest.mock('@perses-dev/plugin-system', () => {
  return {
    ...jest.requireActual('@perses-dev/plugin-system'),
    useTimeSeriesQueries: jest.fn(),
  };
});

const FakeTimeSeriesQuery: TimeSeriesQueryPlugin<UnknownSpec> = {
  getTimeSeriesData: async () => {
    return MOCK_TIME_SERIES_DATA;
  },
  OptionsEditorComponent: () => {
    return <div>Edit options here</div>;
  },
  createInitialOptions: () => ({}),
};

const MOCK_PROM_QUERY_PLUGIN: MockPlugin = {
  pluginType: 'TimeSeriesQuery',
  kind: 'PrometheusTimeSeriesQuery',
  plugin: FakeTimeSeriesQuery,
};

export const MOCK_TIME_SERIES_QUERY_RESULT = [
  {
    status: 'success',
    fetchStatus: 'idle',
    isLoading: false,
    isSuccess: true,
    isError: false,
    data: {
      timeRange: {
        start: new Date(1666625490000),
        end: new Date(1666625535000),
      },
      stepMs: 24379,
      series: [
        {
          name: 'device="/dev/vda1", env="demo", fstype="ext4", instance="demo.do.prometheus.io:9100", job="node", mountpoint="/"',
          values: [
            [1666479357903, 0.27700745551584494],
            [1666479382282, 0.27701284657366565],
          ],
        },
        {
          name: 'device="/dev/vda15", env="demo", fstype="vfat", instance="demo.do.prometheus.io:9100", job="node", mountpoint="/boot/efi"',
          values: [
            [1666479357903, 0.08486496097624885],
            [1666479382282, 0.08486496097624885],
          ],
        },
      ],
    },
    dataUpdatedAt: 1666500979895,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isRefetching: false,
    isLoadingError: false,
    isPaused: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isStale: true,
  },
];

const MOCK_TIME_SERIES_DATA: TimeSeriesData = {
  timeRange: {
    start: new Date(1666625490000),
    end: new Date(1666625535000),
  },
  stepMs: 24379,
  series: [
    {
      name: 'device="/dev/vda1", env="demo", fstype="ext4", instance="demo.do.prometheus.io:9100", job="node", mountpoint="/"',
      values: [
        [1666479357903, 0.27700745551584494],
        [1666479382282, 0.27701284657366565],
      ],
    },
    {
      name: 'device="/dev/vda15", env="demo", fstype="vfat", instance="demo.do.prometheus.io:9100", job="node", mountpoint="/boot/efi"',
      values: [
        [1666479357903, 0.08486496097624885],
        [1666479382282, 0.08486496097624885],
      ],
    },
  ],
};

function QueryInfo() {
  const queryResults = useTimeSeriesQueries([
    {
      kind: 'TimeSeriesQuery',
      spec: {
        plugin: {
          kind: 'PrometheusTimeSeriesQuery',
          spec: {
            query: 'up',
          },
        },
      },
    },
    {
      kind: 'TimeSeriesQuery',
      spec: {
        plugin: {
          kind: 'PrometheusTimeSeriesQuery',
          spec: {
            query: 'node_load15{instance="demo.do.prometheus.io:9100",job="node"}',
          },
        },
      },
    },
  ]);

  if (queryResults === undefined || queryResults.length === 0) {
    return null;
  }
  // const hasData = queryResults.some((result) => result.data && result.data.series.length > 0);
  return <Typography>Query Info: {queryResults.length}</Typography>;
}

describe('QueryInspector', () => {
  beforeEach(() => {
    (useTimeSeriesQueries as jest.Mock).mockReturnValue(MOCK_TIME_SERIES_QUERY_RESULT);
  });

  const renderQueryInspector = () => {
    renderWithContext(
      <PluginRegistry {...mockPluginRegistry(MOCK_PROM_QUERY_PLUGIN)}>
        <PersesProviders enabledURLParams={false}>
          <TimeRangeControls />
          <QueryInfo />
          <QueryInspector />
        </PersesProviders>
      </PluginRegistry>
    );
  };

  it('should render query summary', async () => {
    renderQueryInspector();
    expect(await screen.findByText('Queries Loading')).toBeInTheDocument();
    expect(await screen.findByText('1')).toBeInTheDocument();
    // const refreshButton = screen.getByRole('button', { name: 'Refresh dashboard' });
    // userEvent.click(refreshButton);
    // expect(await screen.findByText('3')).toBeInTheDocument();
  });
});
