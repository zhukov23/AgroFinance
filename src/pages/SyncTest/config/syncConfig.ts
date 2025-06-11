import { SyncConfig } from '../../../dataSync/utils/syncTypes';

// Конфигурация синхронизации для справочника техники
export const equipmentSyncConfig: SyncConfig = {
  tables: [
    'assets_equipment',
    'assets_equipment_types', 
    'reference_soil_types',
    'link_equipment_soil_types'
  ],
  displayName: 'Справочник техники',
  description: 'Синхронизация данных о технике, типах техники, типах почв и их связях',
  apiBaseUrl: 'http://localhost:3000'
};

// Настройки автосинхронизации
export const syncOptions = {
  autoInitialize: true,
  autoSync: false, // Выключаем автосинхронизацию для тестовой страницы
  syncInterval: 30 // минут
};

// Настройки отображения статуса синхронизации
export const statusPanelConfig = {
  showMetrics: true,
  showTimestamps: true,
  compact: false,
  title: 'Статус синхронизации техники'
};