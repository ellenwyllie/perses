import { Table as MuiTable, styled, TableProps as MuiTableProps } from '@mui/material';
import { forwardRef } from 'react';

const StyledMuiTable = styled(MuiTable)(({ theme }) => ({
  // This value is needed to have a consistent table layout when scrolling.
  tableLayout: 'fixed',
}));

type InnerTableProps = MuiTableProps;

export const InnerTable = forwardRef<HTMLTableElement, InnerTableProps>(function InnerTable(props, ref) {
  return <StyledMuiTable {...props} size="small" ref={ref} />;
});
