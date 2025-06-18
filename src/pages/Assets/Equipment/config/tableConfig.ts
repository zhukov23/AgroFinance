import { ColumnConfig } from '../../../../components/Common/Table';
import { 
  formatCategory,
  formatFuelType,
  formatSeasonUsage,
  formatEnginePower,
  formatWorkingWidth,
  formatCapacity,
  formatPrice,
  formatWeight,
  formatManufacturer,
  formatSuitableCrops,
  formatActiveStatus,
  formatMaintenanceCost,
  formatWorkingSpeed
} from './formaters';

// Интерфейс для техники
export interface Equipment {
  id: number;
  name: string;
  equipment_code?: string;
  category: string;
  subcategory?: string;
  manufacturer?: string;
  model?: string;
  country_origin?: string;
  engine_power?: number;
  engine_volume?: number;
  fuel_type?: string;
  fuel_consumption?: number;
  working_width?: number;
  working_speed_min?: number;
  working_speed_max?: number;
  capacity?: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  weight_kg?: number;
  purchase_price?: number;
  depreciation_period_years?: number;
  maintenance_cost_per_hour?: number;
  suitable_crops?: string[];
  season_usage?: string;
  min_field_size?: number;
  description?: string;
  specifications?: any;
  attachments?: any;
  certifications?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Конфигурация колонок для таблицы техники
export const equipmentColumns: ColumnConfig[] = [
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
    key: 'equipment_code',
    label: 'Код',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    key: 'category',
    label: 'Категория',
    width: 140,
    sortable: true,
    align: 'center',
    formatter: formatCategory
  },
  {
    key: 'manufacturer',
    label: 'Производитель',
    width: 150,
    sortable: true,
    align: 'left',
    formatter: (manufacturer: string, record: Equipment) => 
      formatManufacturer(manufacturer, record.model)
  },
  {
    key: 'engine_power',
    label: 'Мощность',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatEnginePower
  },
  {
    key: 'fuel_type',
    label: 'Топливо',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatFuelType
  },
  {
    key: 'working_width',
    label: 'Раб. ширина',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatWorkingWidth
  },
  {
    key: 'capacity',
    label: 'Производительность',
    width: 140,
    sortable: true,
    align: 'center',
    formatter: formatCapacity
  },
  {
    key: 'purchase_price',
    label: 'Цена',
    width: 120,
    sortable: true,
    align: 'right',
    formatter: formatPrice
  },
  {
    key: 'season_usage',
    label: 'Сезон',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatSeasonUsage
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
  emptyMessage: 'Нет данных о технике. Выполните синхронизацию для загрузки данных.',
  className: 'equipment-table',
  searchPlaceholder: 'Поиск по технике...',
  globalFilter: true
};

// Мобильная версия (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Техника',
    sortable: true,
    align: 'left'
  },
  {
    key: 'category',
    label: 'Категория',
    sortable: true,
    align: 'center',
    formatter: formatCategory
  },
  {
    key: 'manufacturer',
    label: 'Производитель',
    sortable: true,
    align: 'left',
    formatter: (manufacturer: string, record: Equipment) => 
      formatManufacturer(manufacturer, record.model)
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
    label: 'Техника',
    width: 180,
    sortable: true
  },
  {
    key: 'category',
    label: 'Категория',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatCategory
  },
  {
    key: 'manufacturer',
    label: 'Производитель',
    width: 130,
    sortable: true,
    align: 'left',
    formatter: (manufacturer: string, record: Equipment) => 
      formatManufacturer(manufacturer, record.model)
  },
  {
    key: 'engine_power',
    label: 'Мощность',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatEnginePower
  },
  {
    key: 'working_width',
    label: 'Раб. ширина',
    width: 110,
    sortable: true,
    align: 'center',
    formatter: formatWorkingWidth
  },
  {
    key: 'purchase_price',
    label: 'Цена',
    width: 100,
    sortable: true,
    align: 'right',
    formatter: formatPrice
  }
];

// Настройки фильтрации
export const filterConfig = {
  searchFields: ['name', 'equipment_code', 'manufacturer', 'model', 'description'],
  filterFields: [
    {
      key: 'category',
      label: 'Категория',
      type: 'select' as const
    },
    {
      key: 'fuel_type',
      label: 'Тип топлива',
      type: 'select' as const
    },
    {
      key: 'season_usage',
      label: 'Сезон использования',
      type: 'select' as const
    },
    {
      key: 'manufacturer',
      label: 'Производитель',
      type: 'select' as const
    },
    {
      key: 'country_origin',
      label: 'Страна происхождения',
      type: 'select' as const
    },
    {
      key: 'is_active',
      label: 'Активность',
      type: 'boolean' as const
    },
    {
      key: 'engine_power',
      label: 'Мощность двигателя (л.с.)',
      type: 'range' as const
    },
    {
      key: 'working_width',
      label: 'Рабочая ширина (м)',
      type: 'range' as const
    },
    {
      key: 'capacity',
      label: 'Производительность (га/ч)',
      type: 'range' as const
    },
    {
      key: 'purchase_price',
      label: 'Цена покупки (руб)',
      type: 'range' as const
    },
    {
      key: 'weight_kg',
      label: 'Вес (кг)',
      type: 'range' as const
    }
  ]
}; 
