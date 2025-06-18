import { SyncConfig } from '../../../../dataSync/utils/syncTypes';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
export const harvestedProductsSyncConfig: SyncConfig = {
  tables: [
    'inventory_harvested_products',
    'reference_storage_locations',
    'reference_planting_materials'
  ],
  displayName: 'Урожайная продукция',
  description: 'Синхронизация данных об урожайной продукции, местах хранения и посевном материале',
  apiBaseUrl: DEFAULT_API_BASE_URL
};

// Настройки автосинхронизации
export const syncOptions = {
  autoInitialize: true,
  autoSync: false, // Выключаем автосинхронизацию для инвентаря
  syncInterval: 30 // минут (чаще чем справочники)
};

// Настройки отображения статуса синхронизации
export const statusPanelConfig = {
  showMetrics: true,
  showTimestamps: true,
  compact: false,
  title: 'Статус синхронизации урожайной продукции'
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

export const harvestedProductSaveDependencies: SaveDependency[] = [
  {
    table: 'inventory_harvested_products',
    priority: 1 // Урожайная продукция с FK на места хранения и посевной материал
  }
]; 
