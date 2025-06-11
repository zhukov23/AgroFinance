import { SyncConfig } from '../../../../dataSync/utils/syncTypes';

export const counterpartiesSyncConfig: SyncConfig = {
  tables: [
    'link_counterparties_bank_accounts',
    'reference_counterparties',
    'reference_banks'
  ],
  displayName: 'Справочник контрагентов',
  description: 'Синхронизация данных о контрагентах компании',
  apiBaseUrl: 'http://localhost:3000'
};

// Настройки автосинхронизации
export const syncOptions = {
  autoInitialize: true,
  autoSync: false, // Выключаем автосинхронизацию для справочника
  syncInterval: 60 // минут
};

// Настройки отображения статуса синхронизации
export const statusPanelConfig = {
  showMetrics: true,
  showTimestamps: true,
  compact: false,
  title: 'Статус синхронизации контрагентов'
};

/**
 * Конфигурация зависимостей для пошагового сохранения
 */
export interface SaveDependency {
  table: string;
  dependsOn?: string; // tempId родительской сущности
  parentIdField?: string; // поле для связи с родителем
  priority: number; // порядок выполнения (меньше = раньше)
}

export const counterpartySaveDependencies: SaveDependency[] = [
  {
    table: 'reference_counterparties',
    priority: 1 // Сначала создаем контрагента
  },
  {
    table: 'link_counterparties_bank_accounts', 
    dependsOn: 'main_entity', // зависит от контрагента
    parentIdField: 'organization_id',
    priority: 2 // Потом банковские счета
  }
];