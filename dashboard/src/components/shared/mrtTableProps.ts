/** Shared default props applied to every MaterialReactTable instance in the dashboard.
 *  Spread with `{...mrtTableProps}` and override per-table props as needed.
 *  No hardcoded colors — inherits from the MUI theme automatically.
 */
export const mrtTableProps = {
  layoutMode: 'grid' as const,
  columnResizeMode: 'onEnd' as const,
  enableColumnResizing: true,
  enableStickyHeader: true,
  enableFullScreenToggle: true,
  enableDensityToggle: true,
  enableHiding: true,
  enableGlobalFilter: true,
  enableColumnFilters: true,
  enablePagination: true,
  enableRowNumbers: false,
  enableRowSelection: false,
  muiTablePaperProps: { sx: { bgcolor: 'background.paper' } },
  muiTopToolbarProps: { sx: { bgcolor: 'background.paper' } },
  muiBottomToolbarProps: { sx: { bgcolor: 'background.paper' } },
  muiTableHeadCellProps: { sx: { bgcolor: 'background.paper' } },
  muiTableBodyCellProps: { sx: { bgcolor: 'background.paper' } },
  muiTableContainerProps: { sx: { maxHeight: 560, bgcolor: 'background.paper' } },
};
