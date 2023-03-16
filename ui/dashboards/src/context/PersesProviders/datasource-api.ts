import { Datasource, GlobalDatasource } from '@perses-dev/core';
import { DatasourceStoreProviderProps } from '../';

export function useDatasourceApi(): DatasourceStoreProviderProps['datasourceApi'] {
  return {
    getDatasource: async (/*project, selector*/) => {
      // TODO: Convert selector to appropriate request params and fetchJson to get it from backend using project
      // argument passed in
      return undefined;
    },
    getGlobalDatasource: async (selector) => {
      if (selector.kind === 'PrometheusDatasource' && selector.name === undefined) {
        return {
          resource: datasource,
          proxyUrl: getProxyUrl(datasource),
        };
      }
      return undefined;
    },
    listDatasources: async (/*project, pluginKind*/) => {
      return [];
    },

    listGlobalDatasources: async (pluginKind) => {
      if (pluginKind === datasource.spec.plugin.kind) {
        return [datasource];
      }
      return [];
    },
  };
}

const datasource: GlobalDatasource = {
  kind: 'GlobalDatasource',
  metadata: {
    name: 'PrometheusDemo',
    created_at: '',
    updated_at: '',
    version: 0,
  },
  spec: {
    default: true,
    display: {
      name: 'Prometheus Demo',
    },
    plugin: {
      kind: 'PrometheusDatasource',
      spec: {
        direct_url: 'https://prometheus.demo.do.prometheus.io',
      },
    },
  },
};

// Helper function for getting a proxy URL from a datasource or global datasource
function getProxyUrl(datasource: Datasource | GlobalDatasource) {
  let url = `/proxy`;
  if (datasource.kind === 'Datasource') {
    url += `/projects/${encodeURIComponent(datasource.metadata.project)}`;
  }
  url += `/${datasource.kind.toLowerCase()}s/${encodeURIComponent(datasource.metadata.name)}`;
  return url;
}
