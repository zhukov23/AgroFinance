import React, { useState, useMemo } from 'react';
import { 
  EquipmentTableProps, 
  TableHeaderProps, 
  TableRowProps, 
  PaginationProps,
  EquipmentRecord,
  ColumnConfig 
} from './EquipmentTable.types';

// Утилитарные функции
const formatCurrency = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};

// Компонент пагинации
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange
}) => {
  const pageSizes = [5, 10, 20, 50];
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderTop: '1px solid #e5e7eb',
      fontSize: '14px'
    }}>
      <div style={{ color: '#6b7280' }}>
        Показано {Math.min((currentPage - 1) * pageSize + 1, totalRecords)}-{Math.min(currentPage * pageSize, totalRecords)} из {totalRecords} записей
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280' }}>Показывать:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '13px'
            }}
          >
            {pageSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: currentPage <= 1 ? '#f9fafb' : 'white',
              color: currentPage <= 1 ? '#9ca3af' : '#374151',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            ← Пред
          </button>
          
          <span style={{ padding: '0 12px', color: '#374151' }}>
            {currentPage} из {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: currentPage >= totalPages ? '#f9fafb' : 'white',
              color: currentPage >= totalPages ? '#9ca3af' : '#374151',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            След →
          </button>
        </div>
      </div>
    </div>
  );
};

// Компонент заголовка таблицы
const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  sortKey,
  sortDirection,
  onSort,
  sortable
}) => {
  return (
    <thead>
      <tr style={{ backgroundColor: '#f9fafb' }}>
        {columns.map((column) => (
          <th
            key={column.key}
            style={{
              padding: '12px 8px',
              textAlign: column.align || 'left',
              borderBottom: '2px solid #e5e7eb',
              fontWeight: 'bold',
              fontSize: '13px',
              color: '#374151',
              cursor: sortable && column.sortable !== false ? 'pointer' : 'default',
              userSelect: 'none',
              width: column.width || 'auto'
            }}
            onClick={() => {
              if (sortable && column.sortable !== false && onSort) {
                onSort(column.key);
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {column.label}
              {sortable && column.sortable !== false && sortKey === column.key && (
                <span style={{ fontSize: '10px' }}>
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

// Компонент строки таблицы
const TableRow: React.FC<TableRowProps> = ({ record, columns, onRowClick }) => {
  return (
    <tr
      style={{
        cursor: onRowClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f9fafb';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      onClick={() => onRowClick?.(record)}
    >
      {columns.map((column) => {
        const value = record[column.key];
        let displayValue: React.ReactNode = value;

        if (column.formatter) {
          displayValue = column.formatter(value, record);
        } else {
          // Автоматическое форматирование
          switch (column.key) {
            case 'purchase_price':
              displayValue = formatCurrency(String(value));
              break;
            case 'created_at':
            case 'updated_at':
              displayValue = formatDate(String(value));
              break;
            case 'is_active':
              displayValue = value ? (
                <span style={{ color: '#059669', fontWeight: 'bold' }}>✓ Активна</span>
              ) : (
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✗ Неактивна</span>
              );
              break;
            case 'engine_power':
            case 'fuel_consumption':
              displayValue = value ? `${value} ${column.key === 'engine_power' ? 'л.с.' : 'л/ч'}` : '—';
              break;
          }
        }

        return (
          <td
            key={column.key}
            style={{
              padding: '12px 8px',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '13px',
              textAlign: column.align || 'left',
              color: '#374151'
            }}
          >
            {displayValue}
          </td>
        );
      })}
    </tr>
  );
};

// Основной компонент таблицы
export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'Нет данных для отображения',
  pageSize = 10,
  showPagination = true,
  sortable = true,
  className = '',
  onRowClick,
  onSort
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortKey, setSortKey] = useState<keyof EquipmentRecord | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Сортировка данных
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [data, sortKey, sortDirection]);

  // Пагинация
  const totalPages = Math.ceil(sortedData.length / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const paginatedData = showPagination 
    ? sortedData.slice(startIndex, startIndex + currentPageSize)
    : sortedData;

  // Обработчик сортировки
  const handleSort = (key: keyof EquipmentRecord) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Сброс на первую страницу при сортировке
    onSort?.(key, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Обработчик смены страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Обработчик смены размера страницы
  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
          🔄 Загрузка данных...
        </div>
        <div style={{ fontSize: '13px', color: '#9ca3af' }}>
          Пожалуйста, подождите
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
          📋 {emptyMessage}
        </div>
        <div style={{ fontSize: '13px', color: '#9ca3af' }}>
          Выполните синхронизацию для загрузки данных
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            sortable={sortable}
          />
          <tbody>
            {paginatedData.map((record) => (
              <TableRow
                key={record.id}
                record={record}
                columns={columns}
                onRowClick={onRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={currentPageSize}
          totalRecords={sortedData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};