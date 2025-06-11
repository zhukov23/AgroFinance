// Типы для системы синхронизации
export interface SyncStatus {
  table: string;
  status: 'idle' | 'checking' | 'syncing' | 'success' | 'error' | 'creating';
  message: string;
  localVersion?: string;
  serverVersion?: string;
}

export interface TableSyncResult {
  table: string;
  success: boolean;
  recordsInserted: number;
  recordsUpdated: number;
  recordsDeleted: number;
  error?: string;
}

export interface SyncResult {
  success: boolean;
  results: TableSyncResult[];
  totalTime: number;
  timestamp: string;
}

export interface SyncConfig {
  tables: string[];
  apiBaseUrl?: string;
  displayName?: string;
  description?: string;
}

export interface TableVersionInfo {
  version: string | null;
  lastSync: string | null;
}

export interface ApiSyncResponse {
  success: boolean;
  timestamp: string;
  changes: Record<string, {
    inserted: any[];
    updated: any[];
    deleted: any[];
  }>;
  metadata?: {
    tablesProcessed: string[];
    totalRecords: number;
    processingTime: number;
  };
}

export interface ApiVersionResponse {
  success: boolean;
  versions: Record<string, string>;
}

// Callback типы
export type SyncEventCallback = (status: SyncStatus) => void;
export type SyncProgressCallback = (progress: { current: number; total: number; tableName: string }) => void;

// Enum для статусов синхронизации
export enum SyncStatusEnum {
  IDLE = 'idle',
  CHECKING = 'checking',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error',
  CREATING = 'creating'
}

// Утилитарные типы для работы с данными
export interface DatabaseRecord {
  id: number | string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface SyncMetrics {
  totalTables: number;
  successfulTables: number;
  failedTables: number;
  totalRecordsProcessed: number;
  syncDuration: number;
  lastSyncTime: string;
}