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

export const equipmentSyncConfig: SyncConfig = {
  tables: [
    'assets_equipment'
  ],
  displayName: 'Справочник техники',
  description: 'Синхронизация данных о сельскохозяйственной технике и оборудовании',
  apiBaseUrl: DEFAULT_API_BASE_URL
};

export const equipmentSaveDependencies: SaveDependency[] = [
  {
    table: 'assets_equipment',
    priority: 1
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
  title: 'Статус синхронизации техники'
};