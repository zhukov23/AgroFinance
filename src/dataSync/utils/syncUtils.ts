import { SyncManager } from '../core/syncManager';
import { clearDatabase } from '../core/dbClient';
import { SyncStatus, SyncResult, TableSyncResult, SyncEventCallback } from './syncTypes';

export class SyncUtils {
  private syncManager: SyncManager | null = null;
  private eventCallback?: SyncEventCallback;

  constructor(private tables: string[], private apiBaseUrl: string = 'http://localhost:3000') {}

  // Устанавливаем callback для событий синхронизации
  setEventCallback(callback: SyncEventCallback) {
    this.eventCallback = callback;
  }

  // Отправляем событие
  private emitEvent(tableName: string, updates: Partial<SyncStatus>) {
    if (this.eventCallback) {
      const status: SyncStatus = {
        table: tableName,
        status: 'idle',
        message: '',
        ...updates
      };
      this.eventCallback(status);
    }
  }

  // Инициализация менеджера синхронизации
// Инициализация менеджера синхронизации
async initialize(): Promise<boolean> {
  try {
    console.log('🔧 SyncUtils: Создаем SyncManager с таблицами:', this.tables);
    this.syncManager = new SyncManager(this.tables, this.apiBaseUrl);
    console.log('🔧 SyncUtils: Вызываем init()...');
    await this.syncManager.init();
    console.log('🔧 SyncUtils: Инициализация успешна!');
    return true;
  } catch (error) {
    console.error('❌ SyncUtils: Ошибка инициализации SyncManager:', error);
    return false;
  }
}

