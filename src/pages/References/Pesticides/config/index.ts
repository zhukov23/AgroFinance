// src/pages/References/Pesticides/config/index.ts

// Экспорт конфигурации синхронизации
export { 
  pesticideSyncConfig, 
  syncOptions, 
  statusPanelConfig,
  pesticideSaveDependencies 
} from './syncConfig';

// Экспорт конфигурации таблицы
export { 
  pesticideColumns, 
  tableConfig, 
  mobileColumns, 
  compactColumns,
  filterConfig,
  type Pesticide
} from './tableConfig';

// Экспорт форматтеров
export * from './formaters';

// Экспорт конфигурации формы редактирования
export { pesticideFormConfig, pesticideValidationRules } from './editConfig';

// Экспорт конфигурации для AI генерации
export { testDataConfig } from './testDataAIScript';