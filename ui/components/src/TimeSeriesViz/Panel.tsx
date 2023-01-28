import { Button } from '@mui/material';
import { useDatasourceQueryContext, useTemplateVariableSrv } from './';

// export function Panel({ title = 'Test', children: React.ReactNode }) {
export function Panel({ title = 'Test', children }) {
  const r = useDatasourceQueryContext();
  const t = useTemplateVariableSrv();

  return (
    <div className="border-2 w-full">
      <div className="flex justify-between bg-gray-100 p-2">
        <h3>{t.interpolateString(title)}</h3>
        <div>
          {r.isFetching && 'Loading'} <Button onClick={() => r.refetch}>Refresh</Button>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
