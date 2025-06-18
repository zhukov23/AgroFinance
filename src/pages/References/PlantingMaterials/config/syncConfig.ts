import { SyncConfig } from '../../../../dataSync/utils/syncTypes';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

export const plantingMaterialsSyncConfig: SyncConfig = {
  tables: [
    'reference_planting_materials',
    'reference_counterparties'
  ],
  displayName: 'Справочник посевного материала',
  description: 'Синхронизация данных о посевном материале и производителях',
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
  title: 'Статус синхронизации посевного материала'
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

export const plantingMaterialSaveDependencies: SaveDependency[] = [
  {
    table: 'reference_planting_materials',
    priority: 1 // Посевной материал - простая сущность с FK на контрагентов
  }
]; 
