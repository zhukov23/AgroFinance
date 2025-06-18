import { ColumnConfig } from '../../../../components/Common/Table';
import { 
  formatStorageType, 
  formatCapacity,
  formatRentalCost,
  formatSecurityLevel,
  formatStatus,
  formatRating,
  formatActiveStatus,
  formatStorageTypesAllowed,
  formatTags,
  formatEquipment,
  formatContact,
  formatContract
} from './formaters';

// Интерфейс для места хранения
export interface StorageLocation {
  id: number;
  name: string;
  code?: string;
  storage_type: string;
  counterparty_id?: number;
  address?: string;
  coordinates?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  total_capacity?: number;
  available_capacity?: number;
  storage_conditions?: string;
  storage_types_allowed?: string[];
  rental_cost_per_ton?: number;
  contract_number?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  has_grain_dryer?: boolean;
  has_cleaning_equipment?: boolean;
  has_scales?: boolean;
  has_loading_equipment?: boolean;
  security_level?: string;
  status?: string;
  rating?: number;
  notes?: string;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Конфигурация колонок для таблицы мест хранения
export const storageLocationsColumns: ColumnConfig[] = [
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
    width: 200,
    sortable: true,
    align: 'left'
  },
  {
    key: 'code',
    label: 'Код',
    width: 80,
    sortable: true,
    align: 'center'
  },
  {
    key: 'storage_type',
    label: 'Тип',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatStorageType
  },
  {
    key: 'address',
    label: 'Адрес',
    width: 200,
    sortable: true,
    align: 'left'
  },
  {
    key: 'total_capacity',
    label: 'Общая емкость',
    width: 130,
    sortable: true,
    align: 'right',
    formatter: formatCapacity
  },
  {
    key: 'available_capacity',
    label: 'Доступно',
    width: 120,
    sortable: true,
    align: 'right',
    formatter: formatCapacity
  },
  {
    key: 'storage_types_allowed',
    label: 'Типы хранения',
    width: 150,
    sortable: false,
    align: 'left',
    formatter: formatStorageTypesAllowed
  },
  {
    key: 'rental_cost_per_ton',
    label: 'Стоимость аренды',
    width: 140,
    sortable: true,
    align: 'right',
    formatter: formatRentalCost
  },
  {
    key: 'contact',
    label: 'Контакты',
    width: 180,
    sortable: false,
    align: 'left',
    formatter: (value, record) => formatContact(
      record.contact_person,
      record.phone,
      record.email
    )
  },
  {
    key: 'equipment',
    label: 'Оборудование',
    width: 140,
    sortable: false,
    align: 'left',
    formatter: (value, record) => formatEquipment(
      record.has_grain_dryer,
      record.has_cleaning_equipment,
      record.has_scales,
      record.has_loading_equipment
    )
  },
  {
    key: 'security_level',
    label: 'Безопасность',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatSecurityLevel
  },
  {
    key: 'status',
    label: 'Статус',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatStatus
  },
  {
    key: 'rating',
    label: 'Рейтинг',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatRating
  },
  {
    key: 'tags',
    label: 'Теги',
    width: 150,
    sortable: false,
    align: 'left',
    formatter: formatTags
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
  emptyMessage: 'Нет данных о местах хранения. Выполните синхронизацию для загрузки данных.',
  className: 'storage-locations-table',
  searchPlaceholder: 'Поиск по местам хранения...',
  globalFilter: true
};

// Мобильная версия (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Место хранения',
    sortable: true,
    align: 'left'
  },
  {
    key: 'storage_type',
    label: 'Тип',
    sortable: true,
    align: 'center',
    formatter: formatStorageType
  },
  {
    key: 'total_capacity',
    label: 'Емкость',
    sortable: true,
    align: 'right',
    formatter: formatCapacity
  },
  {
    key: 'status',
    label: 'Статус',
    sortable: true,
    align: 'center',
    formatter: formatStatus
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
    key: 'name',
    label: 'Место хранения',
    width: 200,
    sortable: true
  },
  {
    key: 'code',
    label: 'Код',
    width: 80,
    sortable: true,
    align: 'center'
  },
  {
    key: 'storage_type',
    label: 'Тип',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatStorageType
  },
  {
    key: 'total_capacity',
    label: 'Емкость',
    width: 120,
    sortable: true,
    align: 'right',
    formatter: formatCapacity
  },
  {
    key: 'status',
    label: 'Статус',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatStatus
  },
  {
    key: 'rating',
    label: 'Рейтинг',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatRating
  }
];

// Настройки фильтрации
export const filterConfig = {
  searchFields: ['name', 'code', 'address', 'contact_person', 'phone', 'email', 'contract_number'],
  filterFields: [
    {
      key: 'storage_type',
      label: 'Тип хранилища',
      type: 'select' as const
    },
    {
      key: 'security_level',
      label: 'Уровень безопасности',
      type: 'select' as const
    },
    {
      key: 'status',
      label: 'Статус',
      type: 'select' as const
    },
    {
      key: 'rating',
      label: 'Рейтинг',
      type: 'select' as const
    },
    {
      key: 'is_active',
      label: 'Активность',
      type: 'boolean' as const
    },
    {
      key: 'has_grain_dryer',
      label: 'Есть сушилка',
      type: 'boolean' as const
    },
    {
      key: 'has_cleaning_equipment',
      label: 'Есть очистка',
      type: 'boolean' as const
    },
    {
      key: 'has_scales',
      label: 'Есть весы',
      type: 'boolean' as const
    },
    {
      key: 'has_loading_equipment',
      label: 'Есть погрузка',
      type: 'boolean' as const
    },
    {
      key: 'total_capacity',
      label: 'Общая емкость (т)',
      type: 'range' as const
    },
    {
      key: 'available_capacity',
      label: 'Доступная емкость (т)',
      type: 'range' as const
    },
    {
      key: 'rental_cost_per_ton',
      label: 'Стоимость аренды (₽/т)',
      type: 'range' as const
    }
  ]
}; 
