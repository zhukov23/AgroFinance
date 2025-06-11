import { ColumnConfig } from '../../../components/Equipment/EquipmentTable';

// Конфигурация колонок для таблицы техники
export const equipmentColumns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Название',
    width: 200,
    sortable: true,
    align: 'left'
  },
  {
    key: 'equipment_code',
    label: 'Код техники',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'manufacturer',
    label: 'Производитель',
    width: 180,
    sortable: true,
    align: 'left'
  },
  {
    key: 'model',
    label: 'Модель',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    key: 'country_origin',
    label: 'Страна',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    key: 'engine_power',
    label: 'Мощность',
    width: 100,
    sortable: true,
    align: 'right'
  },
  {
    key: 'fuel_consumption',
    label: 'Расход топлива',
    width: 120,
    sortable: true,
    align: 'right'
  },
  {
    key: 'fuel_type',
    label: 'Тип топлива',
    width: 100,
    sortable: true,
    align: 'center'
  },
  {
    key: 'purchase_price',
    label: 'Цена',
    width: 120,
    sortable: true,
    align: 'right'
  },
  {
    key: 'season_usage',
    label: 'Сезонность',
    width: 120,
    sortable: true,
    align: 'center'
  },
  {
    key: 'is_active',
    label: 'Статус',
    width: 100,
    sortable: true,
    align: 'center'
  }
];

// Настройки таблицы
export const tableConfig = {
  pageSize: 10,
  showPagination: true,
  sortable: true,
  emptyMessage: 'Нет данных о технике. Выполните синхронизацию для загрузки данных.',
  className: 'equipment-table'
};

// Настройки для мобильной версии (упрощенные колонки)
export const mobileColumns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Название',
    sortable: true,
    align: 'left'
  },
  {
    key: 'manufacturer',
    label: 'Производитель',
    sortable: true,
    align: 'left'
  },
  {
    key: 'engine_power',
    label: 'Мощность',
    sortable: true,
    align: 'right'
  },
  {
    key: 'purchase_price',
    label: 'Цена',
    sortable: true,
    align: 'right'
  },
  {
    key: 'is_active',
    label: 'Статус',
    sortable: true,
    align: 'center'
  }
];

// Дополнительные конфигурации для разных представлений
export const compactColumns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Название',
    width: 250,
    sortable: true
  },
  {
    key: 'manufacturer',
    label: 'Производитель',
    width: 180,
    sortable: true
  },
  {
    key: 'engine_power',
    label: 'Мощность',
    width: 100,
    sortable: true,
    align: 'right'
  },
  {
    key: 'purchase_price',
    label: 'Цена',
    width: 120,
    sortable: true,
    align: 'right'
  }
];

// Настройки фильтрации (для будущего использования)
export const filterConfig = {
  searchFields: ['name', 'manufacturer', 'model', 'equipment_code'],
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
      key: 'country_origin',
      label: 'Страна производства',
      type: 'select' as const
    },
    {
      key: 'is_active',
      label: 'Статус',
      type: 'boolean' as const
    }
  ]
};