import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DatasourceProvider } from './datasources';
import { TimeRangeProvider } from './time';
import { AnnotationProvider } from './annotations';
import { TemplateVariableProvider } from './templates';
type ObservabilityAppProviderProps = {
  reactQueryClient?: any;
} & React.ComponentProps<typeof DatasourceProvider> &
  React.ComponentProps<typeof TimeRangeProvider> &
  React.ComponentProps<typeof AnnotationProvider> &
  React.ComponentProps<typeof TemplateVariableProvider>;

export function ObservabilityAppProvider(args: ObservabilityAppProviderProps) {
  const client = args.reactQueryClient || new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <DatasourceProvider {...args}>
        <TimeRangeProvider {...args}>
          <TemplateVariableProvider {...args}>
            <AnnotationProvider {...args}>{args.children}</AnnotationProvider>
          </TemplateVariableProvider>
        </TimeRangeProvider>
      </DatasourceProvider>
    </QueryClientProvider>
  );
}
