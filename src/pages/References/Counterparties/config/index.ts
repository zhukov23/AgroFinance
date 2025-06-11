// Экспорт конфигурации синхронизации
export { 
  counterpartiesSyncConfig, 
  syncOptions, 
  statusPanelConfig 
} from './syncConfig';

// Экспорт конфигурации таблицы
export { 
  counterpartiesColumns, 
  tableConfig, 
  mobileColumns, 
  compactColumns,
  filterConfig,
  type Counterparty
} from './tableConfig';

// Экспорт форматтеров
export * from './formaters';

// Экспорт конфигурации формы редактирования
export { counterpartyFormConfig, validation } from './editConfig';