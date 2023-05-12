import { Table as MuiTable, styled, TableProps as MuiTableProps } from '@mui/material';
import { forwardRef } from 'react';
import { TableDensity } from './Table';

const StyledMuiTable = styled(MuiTable)(({ theme }) => ({
  // This value is needed to have a consistent table layout when scrolling.
  tableLayout: 'fixed',
}));

type InnerTableProps = Omit<MuiTableProps, 'size'> & {
  density: TableDensity;
};

const TABLE_DENSITY_CONFIG: Record<TableDensity, MuiTableProps['size']> = {
  compact: 'small',
  standard: 'medium',
};

export const InnerTable = forwardRef<HTMLTableElement, InnerTableProps>(function InnerTable(
  { density, ...otherProps },
  ref
) {
  return <StyledMuiTable {...otherProps} size={TABLE_DENSITY_CONFIG[density]} ref={ref} />;
});