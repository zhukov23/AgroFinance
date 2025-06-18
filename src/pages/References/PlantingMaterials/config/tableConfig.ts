import { ColumnConfig } from '../../../../components/Common/Table';
import { 
  formatMaterialType, 
  formatCropCategory,
  formatSeasonType,
  formatMaturityDays,
  formatPlantingRate,
  formatStatus,
  formatRating,
  formatActiveStatus 
} from './formaters';

// Интерфейс для посевного материала
export interface PlantingMaterial {
  id: number;
  name: string;
  material_type: string;
  scientific_name?: string;
  crop_category: string;
  variety?: string;
  season_type?: string;
  origin_country?: string;
  breeder?: string;
  maturity_days?: number;
  planting_rate?: number;
  planting_depth?: number;
  row_spacing?: number;
  plant_spacing?: number;
  potential_yield?: number;
  recommended_soil_types?: string[];
  ph_range_min?: number;
  ph_range_max?: number;
  frost_resistance?: number;
  drought_tolerance?: number;
  water_requirement?: string;
  planting_period_start?: string;
  planting_period_end?: string;
  harvest_period_start?: string;
  harvest_period_end?: string;
  disease_resistance?: string[];
  pest_resistance?: string[];
  storage_requirements?: string;
  shelf_life_months?: number;
  description?: string;
  cultivation_notes?: string;
  status?: string;
  rating?: number;
  notes?: string;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  manufacturer_id?: number;
}

// Конфигурация колонок для таблицы посевного материала
export const plantingMaterialsColumns: ColumnConfig[] = [
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
    key: 'material_type',
    label: 'Тип',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatMaterialType
  },
  {
    key: 'crop_category',
    label: 'Категория',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatCropCategory
  },
  {
    key: 'variety',
    label: 'Сорт',
    width: 150,
    sortable: true,
    align: 'left'
  },
  {
    key: 'season_type',
    label: 'Сезон',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatSeasonType
  },
  {
    key: 'maturity_days',
    label: 'Созревание',
    width: 140,
    sortable: true,
    align: 'center',
    formatter: formatMaturityDays
  },
  {
    key: 'planting_rate',
    label: 'Норма высева',
    width: 120,
    sortable: true,
    align: 'right',
    formatter: formatPlantingRate
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
  emptyMessage: 'Нет данных о посевном материале. Выполните синхронизацию для загрузки данных.',
  className: 'planting-materials-table',
  searchPlaceholder: 'Поиск по посевному материалу...',
  globalFilter: true
};

// Мобильная версия (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Материал',
    sortable: true,
    align: 'left'
  },
  {
    key: 'material_type',
    label: 'Тип',
    sortable: true,
    align: 'center',
    formatter: formatMaterialType
  },
  {
    key: 'crop_category',
    label: 'Категория',
    sortable: true,
    align: 'center',
    formatter: formatCropCategory
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
    label: 'Материал',
    width: 200,
    sortable: true
  },
  {
    key: 'material_type',
    label: 'Тип',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatMaterialType
  },
  {
    key: 'variety',
    label: 'Сорт',
    width: 120,
    sortable: true,
    align: 'left'
  },
  {
    key: 'maturity_days',
    label: 'Созревание',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatMaturityDays
  },
  {
    key: 'status',
    label: 'Статус',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatStatus
  }
];

// Настройки фильтрации
export const filterConfig = {
  searchFields: ['name', 'variety', 'scientific_name', 'breeder', 'origin_country'],
  filterFields: [
    {
      key: 'material_type',
      label: 'Тип материала',
      type: 'select' as const
    },
    {
      key: 'crop_category',
      label: 'Категория культуры',
      type: 'select' as const
    },
    {
      key: 'season_type',
      label: 'Сезонный тип',
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
      key: 'maturity_days',
      label: 'Срок созревания (дни)',
      type: 'range' as const
    },
    {
      key: 'planting_rate',
      label: 'Норма высева (кг/га)',
      type: 'range' as const
    }
  ]
}; 
