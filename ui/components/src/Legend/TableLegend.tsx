import { ColumnDef, CellContext } from '@tanstack/react-table';
import { Table, TableProps, TableColumnConfig } from '../Table';
import { LegendItem } from '../model';

export interface TableLegendProps extends Pick<TableProps<LegendItem>, 'onRowSelectionChange'> {
  items: LegendItem[];
  height: number;
  width: number;
}

const COLUMNS: Array<TableColumnConfig<LegendItem>> = [
  {
    accessorKey: 'label',
    header: 'Name',

    // Stating with `title` attr instead of a tooltip because it is easier to
    // implement. We should try adding a tooltip in the future, but we'll need
    // to be very careful about performance when doing so with large tables.
    cell: ({ getValue }) => <span title={getValue()}>{getValue()}</span>,
  },
];

export function TableLegend({ items, ...tableProps }: TableLegendProps) {
  return (
    <Table
      {...tableProps}
      data={items}
      columns={COLUMNS}
      density="compact"
      getRowId={(data) => {
        // TODO: figure out switching this and other selection handling to id
        // to be safer.
        return data.label;
      }}
      getCheckboxColor={(data) => {
        return data.color;
      }}
      checkboxSelection
    />
  );
}
