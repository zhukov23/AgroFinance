// src/pages/References/Pesticides/config/tableConfig.ts

import { ColumnConfig } from '../../../../components/Common/Table';
import { 
  formatPesticideType, 
  formatHazardClass, 
  formatPhysicalForm,
  formatRegistrationStatus,
  formatActiveSubstances,
  formatPrice,
  formatPackageSize,
  formatActiveStatus,
  formatCounterparty
} from './formaters';

// Интерфейс для пестицида
export interface Pesticide {
  id: number;
  name: string;
  trade_name?: string;
  registration_number?: string;
  manufacturer_id?: number;
  supplier_id?: number;
  pesticide_type: string;
  hazard_class: string;
  physical_form: string;
  active_substances: any[];
  concentration_info?: any;
  target_pests?: any[];
  target_crops?: any[];
  application_method?: string;
  dosage_info?: any;
  registration_status?: string;
  registration_date?: string;
  expiry_date?: string;
  registration_authority?: string;
  base_price?: number;
  currency_code?: string;
  price_per_unit?: string;
  package_size?: number;
  package_unit?: string;
  storage_conditions?: string;
  shelf_life_months?: number;
  safety_precautions?: string;
  antidote_info?: string;
  ph_range?: any;
  temperature_range?: any;
  compatibility_info?: any;
  certificates?: any;
  documents?: any;
  is_active?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  manufacturer?: any; // Для связанного производителя
  supplier?: any; // Для связанного поставщика
}

// Форматтер для названия с торговым названием
const formatPesticideName = (text: string, record: Pesticide) => {
  if (record.trade_name) {
    return `${text} (${record.trade_name})`;
  }
  return text;
};

// Форматтер для активных веществ с парсингом JSON
const formatActiveSubstancesColumn = (substances: any) => {
  let parsedSubstances = substances;
  if (typeof substances === 'string') {
    try {
      parsedSubstances = JSON.parse(substances);
    } catch {
      return 'Не указано';
    }
  }
  if (!Array.isArray(parsedSubstances) || parsedSubstances.length === 0) {
    return 'Не указано';
  }
  
  // Показываем первые 2 вещества
  const firstTwo = parsedSubstances.slice(0, 2);
  const result = firstTwo.map(substance => 
    `${substance.substance} - ${substance.concentration}${substance.unit}`
  ).join('; ');
  
  if (parsedSubstances.length > 2) {
    return `${result} (+${parsedSubstances.length - 2})`;
  }
  
  return result;
};

// Форматтер для регистрационного номера
const formatRegistrationNumber = (text: string) => {
  return text || 'Не указан';
};

// Форматтер для даты истечения с проверкой
const formatExpiryDate = (date: string) => {
  if (!date) return 'Не указан';
  
  const expiryDate = new Date(date);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const formattedDate = expiryDate.toLocaleDateString('ru-RU');
  
  if (diffDays < 0) return `⚠️ ${formattedDate}`;
  if (diffDays < 90) return `⚡ ${formattedDate}`;
  return `✅ ${formattedDate}`;
};

// Форматтер для даты обновления
const formatUpdatedDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString('ru-RU') : '—';
};

// Форматтер для мобильной версии названия
const formatMobilePesticideName = (text: string, record: Pesticide) => {
  const type = formatPesticideType(record.pesticide_type);
  const hazard = record.hazard_class;
  let result = `${text}\n${type} • ${hazard} класс`;
  if (record.trade_name) {
    result += `\n${record.trade_name}`;
  }
  return result;
};

