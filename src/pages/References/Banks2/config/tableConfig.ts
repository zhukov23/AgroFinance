import { ColumnConfig } from '../../../../components/Common/Table';

// Интерфейс для банка
export interface Bank {
  id: number;
  name: string;
  short_name: string;
  bik: string;
  correspondent_account: string;
  registration_number: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  swift_code: string;
  region: string;
  license_number: string;
  license_date: string;
  status: string;
  rating: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Конфигурация колонок для таблицы банков
export const banksColumns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    width: 80,
    sortable: true,
    align: 'center'
  },
  {
    key: 'short_name',
    label: 'Наименование',
    width: 250,
    sortable: true,
    align: 'left'
  },
  {
    key: 'bik',
    label: 'БИК',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'correspondent_account',
    label: 'Корр. счет',
    width: 200,
    sortable: true,
    align: 'center'
  },
  {
    key: 'phone',
    label: 'Телефон',
    width: 150,
    sortable: false,
    align: 'left'
  },
  {
    key: 'email',
    label: 'Email',
    width: 180,
    sortable: false,
    align: 'left'
  },
  {
    key: 'swift_code',
    label: 'SWIFT',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'license_number',
    label: 'Лицензия',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'rating',
    label: 'Рейтинг',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'status',
    label: 'Статус',
    width: 120,
    sortable: true,
    align: 'center'
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
    key: 'rating',
    label: 'Рейтинг',
    sortable: true,
    align: 'center'
  },
  {
    key: 'status',
    label: 'Статус',
    sortable: true,
    align: 'center'
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
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'swift_code',
    label: 'SWIFT',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'status',
    label: 'Статус',
    width: 120,
    sortable: true,
    align: 'center'
  }
];

// Настройки фильтрации (для будущего использования)
export const filterConfig = {
  searchFields: ['name', 'short_name', 'bik', 'swift_code'],
  filterFields: [
    {
      key: 'rating',
      label: 'Рейтинг',
      type: 'select' as const
    },
    {
      key: 'status',
      label: 'Статус',
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
    }
  ]
};