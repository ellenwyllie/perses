# TimeSeriesViz

## Usage

Visualization version of time series chart component is experimental. It's meant to offer more flexibility than our current chart components.

## Example

See example below.

```tsx
import { TimeSeriesViz } from '@perses-dev/components';
<DataQueryProvider type="PrometheusTimeSeriesQuery" query={{ query }}>
  <Panel title="My Panel">
    <TimeSeriesViz legend={{ position: 'Right' }} />
    <Table />
  </Panel>
</DataQueryProvider>;
```

## Related Links

- https://codesandbox.io/s/dashboard-framework-concept-v2-forked-vxp7d2
- ...