// Конфигурация колонок для таблицы пестицидов
export const pesticideColumns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    width: 60,
    sortable: true,
    align: 'center'
  },
  {
    key: 'name',
    label: 'Название препарата',
    width: 200,
    sortable: true,
    align: 'left',
    formatter: formatPesticideName
  },
  {
    key: 'pesticide_type',
    label: 'Тип',
    width: 130,
    sortable: true,
    align: 'center',
    formatter: formatPesticideType
  },
  {
    key: 'hazard_class',
    label: 'Класс опасности',
    width: 140,
    sortable: true,
    align: 'center',
    formatter: formatHazardClass
  },
  {
    key: 'physical_form',
    label: 'Форма',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatPhysicalForm
  },
  {
    key: 'active_substances',
    label: 'Активные вещества',
    width: 200,
    sortable: false,
    align: 'left',
    formatter: formatActiveSubstancesColumn
  },
  {
    key: 'manufacturer',
    label: 'Производитель',
    width: 160,
    sortable: false,
    align: 'left',
    formatter: formatCounterparty
  },
  {
    key: 'registration_number',
    label: 'Рег. номер',
    width: 140,
    sortable: true,
    align: 'center',
    formatter: formatRegistrationNumber
  },
  {
    key: 'registration_status',
    label: 'Статус регистрации',
    width: 130,
    sortable: true,
    align: 'center',
    formatter: formatRegistrationStatus
  },
  {
    key: 'expiry_date',
    label: 'Срок действия',
    width: 110,
    sortable: true,
    align: 'center',
    formatter: formatExpiryDate
  },
  {
    key: 'package_info',
    label: 'Упаковка',
    width: 120,
    sortable: false,
    align: 'center',
    formatter: (value, record) => formatPackageSize(record.package_size || 0, record.package_unit || '')
  },
  {
    key: 'base_price',
    label: 'Цена',
    width: 120,
    sortable: true,
    align: 'right',
    formatter: (value, record) => formatPrice(record.base_price || 0, record.currency_code, record.price_per_unit)
  },
  {
    key: 'is_active',
    label: 'Статус',
    width: 90,
    sortable: true,
    align: 'center',
    formatter: formatActiveStatus
  },
  {
    key: 'updated_at',
    label: 'Обновлено',
    width: 110,
    sortable: true,
    align: 'center',
    formatter: formatUpdatedDate
  }
];

// Настройки таблицы
export const tableConfig = {
  pageSize: 25,
  showPagination: true,
  sortable: true,
  emptyMessage: 'Нет данных о пестицидах. Выполните синхронизацию для загрузки данных.',
  className: 'pesticides-table',
  searchPlaceholder: 'Поиск по названию, торговому названию, рег. номеру...',
  globalFilter: true
};

// Мобильная версия (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Препарат',
    sortable: true,
    align: 'left',
    formatter: formatMobilePesticideName
  },
  {
    key: 'pesticide_type',
    label: 'Тип',
    sortable: true,
    align: 'center',
    formatter: formatPesticideType
  },
  {
    key: 'hazard_class',
    label: 'Класс',
    sortable: true,
    align: 'center',
    formatter: formatHazardClass
  },
  {
    key: 'registration_status',
    label: 'Регистрация',
    sortable: true,
    align: 'center',
    formatter: formatRegistrationStatus
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
    label: 'Название',
    width: 180,
    sortable: true,
    align: 'left'
  },
  {
    key: 'pesticide_type',
    label: 'Тип',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatPesticideType
  },
  {
    key: 'hazard_class',
    label: 'Класс',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatHazardClass
  },
  {
    key: 'physical_form',
    label: 'Форма',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatPhysicalForm
  },
  {
    key: 'registration_status',
    label: 'Регистрация',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatRegistrationStatus
  },
  {
    key: 'base_price',
    label: 'Цена',
    width: 100,
    sortable: true,
    align: 'right',
    formatter: (value, record) => formatPrice(value || 0, record.currency_code, record.price_per_unit)
  },
  {
    key: 'is_active',
    label: 'Статус',
    width: 80,
    sortable: true,
    align: 'center',
    formatter: formatActiveStatus
  }
];

// Настройки фильтрации
export const filterConfig = {
  searchFields: ['name', 'trade_name', 'registration_number', 'notes'],
  filterFields: [
    {
      key: 'pesticide_type',
      label: 'Тип пестицида',
      type: 'select' as const
    },
    {
      key: 'hazard_class',
      label: 'Класс опасности',
      type: 'select' as const
    },
    {
      key: 'physical_form',
      label: 'Физическая форма',
      type: 'select' as const
    },
    {
      key: 'registration_status',
      label: 'Статус регистрации',
      type: 'select' as const
    },
    {
      key: 'currency_code',
      label: 'Валюта',
      type: 'select' as const
    },
    {
      key: 'is_active',
      label: 'Активность',
      type: 'boolean' as const
    },
    {
      key: 'base_price',
      label: 'Базовая цена',
      type: 'range' as const
    },
    {
      key: 'package_size',
      label: 'Размер упаковки',
      type: 'range' as const
    },
    {
      key: 'shelf_life_months',
      label: 'Срок годности (мес.)',
      type: 'range' as const
    }
  ]
};