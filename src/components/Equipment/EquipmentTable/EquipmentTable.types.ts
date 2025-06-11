export interface EquipmentRecord {
  id: number;
  name: string;
  equipment_code: string;
  category: string;
  manufacturer: string;
  model: string;
  country_origin: string;
  engine_power: string;
  fuel_consumption: string;
  fuel_type: string;
  purchase_price: string;
  season_usage: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  equipment_type_id: number;
}

export interface ColumnConfig {
  key: keyof EquipmentRecord;
  label: string;
  width?: number;
  sortable?: boolean;
  formatter?: (value: any, record: EquipmentRecord) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface EquipmentTableProps {
  data: EquipmentRecord[];
  columns: ColumnConfig[];
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
  sortable?: boolean;
  className?: string;
  onRowClick?: (record: EquipmentRecord) => void;
  onSort?: (key: keyof EquipmentRecord, direction: 'asc' | 'desc') => void;
}

export interface TableHeaderProps {
  columns: ColumnConfig[];
  sortKey?: keyof EquipmentRecord;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: keyof EquipmentRecord) => void;
  sortable: boolean;
}

export interface TableRowProps {
  record: EquipmentRecord;
  columns: ColumnConfig[];
  onRowClick?: (record: EquipmentRecord) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}