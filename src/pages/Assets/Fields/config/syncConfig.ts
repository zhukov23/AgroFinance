import { SyncConfig } from '../../../../dataSync/utils/syncTypes';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
/**
 * Конфигурация зависимостей для пошагового сохранения
 */
export interface SaveDependency {
  table: string;
  dependsOn?: string; // tempId родительской сущности
  parentIdField?: string; // поле для связи с родителем
  priority: number; // порядок выполнения (меньше = раньше)
}

export const fieldsSyncConfig: SyncConfig = {
  tables: [
    'assets_fields'
  ],
  displayName: 'Справочник полей',
  description: 'Синхронизация данных о сельскохозяйственных полях и участках',
  apiBaseUrl: DEFAULT_API_BASE_URL
};

export const fieldsSaveDependencies: SaveDependency[] = [
  {
    table: 'assets_fields',
    priority: 1 // Поля - простая сущность без зависимостей
  }
];

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
  title: 'Статус синхронизации полей'
}; 
