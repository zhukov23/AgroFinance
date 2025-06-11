import { SyncConfig } from '../../../../dataSync/utils/syncTypes';

// Конфигурация синхронизации для справочника банков
export const banksSyncConfig: SyncConfig = {
  tables: [
    'reference_banks'
  ],
  displayName: 'Справочник банков',
  description: 'Синхронизация данных о банках России',
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
  title: 'Статус синхронизации банков'
};