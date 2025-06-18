// Экспорт конфигурации синхронизации
export { 
  storageLocationsSyncConfig, 
  syncOptions, 
  statusPanelConfig,
  storageLocationSaveDependencies 
} from './syncConfig';

// Экспорт конфигурации таблицы
export { 
  storageLocationsColumns, 
  tableConfig, 
  mobileColumns, 
  compactColumns,
  filterConfig,
  type StorageLocation
} from './tableConfig';

// Экспорт форматтеров
export * from './formaters';

// Экспорт конфигурации формы редактирования
export { storageLocationFormConfig, validation } from './editConfig';

// Экспорт конфигурации для AI генерации
export { testDataConfig } from './testDataAIScript'; 
