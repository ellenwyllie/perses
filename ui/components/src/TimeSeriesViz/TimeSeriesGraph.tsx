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

// import ReactECharts from 'echarts-for-react';
import { EChartsOption, LineSeriesOption } from 'echarts';
import moment from 'moment';
import { FieldType, getTimeField, MutableDataFrame } from '@grafana/data';
import _ from 'lodash';
import { EChart } from '../';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import { useAnnotations, useDatasourceQueryContext, MutableDataFrame, useTimeRange } from '@/framework/core';
import { useAnnotations, useDatasourceQueryContext, useTimeRange } from './';

interface GraphThreshold {
  value: number;
  type?: 'warn' | 'critical';
  color?: string;
}
interface GraphOptions {
  eChartsOptions?: EChartsOption;
  thresholds?: GraphThreshold[];
}

function getThresholdsFromDataFrame(df: MutableDataFrame): GraphThreshold[] {
  return (df.meta?.custom?.thresholds as GraphThreshold[]) || [];
}

/**
 * Expects a dataframe with a one timeField, and multiple number fields
 * It also suppports custom metadata: thresholds
 */
export function TimeSeriesGraph({ eChartsOptions = {}, thresholds = [] }: GraphOptions) {
  const r = useDatasourceQueryContext();
  const annotationCtx = useAnnotations();
  const time = useTimeRange();
  console.log('TimeSeriesGraph -> time: ', time);
  const dfs = r.data?.data;
  const firstDf: MutableDataFrame = _.first(dfs);
  let series: LineSeriesOption[] = [];

  let allThresholds = thresholds;

  if (firstDf) {
    const timeField = getTimeField(firstDf);
    const numberFields = firstDf.fields.filter((f) => f.type === FieldType.number);
    series = numberFields.map((f) => {
      return {
        name: f.name,
        type: 'line',
        showSymbol: false,
        data: f.values.toArray().map((v, idx) => [timeField.timeField?.values.get(idx), v]),
      };
    });

    const dfThresholds = getThresholdsFromDataFrame(firstDf);
    allThresholds = allThresholds.concat(dfThresholds);
  }

  if (annotationCtx.annotations) {
    const annotations = annotationCtx.annotations;
    // Annotations with a startTime;
    const annotationLines = annotations.filter((a) => !a.endTime);
    // Annotations with an endTime;
    const annotationAreas = annotations.filter((a) => a.endTime);

    series.push({
      name: 'Annotations',
      type: 'line',
      data: [[Date.now(), null]] as any,
      markArea: {
        data: annotationAreas.map((a) => {
          const xAxisEnd = a.endTime === -1 ? moment().add(10, 'years').valueOf() : a.endTime;
          return [
            {
              xAxis: a.time,
              itemStyle: {
                color: a.color,
                opacity: 0.2,
              },
            },
            { xAxis: xAxisEnd },
          ];
        }),
      },
      markLine: {
        label: {
          show: false,
        },
        symbol: 'none',
        data: annotationLines.map((a) => ({
          symbol: 'none',
          symbolSize: 0,
          // lineStyle: {
          //   width: 3
          // },
          itemStyle: {
            color: a.color ?? undefined,
          },

          xAxis: a.time,
        })),
      },
    });
  }

  if (allThresholds.length > 0) {
    series.push({
      name: 'Thresholds',
      type: 'line',
      silent: true,
      symbol: 'none',
      showSymbol: false,
      data: allThresholds.map((t) => [Date.now(), t.value]),
      markLine: {
        label: {
          show: false,
        },
        symbol: 'none',
        data: allThresholds.map((t) => ({
          symbol: 'none',
          symbolSize: 0,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: t.color ?? t.type === 'warn' ? 'orange' : 'red',
          },

          yAxis: t.value,
        })),
      },
    });
  }

  const options: EChartsOption = {
    animation: false,
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
    },
    series: series,
    tooltip: {
      trigger: 'axis',
    },
  };
  // return <ReactECharts style={{ width: '100%' }} notMerge={true} option={_.merge({}, options, eChartsOptions)} />;
  return <EChart option={_.merge({}, options, eChartsOptions)} />;
}

// export function TimeSeriesGraphHighcharts() {
//   const r = useDatasourceQueryContext();
//   const time = useTimeRange();
//   const annotationCtx = useAnnotations();
//   const dfs = r.data?.data;
//   const firstDf: MutableDataFrame = _.first(dfs);

//   let series = [];
//   if (firstDf) {
//     const timeField = getTimeField(firstDf);
//     const numberFields = firstDf.fields.filter((f) => f.type === FieldType.number);
//     series = numberFields.map((f) => {
//       return {
//         name: f.name,
//         type: 'line',
//         data: f.values.toArray().map((v, idx) => [timeField.timeField?.values.get(idx), v]),
//       };
//     });

//     // const dfThresholds = getThresholdsFromDataFrame(firstDf);
//   }
//   const options = {
//     chart: {
//       zoomType: 'x',
//       events: {
//         selection: (event) => {
//           const { min, max } = event.xAxis[0];

//           time.setTimeRange({
//             startTime: Math.floor(min),
//             endTime: Math.floor(max),
//           });
//           event.preventDefault();
//         },
//       },
//     },
//     title: {
//       text: 'My chart',
//     },
//     xAxis: {
//       zoomEnabled: true,
//       type: 'datetime',
//     },
//     series: series,
//   };
//   return <HighchartsReact highcharts={Highcharts} options={options} />;
// }
