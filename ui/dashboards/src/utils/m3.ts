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

import { RequestHeaders } from '@perses-dev/core';
import { InstantQueryResponse, RangeQueryResponse, PrometheusClient } from '@perses-dev/prometheus-plugin';
import { DatasourceClient } from '@perses-dev/plugin-system';

export function createM3Client(client: DatasourceClient): DatasourceClient {
  const transformedPromClient = transformPrometheusClient(client);
  return transformedPromClient;
}

function transformPrometheusClient(client: DatasourceClient): PrometheusClient {
  // TODO: validate Prom client
  const promClient = client as PrometheusClient;

  // custom query limit HTTP headers
  const headers: RequestHeaders = {
    'm3-limit-max-returned-datapoints': '77',
    'm3-limit-max-returned-series': '1',
  };

  return {
    options: {
      datasourceUrl: promClient.options.datasourceUrl,
    },
    instantQuery: (params) => {
      return promClient.instantQuery(params, headers).then(processInstantQueryResponse);
    },
    rangeQuery: (params) => {
      return promClient.rangeQuery(params, headers).then(processRangeQueryResponse);
    },
    labelNames: (params) => {
      const result = promClient.labelNames(params);
      return result;
    },
    labelValues: (params) => {
      const result = promClient.labelValues(params);
      return result;
    },
  };
}

function processRangeQueryResponse(results: RangeQueryResponse): Promise<RangeQueryResponse> {
  if (results.status !== 'success') {
    return Promise.resolve(results);
  }
  const warning = results.rawResponse?.headers?.get('m3-returned-data-limited') ?? undefined;
  if (warning !== undefined) {
    results.warnings = [warning];
  }
  return Promise.resolve(results);
}

function processInstantQueryResponse(results: InstantQueryResponse): Promise<InstantQueryResponse> {
  if (results.status !== 'success') {
    return Promise.resolve(results);
  }
  const warning = results.rawResponse?.headers?.get('m3-returned-data-limited') ?? undefined;
  if (warning !== undefined) {
    results.warnings = [warning];
  }
  return Promise.resolve(results);
}
