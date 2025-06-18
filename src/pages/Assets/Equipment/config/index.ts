// Экспорт конфигурации синхронизации
export { 
  equipmentSyncConfig, 
  syncOptions, 
  statusPanelConfig 
} from './syncConfig';

// Экспорт конфигурации таблицы
export { 
  equipmentColumns, 
  tableConfig, 
  mobileColumns, 
  compactColumns,
  filterConfig,
  type Equipment
} from './tableConfig';

// Экспорт форматтеров
export * from './formaters';

// Экспорт конфигурации формы редактирования
export { equipmentFormConfig, validation } from './editConfig'; 
