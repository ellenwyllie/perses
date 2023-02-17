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

import happoPlaywright from 'happo-playwright';
import { test } from '../fixtures/dashboardTest';
import { mockTimeSeriesResponseWithStableValue, waitForStableCanvas } from '../utils';

test.use({
  dashboardName: 'TimeSeriesChartPanel',
  mockNow: 1673805600000,
});

test.describe('Dashboard: Time Series Chart Panel', () => {
  test.beforeEach(async ({ context }) => {
    await happoPlaywright.init(context);
  });

  test.afterEach(async () => {
    await happoPlaywright.finish();
  });

  test(`displays single line as expected`, async ({ page, dashboardPage, mockNow }) => {
    // Mock data response, so we can make assertions on consistent response data.
    await dashboardPage.mockQueryRangeRequests({
      queries: [
        {
          query: 'up{job="grafana",instance="demo.do.prometheus.io:3000"}',
          response: {
            status: 200,
            body: JSON.stringify(
              mockTimeSeriesResponseWithStableValue({
                metrics: [
                  {
                    metric: {
                      __name__: 'up',
                      instance: 'demo.do.prometheus.io:3000',
                      job: 'grafana',
                    },
                    value: '1',
                  },
                ],
                startTimeMs: mockNow - 6 * 60 * 60 * 1000,
                endTimeMs: mockNow,
              })
            ),
          },
        },
      ],
    });

    await dashboardPage.forEachTheme(async (themeName) => {
      const panel = dashboardPage.getPanelByName('Single Line');
      await panel.isLoaded();
      await waitForStableCanvas(panel.canvas);

      await happoPlaywright.screenshot(page, panel.parent, {
        component: 'Time Series Chart Panel',
        variant: `Single Line [${themeName}]`,
      });
    });
  });

  test(`displays time series with custom visual and y_axis options`, async ({ page, dashboardPage, mockNow }) => {
    // Mock data response, so we can make assertions on consistent response data.
    await dashboardPage.mockQueryRangeRequests({
      queries: [
        {
          query: 'node_load15{instance="demo.do.prometheus.io:9100",job="node"}',
          response: {
            status: 200,
            body: JSON.stringify(
              mockTimeSeriesResponseWithStableValue({
                metrics: [
                  {
                    metric: {
                      __name__: 'node_load15',
                      env: 'demo',
                      instance: 'demo.do.prometheus.io:9100',
                      job: 'node',
                    },
                    values: [
                      [1676643893.128, '3.55'],
                      [1676643894.128, '3.55'],
                      [1676643895.128, '3.55'],
                      [1676643896.128, '3.55'],
                      [1676643897.128, '3.55'],
                      [1676643898.128, '3.55'],
                      [1676643899.128, '3.51'],
                      [1676643900.128, '3.51'],
                      [1676643901.128, '3.51'],
                      [1676643902.128, '3.51'],
                      [1676643903.128, '3.51'],
                      [1676643904.128, '3.51'],
                      [1676643905.128, '3.51'],
                      [1676643906.128, '3.51'],
                      [1676643907.128, '3.51'],
                      [1676643908.128, '3.51'],
                      [1676643909.128, '3.51'],
                      [1676643910.128, '3.51'],
                      [1676643911.128, '3.51'],
                      [1676643912.128, '3.51'],
                      [1676643913.128, '3.51'],
                      [1676643914.128, '3.45'],
                      [1676643915.128, '3.45'],
                      [1676643916.128, '3.45'],
                      [1676643917.128, '3.45'],
                      [1676643918.128, '3.45'],
                      [1676643919.128, '3.45'],
                      [1676643920.128, '3.45'],
                      [1676643921.128, '3.45'],
                      [1676643922.128, '3.45'],
                      [1676643923.128, '3.45'],
                      [1676643924.128, '3.45'],
                      [1676643925.128, '3.45'],
                      [1676643926.128, '3.45'],
                      [1676643927.128, '3.45'],
                      [1676643928.128, '3.45'],
                      [1676643929.128, '3.39'],
                      [1676643930.128, '3.39'],
                      [1676643931.128, '3.39'],
                      [1676643932.128, '3.39'],
                      [1676643933.128, '3.39'],
                      [1676643934.128, '3.39'],
                      [1676643935.128, '3.39'],
                      [1676643936.128, '3.39'],
                      [1676643937.128, '3.39'],
                      [1676643938.128, '3.39'],
                      [1676643939.128, '3.39'],
                      [1676643940.128, '3.39'],
                      [1676643941.128, '3.39'],
                      [1676643942.128, '3.39'],
                      [1676643943.128, '3.39'],
                      [1676643944.128, '3.34'],
                      [1676643945.128, '3.34'],
                      [1676643946.128, '3.34'],
                      [1676643947.128, '3.34'],
                      [1676643948.128, '3.34'],
                      [1676643949.128, '3.34'],
                      [1676643950.128, '3.34'],
                      [1676643951.128, '3.34'],
                      [1676643952.128, '3.34'],
                      [1676643953.128, '3.34'],
                    ],
                  },
                ],
                startTimeMs: mockNow - 6 * 60 * 60 * 1000,
                endTimeMs: mockNow,
              })
            ),
          },
        },
      ],
    });

    await dashboardPage.forEachTheme(async (themeName) => {
      const panel = dashboardPage.getPanelByName('Single Line');
      await panel.isLoaded();
      await waitForStableCanvas(panel.canvas);

      await happoPlaywright.screenshot(page, panel.parent, {
        component: 'Time Series Chart Panel',
        variant: `Single Line [${themeName}]`,
      });
    });

    // await dashboardPage.forEachTheme(async (themeName) => {
    //   const panel = dashboardPage.getPanelByName('Line Visual Options');
    //   await panel.isLoaded();
    //   await waitForStableCanvas(panel.canvas);

    //   await happoPlaywright.screenshot(page, panel.parent, {
    //     component: 'Time Series Chart Panel',
    //     variant: `Line Visual Options [${themeName}]`,
    //   });
    // });
  });
});
