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
// import { ApiResponse, PrometheusClient, RangeQueryResponse, SuccessResponse } from '@perses-dev/prometheus-plugin';
import {
  InstantQueryResponse,
  RangeQueryResponse,
  PrometheusClient,
  // PrometheusDatasourceSpec,
  InstantQueryRequestParameters,
  LabelNamesRequestParameters,
  LabelValuesRequestParameters,
  RangeQueryRequestParameters,
} from '@perses-dev/prometheus-plugin';
import { DatasourceClient } from '@perses-dev/plugin-system';

// export function createM3Client(realClient: PrometheusClient): PrometheusClient {
export function createM3Client(client: DatasourceClient): DatasourceClient {
  const promClient = client as PrometheusClient;
  const transformedPromClient = transformPrometheusClient(promClient);
  return transformedPromClient;
  // return transformPrometheusClient(promClient) as DatasourceClient;
}

function transformPrometheusClient(promClient: PrometheusClient): PrometheusClient {
  // custom query limit HTTP headers
  const headers: RequestHeaders = {
    'm3-limit-max-returned-datapoints': '56',
    'm3-limit-max-returned-series': '3',
  };

  return {
    options: {
      datasourceUrl: promClient.options.datasourceUrl,
    },
    instantQuery: (params: InstantQueryRequestParameters) => {
      return promClient.instantQuery(params, headers).then(addInstantQueryWarnings);
    },
    rangeQuery: (params: RangeQueryRequestParameters) => {
      return promClient.rangeQuery(params, headers).then(processRangeQueryResponse);
    },
    labelNames: (params: LabelNamesRequestParameters) => {
      const result = promClient.labelNames(params);
      return result;
    },
    labelValues: (params: LabelValuesRequestParameters) => {
      const result = promClient.labelValues(params);
      return result;
    },
  };
}

// export function createOldM3Client(realClient: PrometheusClient): PrometheusClient {
//   // custom query limit HTTP headers
//   const headers: RequestHeaders = {
//     'm3-limit-max-returned-datapoints': '56',
//     'm3-limit-max-returned-series': '2',
//   };

//   const client: PrometheusClient = {
//     options: {
//       datasourceUrl: realClient.options.datasourceUrl,
//     },
//     instantQuery: (params) => {
//       return realClient.instantQuery(params, headers).then(addInstantQueryWarnings);
//     },
//     rangeQuery: (params) => {
//       // return realClient.rangeQuery(params, headers).then(addRangeQueryWarnings);
//       return realClient.rangeQuery(params, headers).then(processRangeQueryResponse);
//     },
//     labelNames: (params) => {
//       const result = realClient.labelNames(params);
//       return result;
//     },
//     labelValues: (params) => {
//       const result = realClient.labelValues(params);
//       return result;
//     },
//   };
//   return client;
// }

function processRangeQueryResponse(results: RangeQueryResponse): Promise<RangeQueryResponse> {
  if (results.status !== 'success') {
    return Promise.resolve(results);
  }
  const warning = results.headers?.get('m3-returned-data-limited') ?? undefined;
  if (warning !== undefined) {
    results.warnings = [warning];
  }
  return Promise.resolve(results);
}

// // TODO: test error handling, make more generic, should this be ApiResponse<T> or SuccessResponse<T>
// // function addWarnings(results: SuccessResponse): Promise<SuccessResponse> {
// function addRangeQueryWarnings(results: RangeQueryResponse): Promise<RangeQueryResponse> {
//   if (results.status === 'success') {
//     if (results.headers !== undefined) {
//       const entries = [...results.headers.entries()];
//       const entry = entries.find((entry) => entry[0] === 'm3-returned-data-limited');
//       const warning = entry?.[1];
//       if (warning !== undefined) {
//         results.warnings = [warning];
//       }
//     }
//   }
//   return Promise.resolve(results);
// }

function addInstantQueryWarnings(results: InstantQueryResponse): Promise<InstantQueryResponse> {
  if (results.status === 'success') {
    results.warnings = ['M3', 'INSTANT_WARNINGS'];
  }
  return Promise.resolve(results);
}

/**
 * Fetch JSON and parse warnings for query inspector
 */
export async function fetchResults<T>(...args: Parameters<typeof global.fetch>) {
  const response = await fetch(...args);
  const json: T = await response.json();
  const entries = [...response.headers.entries()];
  // const entry = entries.find((entry) => entry[0] === warnings_header);
  const entry = entries.find((entry) => entry[0] === 'Test');
  const warning = entry?.[1];
  return { ...json, warnings: [warning], headers: response.headers };
}
