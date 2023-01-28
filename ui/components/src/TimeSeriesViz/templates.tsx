import constate from 'constate';
import _ from 'lodash';
import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useDatasources } from './datasources';

const TEMPLATE_VARIABLE_REGEX = /\$([\w]*)/gm;

const parseTemplateVariables = (str: string) => {
  const regex = TEMPLATE_VARIABLE_REGEX;
  let m;
  const variables: string[] = [];

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    variables.push(m[1]);
  }
  return variables;
};

function replaceTemplateVariable(str: string, variable: string, value: string) {
  return str.replace(`$${variable}`, value);
}

function interpolateValues(val: string | string[]) {
  if (_.isArray(val)) {
    if (val.length === 1) {
      return val[0];
    }
    return `(${val.join('|')})`;
  }
  return val;
}

interface VariableConfig {
  name: string;
  label?: string;
  type: 'custom' | 'datasource';
  enableMultiple?: boolean;
  enableAll?: boolean;
  customAllValue?: string | null;
  spec: any;
}

const variableConfig: VariableConfig[] = [
  {
    name: 'zone',
    type: 'custom',
    spec: {
      values: ['zone', 'error_rate'],
    },
    enableMultiple: false,
    enableAll: false,
    customAllValue: '*',
  },
];

interface TemplateVariableStoreArguments {
  variables?: VariableConfig[];
}

interface TemplateVariableOption {
  label: string;
  value: string;
}

interface TemplateVariableState {
  selected: string[];
  loading: boolean;
  options: TemplateVariableOption[];
}

function getCustomVariables(variables: VariableConfig[] = []) {
  const allVariables = {};
  variables.forEach((v) => {
    const firstOption = v.spec.values[0];
    allVariables[v.name] = {
      selected: [firstOption],
      loading: false,
      options: v.spec.values.map((val) => ({ label: val, value: val })),
    };
  });
  return allVariables;
}

function useTemplateVariableStore(args: TemplateVariableStoreArguments) {
  const customVariablesState = getCustomVariables(args.variables?.filter((v) => v.type === 'custom'));

  const [refreshKey, setRefreshKey] = useState(1);

  const [selectedVariableState, setSelectedVariableState] = useState(customVariablesState);

  const datasourceTemplateVariables = args.variables?.filter((v) => v.type === 'datasource');
  const datasources = useDatasources();
  const datasourceMap = _.keyBy(datasources, 'name');

  const queries = _.map(datasourceTemplateVariables, (v) => {
    return {
      queryKey: [v.name, refreshKey],
      queryFn: () => {
        const ds = datasourceMap[v.spec.datasource]?.datasource;
        if (!ds.templateVariableQuery) {
          throw new Error(`Datasource: ${v.spec.datasource} does not support annotation queries`);
        }

        return ds.templateVariableQuery(v.spec.query);
      },
    };
  });

  const variableQueries = useQueries({ queries: queries });

  const datasourceVariableState = {};
  _.forEach(datasourceTemplateVariables, (v, idx) => {
    const queryState = variableQueries[idx];
    datasourceVariableState[v.name] = {
      loading: queryState.isFetching,
      selected: null,
      options: queryState.data,
    };
  });

  const variables: Record<string, TemplateVariableState> = {
    ...customVariablesState,
    ...datasourceVariableState,
  };

  const setVariableValue = (name: string, value: string | string[]) => {
    if (!selectedVariableState[name]) {
      selectedVariableState[name] = {};
    }
    selectedVariableState[name].selected = value;
    setSelectedVariableState(_.assign({}, selectedVariableState));
  };

  const interpolateString = (str: string) => {
    const templateVariables = parseTemplateVariables(str);
    let compiled = str;

    templateVariables.forEach((v) => {
      const value = variables[v]?.selected || '__MISSING__';
      compiled = replaceTemplateVariable(compiled, v, interpolateValues(value));
    });
    return compiled;
  };

  _.forEach(selectedVariableState, (state, varName) => {
    variables[varName].selected = state.selected;
  });

  _.forEach(variables, (v) => {
    if (!v.selected && v.options?.length > 0) {
      v.selected = v.options[0].value;
    }
  });

  const refresh = () => {
    setRefreshKey(refreshKey + 1);
  };

  const loadingVariables = variableQueries.some((v) => v.isFetching);

  return {
    config: args.variables,
    interpolateString,
    variables,
    setVariableValue,
    refresh,
    loadingVariables,
  };
}

export const [TemplateVariableProvider, useTemplateVariableSrv] = constate(useTemplateVariableStore);
