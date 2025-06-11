// Экспорт конфигурации синхронизации
export { 
  banksSyncConfig, 
  syncOptions, 
  statusPanelConfig 
} from './syncConfig';

// Экспорт конфигурации таблицы
export { 
  banksColumns, 
  tableConfig, 
  mobileColumns, 
  compactColumns,
  filterConfig,
  type Bank
} from './tableConfig';

// Экспорт форматтеров
export * from './formaters';

// Экспорт конфигурации формы редактирования
export { bankFormConfig, validation } from './editConfig'; 
