import { useState, useEffect, useCallback } from 'react';
import { useSyncData } from '../dataSync';
import { useSyncMonitor } from './useSyncMonitor';
import { SyncConfig } from '../dataSync/utils/syncTypes';

interface UseIndexedDBDataOptions {
  autoSync?: boolean;
}

interface UseIndexedDBDataReturn<T = any> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  sync: () => Promise<void>;
  clearError: () => void;
}

/**
 * Упрощенный хук для получения данных из одной таблицы IndexedDB
 * Обертка над useSyncData для удобного использования в компонентах
 * 
 * @param tableName - название таблицы в IndexedDB
 * @param syncConfig - конфигурация синхронизации
 * @param options - дополнительные настройки
 */
export function useIndexedDBData<T = any>(
  tableName: string,
  syncConfig: SyncConfig,
  options: UseIndexedDBDataOptions = {}
): UseIndexedDBDataReturn<T> {
  const { autoSync = true } = options;
  const [data, setData] = useState<T[]>([]);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [syncId] = useState(() => `${tableName}_${Date.now()}`);

  // Получаем методы мониторинга (могут быть недоступны если нет SyncMonitorProvider)
  const { registerSync, updateSync, unregisterSync } = useSyncMonitor();

  const {
    isInitialized,
    isLoading,
    error,
    lastSyncResult,
    loadTableData,
    sync: performSync,
    clearError
  } = useSyncData(syncConfig, { 
    autoInitialize: true, 
    autoSync: false // Отключаем автосинхронизацию в useSyncData, управляем сами
  });

  // Регистрируем синхронизацию при монтировании (если мониторинг доступен)
  useEffect(() => {
    if (registerSync) {
      registerSync({
        id: syncId,
        tableName,
        displayName: syncConfig.displayName || tableName,
        status: 'idle',
        lastUpdate: new Date().toISOString()
      });
    }

    // Очищаем регистрацию при размонтировании
    return () => {
      if (unregisterSync) {
        unregisterSync(syncId);
      }
    };
  }, [tableName, syncConfig.displayName, syncId, registerSync, unregisterSync]);

  // Обновляем статус в мониторе при изменениях (если мониторинг доступен)
  useEffect(() => {
    if (updateSync) {
      let status: 'idle' | 'loading' | 'success' | 'error';
      
      if (isLoading) {
        status = 'loading';
      } else if (error) {
        status = 'error';
      } else if (data.length > 0) {
        status = 'success';
      } else {
        status = 'idle';
      }

      updateSync(syncId, { status });
    }
  }, [isLoading, error, data.length, syncId, updateSync]);

  // Функция загрузки данных из IndexedDB
  const loadData = useCallback(async () => {
    if (!isInitialized) {
      console.log(`⏳ Ожидание инициализации для загрузки ${tableName}...`);
      return;
    }
    
    try {
      console.log(`📥 Загружаем данные таблицы ${tableName} из IndexedDB...`);
      const tableData = await loadTableData(tableName);
      console.log(`✅ Загружено записей из ${tableName}:`, tableData.length);
      setData(tableData);
      setHasInitialLoad(true);
    } catch (err) {
      console.error(`❌ Ошибка загрузки таблицы ${tableName}:`, err);
    }
  }, [isInitialized, loadTableData, tableName]);

  // Обновление данных (перезагрузка из IndexedDB)
  const refresh = useCallback(async () => {
    console.log(`🔄 Обновление данных ${tableName}...`);
    await loadData();
  }, [loadData]);

  // Синхронизация с сервером
  const sync = useCallback(async () => {
    console.log(`🔄 Синхронизация ${tableName} с сервером...`);
    try {
      await performSync();
    } catch (err) {
      console.error(`❌ Ошибка синхронизации ${tableName}:`, err);
    }
  }, [performSync, tableName]);

  // Загружаем данные при инициализации системы
  useEffect(() => {
    if (isInitialized && !hasInitialLoad) {
      console.log(`🔧 Система инициализирована, загружаем данные ${tableName}...`);
      loadData();
    }
  }, [isInitialized, hasInitialLoad, loadData]);

  // Автосинхронизация если данных нет после первой загрузки
  useEffect(() => {
    if (
      isInitialized && 
      hasInitialLoad && 
      data.length === 0 && 
      autoSync && 
      !isLoading && 
      !error
    ) {
      console.log(`🔄 Автосинхронизация для таблицы ${tableName} (данных нет)...`);
      sync();
    }
  }, [isInitialized, hasInitialLoad, data.length, autoSync, isLoading, error, sync, tableName]);

  // Обновляем данные после успешной синхронизации
  useEffect(() => {
    if (lastSyncResult?.success) {
      console.log(`✅ Синхронизация завершена успешно, обновляем данные ${tableName}...`);
      loadData();
    }
  }, [lastSyncResult, loadData, tableName]);

  // Debug информация
  useEffect(() => {
    console.log(`🔍 ${tableName} Debug:`, {
      isInitialized,
      isLoading,
      hasInitialLoad,
      dataLength: data.length,
      error: error ? error.substring(0, 50) + '...' : null,
      autoSync,
      lastSyncSuccess: lastSyncResult?.success
    });
  }, [tableName, isInitialized, isLoading, hasInitialLoad, data.length, error, autoSync, lastSyncResult]);

  return {
    data,
    isLoading,
    error,
    refresh,
    sync,
    clearError
  };
}