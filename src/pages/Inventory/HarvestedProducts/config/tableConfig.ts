import { ColumnConfig } from '../../../../components/Common/Table';
import { 
  formatQuantity,
  formatHarvestArea,
  formatMoistureContent,
  formatProteinContent,
  formatQualityClass,
  formatGrade,
  formatStatus,
  formatRating,
  formatPrice,
  formatDate,
  formatActiveStatus,
  formatQuantityAvailable
} from './formaters';

// Интерфейс для урожайной продукции
export interface HarvestedProduct {
  id: number;
  planting_id?: number;
  product_name: string;
  planting_material_id?: number;
  harvest_date: string;
  field_name?: string;
  harvest_area?: number;
  quantity: number;
  moisture_content?: number;
  protein_content?: number;
  oil_content?: number;
  gluten_content?: number;
  sugar_content?: number;
  starch_content?: number;
  impurities?: number;
  damaged_grains?: number;
  test_weight?: number;
  quality_class?: string;
  grade?: string;
  storage_date?: string;
  storage_conditions?: string;
  production_cost?: number;
  production_cost_per_unit?: number;
  market_price_at_harvest?: number;
  current_market_price?: number;
  lab_analysis_date?: string;
  lab_certificate_number?: string;
  additional_indicators?: any;
  quantity_sold?: number;
  quantity_processed?: number;
  quantity_reserved?: number;
  quantity_damaged?: number;
  quantity_available?: number;
  harvest_conditions?: string;
  processing_recommendations?: string;
  status?: string;
  rating?: number;
  notes?: string;
  tags?: string[];
  is_active?: boolean;
  storage_location_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Конфигурация колонок для таблицы урожайной продукции
export const harvestedProductsColumns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    width: 60,
    sortable: true,
    align: 'center'
  },
  {
    key: 'product_name',
    label: 'Наименование продукции',
    width: 200,
    sortable: true,
    align: 'left'
  },
  {
    key: 'harvest_date',
    label: 'Дата сбора',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatDate
  },
  {
    key: 'field_name',
    label: 'Поле',
    width: 120,
    sortable: true,
    align: 'left'
  },
  {
    key: 'harvest_area',
    label: 'Площадь',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatHarvestArea
  },
  {
    key: 'quantity',
    label: 'Количество',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatQuantity
  },
  {
    key: 'moisture_content',
    label: 'Влажность',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatMoistureContent
  },
  {
    key: 'protein_content',
    label: 'Белок',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatProteinContent
  },
  {
    key: 'quality_class',
    label: 'Класс',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatQualityClass
  },
  {
    key: 'grade',
    label: 'Сорт',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatGrade
  },
  {
    key: 'current_market_price',
    label: 'Цена',
    width: 120,
    sortable: true,
    align: 'right',
    formatter: (value: number) => formatPrice(value, 'руб/т')
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
  emptyMessage: 'Нет данных об урожайной продукции. Выполните синхронизацию для загрузки данных.',
  className: 'harvested-products-table',
  searchPlaceholder: 'Поиск по урожайной продукции...',
  globalFilter: true
};

// Мобильная версия (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'product_name',
    label: 'Продукция',
    sortable: true,
    align: 'left'
  },
  {
    key: 'harvest_date',
    label: 'Дата сбора',
    sortable: true,
    align: 'center',
    formatter: formatDate
  },
  {
    key: 'quantity',
    label: 'Количество',
    sortable: true,
    align: 'center',
    formatter: formatQuantity
  },
  {
    key: 'status',
    label: 'Статус',
    sortable: true,
    align: 'center',
    formatter: formatStatus
  }
];

// Конфигурация для компактного отображения
export const compactColumns: ColumnConfig[] = [
  {
    key: 'product_name',
    label: 'Продукция',
    width: 180,
    sortable: true
  },
  {
    key: 'harvest_date',
    label: 'Дата сбора',
    width: 110,
    sortable: true,
    align: 'center',
    formatter: formatDate
  },
  {
    key: 'quantity',
    label: 'Количество',
    width: 110,
    sortable: true,
    align: 'center',
    formatter: formatQuantity
  },
  {
    key: 'quality_class',
    label: 'Класс',
    width: 90,
    sortable: true,
    align: 'center',
    formatter: formatQualityClass
  },
  {
    key: 'moisture_content',
    label: 'Влажность',
    width: 110,
    sortable: true,
    align: 'center',
    formatter: formatMoistureContent
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
  searchFields: ['product_name', 'field_name', 'lab_certificate_number', 'notes'],
  filterFields: [
    {
      key: 'status',
      label: 'Статус',
      type: 'select' as const
    },
    {
      key: 'quality_class',
      label: 'Класс качества',
      type: 'select' as const
    },
    {
      key: 'grade',
      label: 'Сорт/Марка',
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
      key: 'harvest_date',
      label: 'Дата сбора',
      type: 'dateRange' as const
    },
    {
      key: 'quantity',
      label: 'Количество (т)',
      type: 'range' as const
    },
    {
      key: 'moisture_content',
      label: 'Влажность (%)',
      type: 'range' as const
    },
    {
      key: 'protein_content',
      label: 'Белок (%)',
      type: 'range' as const
    },
    {
      key: 'current_market_price',
      label: 'Цена (руб/т)',
      type: 'range' as const
    },
    {
      key: 'storage_location_id',
      label: 'Место хранения',
      type: 'select' as const
    }
  ]
}; 
