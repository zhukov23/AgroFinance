import React from 'react';
import TableContainer from './TableContainerReactTable';

export interface ColumnConfig {
  key: string;
  label: string;
  width?: number;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  accessor?: string;
  formatter?: (value: any, record: any) => React.ReactNode; // ← Добавьте эту строку
}

export interface TableConfig {
  pageSize?: number;
  showPagination?: boolean;
  sortable?: boolean;
  emptyMessage?: string;
  className?: string;
  searchPlaceholder?: string;
  globalFilter?: boolean;
}

export interface TableProps {
  data: any[];
  columns: ColumnConfig[];
  config?: TableConfig;
  isLoading?: boolean;
  onRowClick?: (record: any) => void;
  title?: string;
  subtitle?: string;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  config = {},
  isLoading = false,
  onRowClick,
  title,
  subtitle
}) => {
  const {
    pageSize = 10,
    showPagination = true,
    sortable = true,
    emptyMessage = 'Нет данных',
    className = '',
    searchPlaceholder = 'Поиск...',
    globalFilter = true
  } = config;

  // Преобразуем наши колонки в формат для TableContainer
  const tableColumns = React.useMemo(() => {
    return columns.map(column => ({
      header: column.label,
      accessorKey: column.accessor || column.key,
      enableColumnFilter: false,
      enableSorting: column.sortable !== false,
      size: column.width,
      cell: (cell: any) => {
        const value = cell.getValue();
        const record = cell.row.original;

        // Используем форматтер если он есть
        const displayValue = column.formatter 
          ? column.formatter(value, record) 
          : value;

        const content = (
          <span 
            style={{ 
              textAlign: column.align || 'left',
              display: 'block',
              cursor: onRowClick ? 'pointer' : 'default'
            }}
            onClick={() => onRowClick?.(record)}
          >
            {displayValue}
          </span>
        );

        return content;
      }
    }));
  }, [columns, onRowClick]);

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h5 className="card-title mb-1">{title}</h5>}
          {subtitle && <div className="text-muted small">{subtitle}</div>}
        </div>
      )}
      
      {data.length === 0 ? (
        <div className="text-center p-4 text-muted">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <TableContainer
          columns={tableColumns}
          data={data}
          isGlobalFilter={globalFilter}
          customPageSize={pageSize}
          SearchPlaceholder={searchPlaceholder}
          divClass={className}
        />
      )}
    </div>
  );
};

export default Table;