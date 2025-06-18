import { SyncConfig } from '../../../../dataSync/utils/syncTypes';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
export const storageLocationsSyncConfig: SyncConfig = {
  tables: [
    'reference_storage_locations',
    'reference_counterparties'
  ],
  displayName: 'Справочник мест хранения',
  description: 'Синхронизация данных о местах хранения и контрагентах',
  apiBaseUrl: DEFAULT_API_BASE_URL
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
  title: 'Статус синхронизации мест хранения'
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

export const storageLocationSaveDependencies: SaveDependency[] = [
  {
    table: 'reference_storage_locations',
    priority: 1 // Места хранения - простая сущность с FK на контрагентов
  }
];
