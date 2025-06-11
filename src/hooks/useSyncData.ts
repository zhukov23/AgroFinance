import { useState, useEffect, useCallback, useRef } from 'react';
import { SyncUtils } from '../dataSync/utils/syncUtils';
import { SyncConfig, SyncStatus, SyncResult, TableVersionInfo, SyncMetrics } from '../dataSync/utils/syncTypes';

interface UseSyncDataOptions {
  autoInitialize?: boolean;
  autoSync?: boolean;
  syncInterval?: number; // минуты
}

export const useSyncData = (config: SyncConfig, options: UseSyncDataOptions = {}) => {
  const { autoInitialize = true, autoSync = false, syncInterval = 30 } = options;
  
  const [syncUtils] = useState(() => new SyncUtils(config.tables, config.apiBaseUrl));
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [tableData, setTableData] = useState<Record<string, any[]>>({});
  const [error, setError] = useState<string | null>(null);
  
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Инициализация
// Инициализация
useEffect(() => {
  if (!autoInitialize) return;

  const initialize = async () => {
    try {
      console.log('🔧 useSyncData: Начинаем инициализацию...', config);
      setError(null);
      
      syncUtils.setEventCallback((status: SyncStatus) => {
        console.log('📡 Событие синхронизации:', status);
        setSyncStatuses(prev => {
          const existing = prev.find(s => s.table === status.table);
          if (existing) {
            return prev.map(s => s.table === status.table ? status : s);
          } else {
            return [...prev, status];
          }
        });
      });

      console.log('🔧 useSyncData: Вызываем syncUtils.initialize()...');
      const success = await syncUtils.initialize();
      console.log('🔧 useSyncData: Результат инициализации:', success);
      setIsInitialized(success);
      
      if (!success) {
        setError('Не удалось инициализировать систему синхронизации');
      }
    } catch (err) {
      console.error('❌ useSyncData: Ошибка инициализации:', err);
      setError(`Ошибка инициализации: ${err}`);
      setIsInitialized(false);
    }
  };

  initialize();
}, [syncUtils, autoInitialize]);

  // Автоматическая синхронизация
  useEffect(() => {
    if (!autoSync || !isInitialized) return;

    const startAutoSync = () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }

      syncIntervalRef.current = setInterval(async () => {
        try {
          await sync();
        } catch (err) {
          console.error('Ошибка автосинхронизации:', err);
        }
      }, syncInterval * 60 * 1000);
    };

    startAutoSync();

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [autoSync, isInitialized, syncInterval]);

  // Ручная инициализация
  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      syncUtils.setEventCallback((status: SyncStatus) => {
        setSyncStatuses(prev => {
          const existing = prev.find(s => s.table === status.table);
          if (existing) {
            return prev.map(s => s.table === status.table ? status : s);
          } else {
            return [...prev, status];
          }
        });
      });

      const success = await syncUtils.initialize();
      setIsInitialized(success);
      
      if (!success) {
        setError('Не удалось инициализировать систему синхронизации');
      }
      
      return success;
    } catch (err) {
      setError(`Ошибка инициализации: ${err}`);
      setIsInitialized(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [syncUtils]);

  // Синхронизация данных
  const sync = useCallback(async (forceFull: boolean = false): Promise<SyncResult | null> => {
    if (!isInitialized) {
      throw new Error('Система синхронизации не инициализирована');
    }

    setIsLoading(true);
    setError(null);
    setSyncStatuses([]);

    try {
      const result = await syncUtils.sync();
      setLastSyncResult(result);
      
      if (!result.success) {
        setError('Синхронизация завершилась с ошибками');
      }
      
      return result;
    } catch (err) {
      const errorMessage = `Ошибка синхронизации: ${err}`;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, syncUtils]);

  // Загрузка данных из IndexedDB
  const loadTableData = useCallback(async (tableName: string): Promise<any[]> => {
    if (!isInitialized) {
      return [];
    }

    try {
      const data = await syncUtils.getTableData(tableName);
      setTableData(prev => ({ ...prev, [tableName]: data }));
      return data;
    } catch (err) {
      console.error(`Ошибка загрузки данных таблицы ${tableName}:`, err);
      setError(`Ошибка загрузки данных таблицы ${tableName}: ${err}`);
      return [];
    }
  }, [isInitialized, syncUtils]);

  // Загрузка всех данных
  const loadAllData = useCallback(async (): Promise<Record<string, any[]>> => {
    const allData: Record<string, any[]> = {};
    
    for (const tableName of config.tables) {
      allData[tableName] = await loadTableData(tableName);
    }
    
    setTableData(allData);
    return allData;
  }, [config.tables, loadTableData]);

  // Сброс базы данных
  const resetDatabase = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSyncStatuses([]);
    setTableData({});
    setLastSyncResult(null);
    
    try {
      await syncUtils.resetDatabase();
      setIsInitialized(true);
    } catch (err) {
      setError(`Ошибка сброса базы данных: ${err}`);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  }, [syncUtils]);

  // Получение статуса синхронизации
  const getSyncStatus = useCallback((tableName: string): TableVersionInfo => {
    return syncUtils.getSyncStatus(tableName);
  }, [syncUtils]);

  // Получение статуса всех таблиц
  const getAllSyncStatuses = useCallback((): Record<string, TableVersionInfo> => {
    const statuses: Record<string, TableVersionInfo> = {};
    config.tables.forEach(tableName => {
      statuses[tableName] = getSyncStatus(tableName);
    });
    return statuses;
  }, [config.tables, getSyncStatus]);

  // Проверка актуальности данных
  const isDataFresh = useCallback((tableName: string, maxAgeMinutes: number = 30): boolean => {
    const status = getSyncStatus(tableName);
    if (!status.lastSync) return false;
    
    const lastSyncTime = new Date(status.lastSync);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSyncTime.getTime()) / (1000 * 60);
    
    return diffMinutes <= maxAgeMinutes;
  }, [getSyncStatus]);

  // Проверка нужна ли синхронизация
  const needsSync = useCallback((maxAgeMinutes: number = 30): boolean => {
    return config.tables.some(tableName => !isDataFresh(tableName, maxAgeMinutes));
  }, [config.tables, isDataFresh]);

  // Получение метрик синхронизации
  const getSyncMetrics = useCallback((): SyncMetrics | null => {
    if (!lastSyncResult) return null;

    const totalRecordsProcessed = lastSyncResult.results.reduce((sum, result) => 
      sum + result.recordsInserted + result.recordsUpdated + result.recordsDeleted, 0
    );

    return {
      totalTables: config.tables.length,
      successfulTables: lastSyncResult.results.filter(r => r.success).length,
      failedTables: lastSyncResult.results.filter(r => !r.success).length,
      totalRecordsProcessed,
      syncDuration: lastSyncResult.totalTime,
      lastSyncTime: lastSyncResult.timestamp
    };
  }, [lastSyncResult, config.tables.length]);

  // Очистка ошибок
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Получение данных конкретной таблицы из state
  const getTableDataFromState = useCallback((tableName: string): any[] => {
    return tableData[tableName] || [];
  }, [tableData]);

  // Проверка есть ли данные в таблице
  const hasTableData = useCallback((tableName: string): boolean => {
    const data = tableData[tableName];
    return Array.isArray(data) && data.length > 0;
  }, [tableData]);

  return {
    // Состояние
    isInitialized,
    isLoading,
    syncStatuses,
    lastSyncResult,
    tableData,
    error,
    
    // Методы управления
    initialize,
    sync,
    resetDatabase,
    clearError,
    
    // Методы работы с данными
    loadTableData,
    loadAllData,
    getTableDataFromState,
    hasTableData,
    
    // Методы проверки статуса
    getSyncStatus,
    getAllSyncStatuses,
    isDataFresh,
    needsSync,
    getSyncMetrics,
    
    // Информация о конфигурации
    config
  };
};