  // Проверка структуры таблицы
  private async checkTableStructure(tableName: string): Promise<{ exists: boolean; version?: string }> {
    try {
      this.emitEvent(tableName, { status: 'checking', message: 'Проверяем версию таблицы...' });
      
      const response = await fetch(`${this.apiBaseUrl}/api/sync/table-versions`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const version = data.versions[tableName];
      
      return version ? { exists: true, version } : { exists: false };
    } catch (error) {
      console.error(`Ошибка проверки версии таблицы ${tableName}:`, error);
      return { exists: false };
    }
  }

  // Создание/загрузка данных таблицы
  private async loadTableData(tableName: string): Promise<TableSyncResult> {
    try {
      this.emitEvent(tableName, { status: 'creating', message: 'Получаем данные таблицы...' });
      
      const response = await fetch(`${this.apiBaseUrl}/api/sync?since=1970-01-01T00:00:00.000Z&tables=${tableName}`);

      if (!response.ok) {
        throw new Error(`Ошибка получения данных таблицы: ${response.status}`);
      }

      const data = await response.json();
      const tableData = data.changes[tableName];
      
      if (tableData && this.syncManager) {
        await this.syncManager.db.putAll(tableName, tableData.inserted || []);
        
        // Сохраняем версию и время синхронизации
        const versionResponse = await fetch(`${this.apiBaseUrl}/api/sync/table-versions`);
        if (versionResponse.ok) {
          const versionData = await versionResponse.json();
          const version = versionData.versions[tableName];
          if (version) {
            localStorage.setItem(`version_${tableName}`, version);
            localStorage.setItem(`lastSync_${tableName}`, data.timestamp);
          }
        }
      }

      const recordCount = tableData?.inserted?.length || 0;
      this.emitEvent(tableName, { 
        status: 'success', 
        message: `Загружено ${recordCount} записей` 
      });

      return {
        table: tableName,
        success: true,
        recordsInserted: recordCount,
        recordsUpdated: 0,
        recordsDeleted: 0
      };
    } catch (error) {
      this.emitEvent(tableName, { 
        status: 'error', 
        message: `Ошибка загрузки таблицы: ${error}` 
      });
      return {
        table: tableName,
        success: false,
        recordsInserted: 0,
        recordsUpdated: 0,
        recordsDeleted: 0,
        error: String(error)
      };
    }
  }

  // Синхронизация данных таблицы
  private async syncTableData(tableName: string, serverVersion: string): Promise<TableSyncResult> {
    try {
      this.emitEvent(tableName, { status: 'syncing', message: 'Синхронизируем данные...' });
      
      const localVersion = localStorage.getItem(`version_${tableName}`) || 'none';
      
      if (serverVersion === localVersion) {
        // Проверяем обновления с последней синхронизации
        const lastSyncTime = localStorage.getItem(`lastSync_${tableName}`) || '1970-01-01T00:00:00.000Z';
        
        const response = await fetch(`${this.apiBaseUrl}/api/sync?since=${lastSyncTime}&tables=${tableName}`);
        if (!response.ok) {
          throw new Error(`Ошибка получения данных: ${response.status}`);
        }

        const data = await response.json();
        const tableChanges = data.changes[tableName];

        const insertedCount = tableChanges?.inserted?.length || 0;
        const updatedCount = tableChanges?.updated?.length || 0;
        const deletedCount = tableChanges?.deleted?.length || 0;
        const totalChanges = insertedCount + updatedCount + deletedCount;

        if (totalChanges === 0) {
          this.emitEvent(tableName, { 
            status: 'success', 
            message: 'Данные актуальны, обновления не требуются',
            localVersion,
            serverVersion 
          });
          return {
            table: tableName,
            success: true,
            recordsInserted: 0,
            recordsUpdated: 0,
            recordsDeleted: 0
          };
        }

        // Применяем изменения
        if (this.syncManager) {
          const recordsToUpdate = [
            ...(tableChanges.inserted || []),
            ...(tableChanges.updated || [])
          ];
          
          if (recordsToUpdate.length > 0) {
            await this.syncManager.db.putAll(tableName, recordsToUpdate);
          }
          
          if (tableChanges.deleted && tableChanges.deleted.length > 0) {
            for (const deletedRecord of tableChanges.deleted) {
              await this.syncManager.db.deleteRecord(tableName, deletedRecord.id);
            }
          }
          
          localStorage.setItem(`lastSync_${tableName}`, data.timestamp);
          
          this.emitEvent(tableName, { 
            status: 'success', 
            message: `Обновлено: +${insertedCount} ~${updatedCount} -${deletedCount}`,
            localVersion,
            serverVersion 
          });

          return {
            table: tableName,
            success: true,
            recordsInserted: insertedCount,
            recordsUpdated: updatedCount,
            recordsDeleted: deletedCount
          };
        }
      }

      // Полная синхронизация если версии не совпадают
      return await this.loadTableData(tableName);
    } catch (error) {
      this.emitEvent(tableName, { 
        status: 'error', 
        message: `Ошибка синхронизации: ${error}` 
      });
      return {
        table: tableName,
        success: false,
        recordsInserted: 0,
        recordsUpdated: 0,
        recordsDeleted: 0,
        error: String(error)
      };
    }
  }

  // Основной метод синхронизации
  async sync(): Promise<SyncResult> {
    if (!this.syncManager) {
      throw new Error('SyncManager не инициализирован. Вызовите initialize() сначала.');
    }

    const startTime = Date.now();
    const results: TableSyncResult[] = [];

    for (const tableName of this.tables) {
      try {
        const structureCheck = await this.checkTableStructure(tableName);
        
        let result: TableSyncResult;
        if (!structureCheck.exists) {
          result = await this.loadTableData(tableName);
        } else {
          result = await this.syncTableData(tableName, structureCheck.version!);
        }
        
        results.push(result);
      } catch (error) {
        this.emitEvent(tableName, { 
          status: 'error', 
          message: `Общая ошибка: ${error}` 
        });
        results.push({
          table: tableName,
          success: false,
          recordsInserted: 0,
          recordsUpdated: 0,
          recordsDeleted: 0,
          error: String(error)
        });
      }
    }

    const endTime = Date.now();
    const success = results.every(r => r.success);

    return {
      success,
      results,
      totalTime: endTime - startTime,
      timestamp: new Date().toISOString()
    };
  }

  // Полный сброс данных
  async resetDatabase(): Promise<void> {
    if (this.syncManager?.db) {
      this.syncManager.db.close();
    }
    
    await clearDatabase();
    
    // Очищаем localStorage
    this.tables.forEach(table => {
      localStorage.removeItem(`version_${table}`);
      localStorage.removeItem(`lastSync_${table}`);
    });
    
    // Пересоздаём менеджер
    await this.initialize();
  }

  // Получение данных таблицы
  async getTableData(tableName: string): Promise<any[]> {
    if (!this.syncManager) {
      throw new Error('SyncManager не инициализирован');
    }
    return await this.syncManager.getTableData(tableName);
  }

  // Проверка статуса синхронизации
  getSyncStatus(tableName: string): { version: string | null; lastSync: string | null } {
    return {
      version: localStorage.getItem(`version_${tableName}`),
      lastSync: localStorage.getItem(`lastSync_${tableName}`)
    };
  }
}