// src/pages/References/Pesticides/config/syncConfig.ts
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
import { SyncConfig } from '../../../../dataSync/utils/syncTypes';

/**
 * Конфигурация зависимостей для пошагового сохранения
 */
export interface SaveDependency {
  table: string;
  dependsOn?: string; // tempId родительской сущности
  parentIdField?: string; // поле для связи с родителем
  priority: number; // порядок выполнения (меньше = раньше)
}

export const pesticideSyncConfig: SyncConfig = {
  tables: [
    'reference_counterparties',  // Сначала контрагенты (производители/поставщики)
    'reference_pesticides'       // Затем пестициды
  ],
  displayName: 'Справочник СЗР',
  description: 'Синхронизация данных о средствах защиты растений и связанных контрагентах',
  apiBaseUrl: DEFAULT_API_BASE_URL
};

export const pesticideSaveDependencies: SaveDependency[] = [
  {
    table: 'reference_counterparties',
    priority: 1
  },
  {
    table: 'reference_pesticides',
    dependsOn: 'reference_counterparties',
    parentIdField: 'manufacturer_id', // или supplier_id
    priority: 2
  }
];

// Настройки автосинхронизации
export const syncOptions = {
  autoInitialize: true,
  autoSync: false,
  syncInterval: 60
};

// Настройки отображения статуса синхронизации
export const statusPanelConfig = {
  showMetrics: true,
  showTimestamps: true,
  compact: false,
  title: 'Статус синхронизации СЗР'
};