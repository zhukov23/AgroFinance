// src/pages/References/StorageLocations/hooks/useStorageLocationData.ts

import { useState, useEffect, useCallback } from 'react';
import { useEntityLoader } from '../../../../hooks/useEntityLoader';
import { useSyncData } from '../../../../hooks/useSyncData';
import { storageLocationsSyncConfig } from '../config/syncConfig';
import { StorageLocationData } from './useStorageLocationEdit';
import { hasChanges } from '../../../../utils/validation.utils';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
export interface UseStorageLocationDataReturn {
  // Данные
  storageLocation: StorageLocationData | null;
  originalStorageLocation: StorageLocationData | null;
  
  // Состояние
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Методы
  loadStorageLocation: (id: number) => Promise<void>;
  updateStorageLocation: (updates: Partial<StorageLocationData>) => void;
  resetStorageLocation: () => void;
  setStorageLocation: (storageLocation: StorageLocationData | null) => void;
  setOriginalStorageLocation: (storageLocation: StorageLocationData | null) => void;
  initializeNewStorageLocation: () => void;
  clearError: () => void;
}

/**
 * Хук для управления данными места хранения
 */
export const useStorageLocationData = (
  storageLocationId?: number,
  errorHandler?: (error: any) => void
): UseStorageLocationDataReturn => {
  
  // Состояние места хранения
  const [storageLocation, setStorageLocation] = useState<StorageLocationData | null>(null);
  const [originalStorageLocation, setOriginalStorageLocation] = useState<StorageLocationData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Прямое использование синхронизации
  const {
    isInitialized,
    loadTableData,
    sync,
    error: syncError
  } = useSyncData(storageLocationsSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Универсальный загрузчик сущностей (для совместимости)
  const entityLoader = useEntityLoader<StorageLocationData>(
    {
      syncConfig: storageLocationsSyncConfig,
      entityTableName: 'reference_storage_locations',
      relatedTableNames: ['reference_counterparties'] // Связь с контрагентами
    },
    useSyncData,
    errorHandler || (() => {})
  );

  // Проверка изменений
  const currentHasChanges = hasChanges(storageLocation, originalStorageLocation);

  // Общая ошибка
  const error = syncError || entityLoader.error;

  // Сброс при смене ID
  useEffect(() => {
    setLoadAttempts(0);
    setStorageLocation(null);
    setOriginalStorageLocation(null);
  }, [storageLocationId]);

  // Загрузка места хранения по ID
  const loadStorageLocation = useCallback(async (id: number) => {
    if (isLoadingData) {
      console.log('⏳ Загрузка места хранения уже выполняется, пропускаем...');
      return;
    }

    console.log(`🔍 Загружаем место хранения ID: ${id}`);
    setIsLoadingData(true);
    
    try {
      // Сначала получаем все данные из таблицы
      const allLocations = await loadTableData('reference_storage_locations');
      console.log(`📊 Всего мест хранения в таблице: ${allLocations.length}`);
      
      if (allLocations.length === 0) {
        console.log('📥 Таблица пустая, выполняем синхронизацию...');
        await sync();
        // Повторно загружаем после синхронизации
        const locationsAfterSync = await loadTableData('reference_storage_locations');
        console.log(`📊 После синхронизации мест хранения: ${locationsAfterSync.length}`);
      }
      
      // Ищем конкретное место хранения
      const foundLocation = allLocations.find((location: any) => location.id === id);
      
      if (foundLocation) {
        setStorageLocation(foundLocation);
        setOriginalStorageLocation(foundLocation);
        console.log(`✅ Загружено место хранения: ${foundLocation.name}`);
      } else {
        console.log(`❌ Место хранения с ID ${id} не найдено среди ${allLocations.length} записей`);
        // Показываем список доступных ID для отладки
        const availableIds = allLocations.map((location: any) => location.id).slice(0, 10);
        console.log(`📋 Доступные ID мест хранения: ${availableIds.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки места хранения:', error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [isLoadingData, loadTableData, sync, errorHandler]);

  // Автоинициализация нового места хранения
  useEffect(() => {
    if (!storageLocationId && !storageLocation && isInitialized) {
      initializeNewStorageLocation();
    }
  }, [storageLocationId, isInitialized]);

  // Загрузка при инициализации
  useEffect(() => {
    if (storageLocationId && isInitialized && !storageLocation && !isLoadingData && loadAttempts < MAX_LOAD_ATTEMPTS) {
      setLoadAttempts(prev => prev + 1);
      loadStorageLocation(storageLocationId);
    }
  }, [storageLocationId, isInitialized, storageLocation, isLoadingData, loadAttempts]);

  // Инициализация нового места хранения
  const initializeNewStorageLocation = useCallback(() => {
    const newLocation: StorageLocationData = {
      id: 0,
      name: '',
      storage_type: 'own',
      is_active: true
    };
    
    setStorageLocation(newLocation);
    setOriginalStorageLocation(newLocation);
    console.log('🆕 Инициализировано новое место хранения');
  }, []);

  // Обновление места хранения
  const updateStorageLocation = useCallback((updates: Partial<StorageLocationData>) => {
    setStorageLocation(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  // Сброс изменений
  const resetStorageLocation = useCallback(() => {
    if (originalStorageLocation) {
      setStorageLocation({ ...originalStorageLocation });
      console.log('🔄 Сброшены изменения места хранения');
    }
  }, [originalStorageLocation]);

  return {
    // Данные
    storageLocation,
    originalStorageLocation,
    
    // Состояние
    isLoading: entityLoader.isLoading || isLoadingData,
    isInitialized: isInitialized,
    error: error,
    hasChanges: currentHasChanges,
    
    // Методы
    loadStorageLocation,
    updateStorageLocation,
    resetStorageLocation,
    setStorageLocation,
    setOriginalStorageLocation,
    initializeNewStorageLocation,
    clearError: () => {
      entityLoader.clearError();
      // Дополнительная очистка если нужно
    }
  };
}; 
