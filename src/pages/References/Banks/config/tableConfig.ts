import { ColumnConfig } from '../../../../components/Common/Table';
import { 
  formatBankStatus, 
  formatBankRating, 
  formatBankTags, 
  formatActiveStatus 
} from './formaters';

// Интерфейс для банка
export interface Bank {
  id: number;
  name: string;
  short_name?: string;
  bik: string;
  correspondent_account?: string;
  swift_code?: string;
  registration_number?: string;
  license_number?: string;
  license_date?: string;
  region?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  status?: string;
  rating?: string;
  notes?: string;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Конфигурация колонок для таблицы банков
export const banksColumns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    width: 60,
    sortable: true,
    align: 'center'
  },
  {
    key: 'name',
    label: 'Наименование',
    width: 250,
    sortable: true,
    align: 'left'
  },
  {
    key: 'short_name',
    label: 'Краткое название',
    width: 150,
    sortable: true,
    align: 'left'
  },
  {
    key: 'bik',
    label: 'БИК',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    key: 'region',
    label: 'Регион',
    width: 120,
    sortable: true,
    align: 'left'
  },
  {
    key: 'status',
    label: 'Статус',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatBankStatus
  },
  {
    key: 'rating',
    label: 'Рейтинг',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatBankRating
  },
  {
    key: 'tags',
    label: 'Теги',
    width: 140,
    sortable: false,
    align: 'left',
    formatter: formatBankTags
  },
  {
    key: 'is_active',
    label: 'Активность',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatActiveStatus
  }
];

// Настройки таблицы
export const tableConfig = {
  pageSize: 10,
  showPagination: true,
  sortable: true,
  emptyMessage: 'Нет данных о банках. Выполните синхронизацию для загрузки данных.',
  className: 'banks-table',
  searchPlaceholder: 'Поиск по банкам...',
  globalFilter: true
};

// Мобильная версия (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'short_name',
    label: 'Банк',
    sortable: true,
    align: 'left'
  },
  {
    key: 'bik',
    label: 'БИК',
    sortable: true,
    align: 'center'
  },
  {
    key: 'status',
    label: 'Статус',
    sortable: true,
    align: 'center',
    formatter: formatBankStatus
  },
  {
    key: 'is_active',
    label: 'Активность',
    sortable: true,
    align: 'center',
    formatter: formatActiveStatus
  }
];

// Конфигурация для компактного отображения
export const compactColumns: ColumnConfig[] = [
  {
    key: 'short_name',
    label: 'Банк',
    width: 200,
    sortable: true
  },
  {
    key: 'bik',
    label: 'БИК',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    key: 'region',
    label: 'Регион',
    width: 120,
    sortable: true,
    align: 'left'
  },
  {
    key: 'status',
    label: 'Статус',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatBankStatus
  }
];

// Настройки фильтрации
export const filterConfig = {
  searchFields: ['name', 'short_name', 'bik', 'region'],
  filterFields: [
    {
      key: 'status',
      label: 'Статус банка',
      type: 'select' as const
    },
    {
      key: 'rating',
      label: 'Рейтинг',
      type: 'select' as const
    },
    {
      key: 'region',
      label: 'Регион',
      type: 'select' as const
    },
    {
      key: 'is_active',
      label: 'Активность',
      type: 'boolean' as const
    },
    {
      key: 'tags',
      label: 'Теги',
      type: 'multiselect' as const
    }
  ]
}; 
