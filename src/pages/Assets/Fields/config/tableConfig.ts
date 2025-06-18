import { ColumnConfig } from '../../../../components/Common/Table';
import { 
  formatSoilType,
  formatIrrigationType,
  formatFieldStatus,
  formatArea,
  formatSoilQuality,
  formatLocation,
  formatSoilAnalysis,
  formatInfrastructure,
  formatActiveStatus,
  formatCadastralNumber
} from './formaters';

// Интерфейс для поля
export interface Field {
  id: number;
  field_name: string;
  field_code?: string;
  area_hectares: number;
  soil_type: string;
  soil_quality_score?: number;
  irrigation_type?: string;
  field_status?: string;
  location?: any;
  boundaries?: any;
  soil_analysis?: any;
  terrain_features?: any;
  infrastructure?: any;
  cadastral_number?: string;
  ownership_documents?: any;
  restrictions?: any;
  special_features?: any;
  usage_history?: any;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Конфигурация колонок для таблицы полей
export const fieldsColumns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    width: 60,
    sortable: true,
    align: 'center'
  },
  {
    key: 'field_name',
    label: 'Название поля',
    width: 180,
    sortable: true,
    align: 'left'
  },
  {
    key: 'field_code',
    label: 'Код',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    key: 'area_hectares',
    label: 'Площадь',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatArea
  },
  {
    key: 'soil_type',
    label: 'Тип почвы',
    width: 140,
    sortable: true,
    align: 'center',
    formatter: formatSoilType
  },
  {
    key: 'soil_quality_score',
    label: 'Качество почвы',
    width: 140,
    sortable: true,
    align: 'center',
    formatter: formatSoilQuality
  },
  {
    key: 'irrigation_type',
    label: 'Орошение',
    width: 130,
    sortable: true,
    align: 'center',
    formatter: formatIrrigationType
  },
  {
    key: 'field_status',
    label: 'Статус',
    width: 130,
    sortable: true,
    align: 'center',
    formatter: formatFieldStatus
  },
  {
    key: 'location',
    label: 'Местоположение',
    width: 180,
    sortable: false,
    align: 'left',
    formatter: formatLocation
  },
  {
    key: 'cadastral_number',
    label: 'Кадастровый номер',
    width: 150,
    sortable: true,
    align: 'center',
    formatter: formatCadastralNumber
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
  emptyMessage: 'Нет данных о полях. Выполните синхронизацию для загрузки данных.',
  className: 'fields-table',
  searchPlaceholder: 'Поиск по полям...',
  globalFilter: true
};

// Мобильная версия (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'field_name',
    label: 'Поле',
    sortable: true,
    align: 'left'
  },
  {
    key: 'area_hectares',
    label: 'Площадь',
    sortable: true,
    align: 'center',
    formatter: formatArea
  },
  {
    key: 'soil_type',
    label: 'Почва',
    sortable: true,
    align: 'center',
    formatter: formatSoilType
  },
  {
    key: 'field_status',
    label: 'Статус',
    sortable: true,
    align: 'center',
    formatter: formatFieldStatus
  }
];

// Конфигурация для компактного отображения
export const compactColumns: ColumnConfig[] = [
  {
    key: 'field_name',
    label: 'Поле',
    width: 150,
    sortable: true
  },
  {
    key: 'field_code',
    label: 'Код',
    width: 80,
    sortable: true,
    align: 'center'
  },
  {
    key: 'area_hectares',
    label: 'Площадь',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatArea
  },
  {
    key: 'soil_type',
    label: 'Почва',
    width: 120,
    sortable: true,
    align: 'center',
    formatter: formatSoilType
  },
  {
    key: 'soil_quality_score',
    label: 'Качество',
    width: 100,
    sortable: true,
    align: 'center',
    formatter: formatSoilQuality
  },
  {
    key: 'field_status',
    label: 'Статус',
    width: 110,
    sortable: true,
    align: 'center',
    formatter: formatFieldStatus
  }
];

// Настройки фильтрации
export const filterConfig = {
  searchFields: ['field_name', 'field_code', 'cadastral_number', 'notes'],
  filterFields: [
    {
      key: 'soil_type',
      label: 'Тип почвы',
      type: 'select' as const
    },
    {
      key: 'irrigation_type',
      label: 'Тип орошения',
      type: 'select' as const
    },
    {
      key: 'field_status',
      label: 'Статус поля',
      type: 'select' as const
    },
    {
      key: 'is_active',
      label: 'Активность',
      type: 'boolean' as const
    },
    {
      key: 'area_hectares',
      label: 'Площадь (га)',
      type: 'range' as const
    },
    {
      key: 'soil_quality_score',
      label: 'Качество почвы (1-10)',
      type: 'range' as const
    }
  ]
}; 
