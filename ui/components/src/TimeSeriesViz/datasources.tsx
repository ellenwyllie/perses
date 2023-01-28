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

import { DataQueryResponse } from '@grafana/data';
import { useMemo } from 'react';
import constate from 'constate';
import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useTimeRange } from './time';
import { useTemplateVariableSrv } from './templates';
import { Datasource } from './types';
// Datasources

interface DatasourceConfiguration {
  name: string;
  datasource: Datasource;
}

interface DatasourcesStoreArguments {
  datasources: DatasourceConfiguration[];
}

function useDatasourcesStore({ datasources }: DatasourcesStoreArguments) {
  const ds = useMemo(() => {
    return datasources;
  }, []);

  return {
    datasources: ds,
  };
}

export const [DatasourceProvider, useDatasources] = constate(useDatasourcesStore, (store) => store.datasources);

export function useDatasource(name: string) {
  const allDatasources = useDatasources();
  return _.find(allDatasources, { name })?.datasource;
}

export function useDatasourceQuery({
  datasourceName,
  query,
  transformResponse,
}: {
  datasourceName: string;
  query: any;
  transformResponse?: (v: DataQueryResponse) => DataQueryResponse;
}) {
  const { startTime, endTime, refreshId } = useTimeRange();
  const ds = useDatasource(datasourceName);
  const { interpolateString, variables } = useTemplateVariableSrv();
  const resp = useQuery(
    ['query', query, startTime, endTime, refreshId, variables],
    async () => {
      let resp = await ds?.query(
        {
          startTime,
          endTime,
          targets: [{ refId: 'A', ...query }],
        },
        {
          interpolateString,
        }
      );
      if (transformResponse && resp) {
        resp = transformResponse(resp);
      }
      return resp;
    },
    { keepPreviousData: true }
  );
  return resp;
}

export const [DatasourceQueryProvider, useDatasourceQueryContext] = constate(useDatasourceQuery);
