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

import constate from 'constate';
import { useQueries } from '@tanstack/react-query';
import _ from 'lodash';
import { useDatasources } from './datasources';
import { useTimeRange } from './time';
import { Annotation } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DatasourceAnnotationConfig<TQuery = any> {
  datasourceName: string;
  query: TQuery;
}

function useAnnotationStore({
  annotations = [],
  datasourceAnnotations = [],
}: {
  annotations?: Annotation[];
  datasourceAnnotations?: DatasourceAnnotationConfig[];
}) {
  const datasources = useDatasources();
  const timeStore = useTimeRange();
  const datasourceMap = _.keyBy(datasources, 'name');

  const queries = _.map(datasourceAnnotations, (a) => {
    return {
      queryKey: [a.datasourceName, a.query],
      queryFn: () => {
        const ds = datasourceMap[a.datasourceName]?.datasource;

        if (ds === undefined) {
          return null;
        }

        if (!ds.annotationQuery) {
          throw new Error(`Datasource: ${a.datasourceName} does not support annotation queries`);
        }

        return ds.annotationQuery({
          startTime: timeStore.startTime,
          endTime: timeStore.endTime,
          query: a.query,
        });
      },
    };
  });

  const allQueryResults = useQueries({ queries });

  const datasourceAnnotationsResults = _.chain(allQueryResults)
    .map((r) => r.data)
    .flatten()
    .filter((v) => !_.isEmpty(v))
    .value();

  return {
    annotations: [...annotations, ...datasourceAnnotationsResults],
  };
}

export const [AnnotationProvider, useAnnotations] = constate(useAnnotationStore);
