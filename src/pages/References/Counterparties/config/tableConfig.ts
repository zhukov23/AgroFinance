import { ColumnConfig } from '../../../../components/Common/Table';
import { 
  formatCounterpartyType, 
  formatCreditLimit, 
  formatRating, 
  formatActiveStatus 
} from './formaters';
// Интерфейс для контрагента
// Интерфейс для контрагента
export interface Counterparty {
  legal_name: any;
  legal_address: any;
  contact_email: any;
  contract_number: any;
  contract_date: any;
  contact_phone: any;
  id: number;
  full_name: string;
  short_name?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  counterparty_type: string[];
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  payment_terms?: string;
  credit_limit?: number;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  rating?: string;
  deleted_at?: string;
  website?: string;
  postal_address?: string;
  director_name?: string;
  director_position?: string;
  logo_url?: string;
  vat_status?: string;
  vat_rate?: string;
  okved_code?: string;
  tax_system?: string;
  registration_date?: string;
  registration_authority?: string;
  charter_capital?: number;
  participants_count?: number;
}

// Конфигурация колонок для таблицы контрагентов
export const counterpartiesColumns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    width: 60,
    sortable: true,
    align: 'center'
  },
  {
    key: 'full_name',
    label: 'Наименование',
    width: 200,
    sortable: true,
    align: 'left'
  },
  {
    key: 'inn',
    label: 'ИНН',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'counterparty_type',
    label: 'Тип',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatCounterpartyType
  },
  {
    key: 'contact_person',
    label: 'Контактное лицо',
    width: 180,
    sortable: true,
    align: 'left'
  },
  {
    key: 'phone',
    label: 'Телефон',
    width: 130,
    sortable: true,
    align: 'center'
  },
  {
    key: 'credit_limit',
    label: 'Кредитный лимит',
    width: 140,
    sortable: true,
    align: 'right',
    formatter: formatCreditLimit
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
    key: 'is_active',
    label: 'Статус',
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
  emptyMessage: 'Нет данных о контрагентах. Выполните синхронизацию для загрузки данных.',
  className: 'counterparties-table',
  searchPlaceholder: 'Поиск по контрагентам...',
  globalFilter: true
};

// Мобильная версия (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'short_name',
    label: 'Контрагент',
    sortable: true,
    align: 'left'
  },
  {
    key: 'inn',
    label: 'ИНН',
    sortable: true,
    align: 'center'
  },
  {
    key: 'counterparty_type',
    label: 'Тип',
    sortable: true,
    align: 'center'
  },
  {
    key: 'is_active',
    label: 'Статус',
    sortable: true,
    align: 'center'
  }
];

// Конфигурация для компактного отображения
export const compactColumns: ColumnConfig[] = [
  {
    key: 'short_name',
    label: 'Контрагент',
    width: 200,
    sortable: true
  },
  {
    key: 'inn',
    label: 'ИНН',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'counterparty_type',
    label: 'Тип',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'credit_limit',
    label: 'Лимит',
    width: 120,
    sortable: true,
    align: 'right'
  }
];

// Настройки фильтрации (для будущего использования)
export const filterConfig = {
  searchFields: ['full_name', 'short_name', 'inn', 'kpp', 'ogrn', 'contact_person'],
  filterFields: [
    {
      key: 'counterparty_type',
      label: 'Тип контрагента',
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
      key: 'credit_limit',
      label: 'Кредитный лимит',
      type: 'range' as const
    }
  ]
};