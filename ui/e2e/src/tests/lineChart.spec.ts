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
  mockNow: new Date('March 14 2020 10:00:00'),
});

test.describe('Dashboard: Line Chart', () => {
  test('has chart', async ({ dashboardPage, page }) => {
    const responsePromise = page.waitForResponse('**/api/v1/query_range*');
    const endTimeS = Math.floor(Date.now() / 1000);
    const durationS = 6 * 60 * 60;
    const startTimeS = endTimeS - durationS;
    const steps = 1000;
    const stepSize = durationS / steps;
    await page.route(
      '**/api/v1/query_range*',
      (route) => {
        const data = {
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
        console.log(data);

        route.fulfill({
          status: 200,
          body: JSON.stringify({
            status: 'success',
            data: data,
          }),
        });
      },
      {
        times: 1,
      }
    );

    // page.on('response', (response) => console.log('<<', response.status(), response.url()));

    const result = await responsePromise;
    // console.log(result.url());
  });
});
