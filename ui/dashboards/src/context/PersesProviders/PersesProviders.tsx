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

import React from 'react';
import { DashboardResource, TimeRangeValue } from '@perses-dev/core';
import { TimeRangeProvider } from '@perses-dev/plugin-system';
// import panelsResource from '@perses-dev/panels-plugin/plugin.json';
// import prometheusResource from '@perses-dev/prometheus-plugin/plugin.json';
import { DashboardProvider } from '../DashboardProvider';
import { DatasourceStoreProvider } from '../DatasourceStoreProvider';
import { TemplateVariableProvider } from '../TemplateVariableProvider';
import { useDatasourceApi } from './datasource-api';

export function PersesProviders({
  children,
  enabledURLParams = false,
}: {
  children: React.ReactNode;
  initialTimeRange?: TimeRangeValue;
  enabledURLParams?: boolean;
}) {
  const datasourceApi = useDatasourceApi();
  const dashboard: DashboardResource = {
    kind: 'Dashboard',
    metadata: {
      project: 'test',
      version: 10,
      name: 'test',
      created_at: '2021-09-01T00:00:00Z',
      updated_at: '2021-09-01T00:00:00Z',
    },
    spec: {
      duration: '1h',
      panels: {},
      layouts: [],
      variables: [],
    },
  };
  return (
    <DatasourceStoreProvider dashboardResource={dashboard} datasourceApi={datasourceApi}>
      <DashboardProvider initialState={{ dashboardResource: dashboard }}>
        <TemplateVariableProvider initialVariableDefinitions={dashboard.spec.variables}>
          <TimeRangeProvider
            initialTimeRange={{ pastDuration: dashboard.spec.duration }}
            enabledURLParams={enabledURLParams}
          >
            {children}
          </TimeRangeProvider>
        </TemplateVariableProvider>
      </DashboardProvider>
    </DatasourceStoreProvider>
  );
}
