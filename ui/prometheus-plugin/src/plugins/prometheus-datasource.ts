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

import { DatasourcePlugin } from '@perses-dev/plugin-system';
import { instantQuery, rangeQuery, labelNames, labelValues, PrometheusClient } from '../model';

export interface PrometheusDatasourceSpec {
  direct_url?: string;
}

/**
 * Creates a PrometheusClient for a specific datasource spec.
 */
const createClient: DatasourcePlugin<PrometheusDatasourceSpec, PrometheusClient>['createClient'] = (spec, options) => {
  const { direct_url } = spec;
  const { proxyUrl } = options;

  // Use the direct URL if specified, but fallback to the proxyUrl by default if not specified
  const datasourceUrl = direct_url ?? proxyUrl;
  if (datasourceUrl === undefined) {
    throw new Error('No URL specified for Prometheus client. You can use direct_url in the spec to configure it.');
  }

  console.log('createClient called... ');
  const { headers } = onCreate();

  // Could think about this becoming a class, although it definitely doesn't have to be
  const client = {
    options: {
      datasourceUrl,
      headers,
    },
    instantQuery: (params) => instantQuery(params, { datasourceUrl, headers }),
    rangeQuery: (params) => rangeQuery(params, { datasourceUrl, headers }),
    labelNames: (params) => labelNames(params, { datasourceUrl, headers }),
    labelValues: (params) => labelValues(params, { datasourceUrl, headers }),
  };
  console.log('createClient -> client: ', client);
  return client;
};

/**
 * On create hook to customize HTTP headers
 */
const onCreate: DatasourcePlugin<PrometheusDatasourceSpec, PrometheusClient>['onCreate'] = () => {
  console.log('datasource -> onCreate called... ');
  const options = {
    headers: {
      'm3-limit-max-returned-datapoints': '400000', // TODO: need to pass limit http headers from datasource JSON config
      'm3-limit-max-returned-series': '4000',
    },
  };
  return options;
};

export const PrometheusDatasource: DatasourcePlugin<PrometheusDatasourceSpec, PrometheusClient> = {
  createClient,
  onCreate,
  OptionsEditorComponent: () => null,
  createInitialOptions: () => ({ direct_url: '' }),
};
