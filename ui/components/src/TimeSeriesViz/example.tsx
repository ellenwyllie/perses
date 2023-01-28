import 'antd/dist/antd.css';
import { MutableDataFrame, FieldType } from '@grafana/data';
import moment from 'moment';

import { DataQueryRequest, DataQueryResponse } from '@grafana/data';
import { MonitorsPlugin } from './monitors-plugin';
import {
  ObservabilityAppProvider,
  // Time
  useTimeRange,
  DatasourceQueryProvider,
  Datasource,
  useTemplateVariableSrv,
} from './';

import { Panel, TimeSeriesGraph, TimeRangeSelector } from '@/framework/components';

import { PrometheusDatasource as PromDatasource } from '@/framework/datasources';

interface CoincapDatasourceQuery {
  refId: string;
  currency: 'ethereum' | 'bitcoin';
}

class CoincapDatasource extends Datasource {
  async query(req: DataQueryRequest<CoincapDatasourceQuery>): Promise<DataQueryResponse> {
    const resp = await fetch(
      `https://api.coincap.io/v2/assets/${req.targets[0].currency}/history?start=${req.startTime}&end=${req.endTime}&interval=h1`
    ).then((r) => r.json());
    const df = new MutableDataFrame({
      fields: [
        { name: '@timestamp', type: FieldType.time },
        { name: 'price', type: FieldType.number },
      ],
    });
    resp.data.forEach((d) => {
      df.add({ '@timestamp': d.time, price: d.priceUsd });
    });
    return Promise.resolve({ data: [df] });
  }
}

const datasources = [
  {
    name: 'Prom Lens DS',
    datasource: new PromDatasource('https://demo.promlabs.com/api'),
  },
  {
    name: 'CoinCap',
    datasource: new CoincapDatasource(),
  },
];

function CurrentTimeRange() {
  const t = useTimeRange();
  return (
    <div>
      {JSON.stringify({
        range: t.rawRange,
        refreshInterval: t.refreshInterval,
      })}
    </div>
  );
}

export default function App() {
  return (
    <ObservabilityAppProvider
      datasources={datasources}
      initialRefreshInterval="off"
      initialStartTime="-12h"
      // variables={variables}
      datasourceAnnotations={[
        {
          datasourceName: 'Prom Lens DS',
          query: {
            query: 'Shan',
          },
        },
      ]}
      annotations={[
        {
          time: moment().subtract(2, 'hours').valueOf(),
          endTime: moment().subtract(1, 'hours').valueOf(),
          title: 'Critical State',
          color: 'red',
        },
        {
          time: moment().subtract(3, 'minute').valueOf(),
          title: 'User',
        },
        {
          time: moment().subtract(1, 'minute').valueOf(),
          title: 'User',
          color: 'red',
        },
        {
          time: moment().subtract(5, 'minute').valueOf(),
          endTime: moment().subtract(2, 'minute').valueOf(),
          title: 'Critical State',
          color: 'red',
        },
        {
          time: moment().subtract(2, 'minute').valueOf(),
          endTime: -1,
          title: 'Recovery State',
          color: 'green',
        },
      ]}
    >
      <div className="p-2">
        <div className="flex space-x-4 items-center py-2">
          <TimeRangeSelector />
          <div>|</div> <CurrentTimeRange />
        </div>

        <DatasourceQueryProvider
          datasourceName="Prom Lens DS"
          query={{
            query: `sum by(job, mode) (rate(node_cpu_seconds_total{mode=~"$mode"}[1m])) / on(job) group_left sum by(job)(rate(node_cpu_seconds_total[1m]))`,
          }}
        >
          <Panel title="CPU Usage for $mode">
            <TimeSeriesGraph />
          </Panel>
        </DatasourceQueryProvider>

        <DatasourceQueryProvider
          datasourceName="Prom Lens DS"
          query={{
            query: `up{instance=~"$instance"}`,
          }}
        >
          <Panel title="UP for $instance">
            <TimeSeriesGraph />
          </Panel>
        </DatasourceQueryProvider>

        <DatasourceQueryProvider
          datasourceName="CoinCap"
          query={{
            currency: `bitcoin`,
          }}
        >
          <TimeSeriesGraph />
        </DatasourceQueryProvider>
      </div>
    </ObservabilityAppProvider>
  );
}
