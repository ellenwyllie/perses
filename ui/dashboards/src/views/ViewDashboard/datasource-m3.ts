import { useState } from 'react';
import { RequestHeaders } from '@perses-dev/core';
import { RangeQueryResponse, PrometheusClient } from '@perses-dev/prometheus-plugin';
import { DatasourceClient } from '@perses-dev/plugin-system';
// import { LimitRequestHeaders, LIMIT_RESPONSE_HEADER } from '@chronosphereio/shared';
// import { useGatewayConfigs, areGatewayConfigsLoading } from '@/context/GatewayConfigs'; // areGatewayConfigsLoading
// import { useQueryTruncation } from '@/context/QueryTruncationProvider';

export const PARTIAL_RESULTS_MESSAGE = 'At least one set of query results was too large and had to be truncated.';

// // only used if gateway configs invalid
// const FALLBACK_LIMIT_HEADERS: RequestHeaders = {
//   [LimitRequestHeaders.DATA_POINTS]: '500000',
//   [LimitRequestHeaders.SERIES]: '4500',
// };

const LIMIT_RESPONSE_HEADER = 'M3-Returned-Data-Limited';

const DEFAULT_LIMIT_HEADERS: RequestHeaders = {
  'M3-Limit-Max-Returned-Datapoints': '500',
  'M3-Limit-Max-Returned-Series': '2',
};

export function useCreateM3Client() {
  // const gatewayConfigs = useGatewayConfigs();
  // const queryLimitHeaders: RequestHeaders = areGatewayConfigsLoading(gatewayConfigs)
  //   ? FALLBACK_LIMIT_HEADERS
  //   : {
  //       [LimitRequestHeaders.DATA_POINTS]: String(gatewayConfigs.returnedDatapointsLimit),
  //       [LimitRequestHeaders.SERIES]: String(gatewayConfigs.returnedSeriesLimit),
  //     };

  const [resultTruncated, setResultTruncated] = useState<boolean>();

  // const { limitsEnabled, setBannerMessage } = useQueryTruncation();

  const createM3Client = (client: DatasourceClient) => transformPrometheusClient(client);

  function transformPrometheusClient(client: DatasourceClient): PrometheusClient {
    const promClient = client as PrometheusClient;

    // // determine whether to set custom query limit HTTP headers
    // const headers: RequestHeaders = limitsEnabled ? queryLimitHeaders : {};

    const headers = DEFAULT_LIMIT_HEADERS;

    const newClient: PrometheusClient = {
      kind: client.kind,
      options: {
        datasourceUrl: promClient.options.datasourceUrl,
      },
      rangeQuery: (params) => {
        return promClient.rangeQuery(params, headers).then(processRangeQueryResponse);
      },
      instantQuery: (params) => promClient.instantQuery(params, headers),
      labelNames: (params) => promClient.labelNames(params),
      labelValues: (params) => promClient.labelValues(params),
    };
    return newClient;
  }

  function processRangeQueryResponse(results: RangeQueryResponse): Promise<RangeQueryResponse> {
    if (results.status !== 'success') {
      return Promise.resolve(results);
    }
    const parsedResponseHeader = results.rawResponse?.headers?.get(LIMIT_RESPONSE_HEADER) ?? undefined;
    if (parsedResponseHeader !== undefined) {
      const partialResultsData = JSON.parse(parsedResponseHeader);
      if (partialResultsData.Limited === true) {
        setResultTruncated(true);
        const resultInfo = `Results truncated to ${partialResultsData.Series} out of ${partialResultsData.TotalSeries} total series.`;
        results.warnings = [resultInfo]; // extra info about partial results, to be displayed in impacted panels
        // setBannerMessage(PARTIAL_RESULTS_MESSAGE);
      }
    }
    setResultTruncated(false);
    return Promise.resolve(results);
  }

  return { resultTruncated, createM3Client };
}
