import { SyncConfig } from '../../../../dataSync/utils/syncTypes';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
export const banksSyncConfig: SyncConfig = {
  tables: [
    'reference_banks'
  ],
  displayName: 'Справочник банков',
  description: 'Синхронизация данных о банках',
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
  title: 'Статус синхронизации банков'
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

export const bankSaveDependencies: SaveDependency[] = [
  {
    table: 'reference_banks',
    priority: 1 // Банки - простая сущность без зависимостей
  }
]; 
