import { SyncConfig } from './utils/syncTypes';

// Экспорт основных классов
export { ApiClient } from './core/apiClient';
export { DbClient, dbClient, clearDatabase } from './core/dbClient';
export { SyncManager } from './core/syncManager';

// Экспорт утилит
export { SyncUtils } from './utils/syncUtils';

// Экспорт всех типов
export type {
  SyncStatus,
  TableSyncResult,
  SyncResult,
  SyncConfig,
  TableVersionInfo,
  ApiSyncResponse,
  ApiVersionResponse,
  SyncEventCallback,
  SyncProgressCallback,
  DatabaseRecord,
  SyncMetrics
} from './utils/syncTypes';

// Экспорт enum
export { SyncStatusEnum } from './utils/syncTypes';

// Экспорт хука
export { useSyncData } from '../hooks/useSyncData';

// Константы по умолчанию
export const DEFAULT_API_BASE_URL = 'http://89.169.160.162:3000';
export const DEFAULT_SYNC_INTERVAL_MINUTES = 30;
export const DEFAULT_DATA_FRESHNESS_MINUTES = 30;

// Утилитарные функции
export const createSyncConfig = (
  tables: string[], 
  options?: {
    apiBaseUrl?: string;
    displayName?: string;
    description?: string;
  }
): SyncConfig => ({
  tables,
  apiBaseUrl: options?.apiBaseUrl || DEFAULT_API_BASE_URL,
  displayName: options?.displayName,
  description: options?.description
});

// Проверка поддержки IndexedDB
export const isIndexedDBSupported = (): boolean => {
  return typeof window !== 'undefined' && 'indexedDB' in window;
};

// Проверка онлайн статуса
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

// Версия библиотеки
export const VERSION = '1.0.0';