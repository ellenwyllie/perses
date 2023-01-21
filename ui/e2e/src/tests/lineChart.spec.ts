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

import { test, expect } from '../fixtures/dashboardTest';

test.use({
  dashboardName: 'LineChart',
  mockNow: new Date('January 15, 2023 10:00:00').valueOf(),
});

function generateMockData(mockNow: number) {
  const endTimeS = Math.floor(mockNow / 1000);
  const durationS = 6 * 60 * 60;
  const startTimeS = endTimeS - durationS;
  const steps = 10000;
  const stepSize = durationS / steps;
  return {
    result: [
      {
        metric: {
          __name__: 'up',
          job: 'alertmanager',
          env: 'demo',
          instance: 'demo.do.prometheus.io:9093',
        },
        values: [...Array(1000)].map((_, i) => {
          return [startTimeS + i * stepSize, '1'];
        }),
      },
    ],
  };
}

test.describe('Dashboard: Line Chart', () => {
  test.afterEach(async ({ page }) => {
    // Make sure all routes get cleaned up after tests run.
    await page.unroute('**/api/v1/query_range');
  });

  test('has chart', async ({ dashboardPage, page, mockNow }) => {
    await page.route('**/api/v1/query_range', (route) => {
      const request = route.request();
      const requestPostData = request.postDataJSON();

      if (typeof requestPostData === 'object' && requestPostData['query'] === 'up') {
        const data = generateMockData(mockNow);

        route.fulfill({
          status: 200,
          body: JSON.stringify({
            status: 'success',
            data: data,
          }),
        });
      } else {
        route.continue();
      }
    });

    const panel = dashboardPage.getPanel('simpleLine');

    const panelBounds = await panel.getBounds();
    await panel.isLoaded();

    // Configuring to try again because there's a brief period where the canvas
    // exists, but isn't set up yet,and we cannot easily assert anything about
    // the content of the canvas.
    await expect(async () => {
      // Mouse over the center of the panel to trigger the tooltip
      await panel.container.hover({
        position: {
          x: panelBounds.width / 2,
          y: panelBounds.height / 2,
        },
      });

      await expect(panel.tooltip).toBeVisible({
        // Fail fast because it will check again if it's not ready yet
        timeout: 10,
      });
    }).toPass();

    // Do not check the time because trying to get the tooltip to consistently
    // hover over the exact same point every time is tricky and could lead to
    // flaky tests.
    await expect(panel.tooltip).toContainText('Jan 15, 2023');

    await expect(panel.tooltip).toContainText('up:1');
    await expect(panel.tooltip).toContainText('env: demo');
    await expect(panel.tooltip).toContainText('instance: demo.do.prometheus.io:9093');
    await expect(panel.tooltip).toContainText('job: alertmanager');

    // Mouse away from the chart to dismiss the tooltip
    await panel.container.hover({
      position: {
        x: 0,
        y: 0,
      },
    });
    await expect(panel.tooltip).toBeHidden();
  });
});
