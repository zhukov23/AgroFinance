// src/pages/References/StorageLocations/hooks/useStorageLocationEdit.ts

import { useCallback } from 'react';
import { useStorageLocationData } from './useStorageLocationData';
import { useSaveStorageLocation } from './useSaveStorageLocation';
import { useTestDataGeneration } from './useTestDataGeneration';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useSyncData } from '../../../../hooks/useSyncData';
import { storageLocationsSyncConfig } from '../config/syncConfig';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

// Базовый интерфейс для места хранения
export interface StorageLocationData {
  id?: number;
  name: string;
  code?: string;
  storage_type: string; // own, external
  counterparty_id?: number;
  address?: string;
  coordinates?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  total_capacity?: number;
  available_capacity?: number;
  storage_conditions?: string;
  storage_types_allowed?: string[]; // JSONB
  rental_cost_per_ton?: number;
  contract_number?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  has_grain_dryer?: boolean;
  has_cleaning_equipment?: boolean;
  has_scales?: boolean;
  has_loading_equipment?: boolean;
  security_level?: string;
  status?: string;
  rating?: number;
  notes?: string;
  tags?: string[]; // JSONB
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface UseStorageLocationEditReturn {
  // Данные
  storageLocation: StorageLocationData | null;
  
  // Состояние
  isLoading: boolean;
  hasChanges: boolean;
  error: string | null;
  isSaving: boolean;
  isGenerating: boolean;
  saveErrorData: any;
  
  // Методы
  updateStorageLocation: (updates: Partial<StorageLocationData>) => void;
  saveChanges: () => Promise<boolean>;
  resetStorageLocation: () => void;
  generateTestData: () => Promise<void>;
  clearError: () => void;
  clearSaveError: () => void;
  handleSuccess: (message: string) => void;
}

/**
 * Главный хук для редактирования места хранения
 */
export const useStorageLocationEdit = (storageLocationId?: number): UseStorageLocationEditReturn => {
  
  // Используем хук для синхронизации данных
  const { 
    isInitialized, 
    isLoading: syncLoading, 
    sync: performSyncOriginal 
  } = useSyncData(storageLocationsSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Оборачиваем sync для совместимости типов
  const performSync = useCallback(async (): Promise<void> => {
    await performSyncOriginal();
  }, [performSyncOriginal]);

  // Обработка ошибок
const {
  localError,
  saveErrorData,
  setLocalError,
  clearError: clearLocalError,
  clearSaveError,
  handleSaveError
} = useValidationErrorHandler();

  // Управление данными места хранения
  const {
    storageLocation,
    isLoading: dataLoading,
    hasChanges,
    error: dataError,
    updateStorageLocation,
    resetStorageLocation,
    clearError: clearDataError
  } = useStorageLocationData(storageLocationId, handleSaveError);

  // Сохранение места хранения
  const { isSaving, saveChanges: saveStorageLocation } = useSaveStorageLocation();

  // Генерация тестовых данных
  const { isGenerating, generateTestData: generateTestDataAction } = useTestDataGeneration(
    {
      apiBaseUrl: DEFAULT_API_BASE_URL,
      onDataGenerated: (data) => {
        console.log('🎯 Получены тестовые данные места хранения:', data);
        // Применяем только определенные поля из сгенерированных данных
        updateStorageLocation(data);
      },
      onError: handleSaveError,
      onStatusChange: (status) => {
        console.log('📊 Статус генерации:', status);
      }
    },
    {
      isInitialized,
      syncLoading,
      performSync
    }
  );

  // Объединенное состояние загрузки и ошибок
  const isLoading = dataLoading || syncLoading;
  const error = localError || dataError;

  // Преобразование массивов в JSON строки для JSONB полей
  const prepareDataForSave = useCallback((data: StorageLocationData): StorageLocationData => {
    const prepared = { ...data };
    
    // Преобразуем массивы в JSON строки для JSONB полей
    if (Array.isArray(prepared.storage_types_allowed)) {
      prepared.storage_types_allowed = JSON.stringify(prepared.storage_types_allowed) as any;
    }
    if (Array.isArray(prepared.tags)) {
      prepared.tags = JSON.stringify(prepared.tags) as any;
    }
    
    return prepared;
  }, []);

  // Сохранение изменений
  const saveChanges = useCallback(async (): Promise<boolean> => {
    if (!storageLocation) {
      const errorMsg = 'Нет данных места хранения для сохранения';
      console.error('❌', errorMsg);
      setLocalError(errorMsg);
      return false;
    }

    try {
      console.log('💾 Начинаем сохранение места хранения:', storageLocation.name);
      
      // Подготавливаем данные для сохранения (преобразуем массивы в JSON)
      const preparedData = prepareDataForSave(storageLocation);
      console.log('🔧 Подготовленные данные:', preparedData);
      
      const success = await saveStorageLocation(preparedData);
      
      if (success) {
        console.log('✅ Место хранения успешно сохранено');
        return true;
      } else {
        console.log('❌ Сохранение места хранения не удалось');
        return false;
      }
    } catch (error) {
      console.error('💥 Ошибка при сохранении места хранения:', error);
      handleSaveError(error);
      return false;
    }
  }, [storageLocation, prepareDataForSave, saveStorageLocation, setLocalError, handleSaveError]);

  // Генерация тестовых данных
  const generateTestData = useCallback(async () => {
    try {
      console.log('🎲 Генерируем тестовые данные места хранения...');
      await generateTestDataAction();
      console.log('✅ Тестовые данные места хранения сгенерированы');
    } catch (error) {
      console.error('❌ Ошибка генерации тестовых данных места хранения:', error);
      handleSaveError(error);
    }
  }, [generateTestDataAction, handleSaveError]);

  // Очистка ошибок
  const clearError = useCallback(() => {
    clearLocalError();
    clearDataError();
  }, [clearLocalError, clearDataError]);

  // Обработчик успешных операций
  const handleSuccess = useCallback((message: string) => {
    console.log('🎉 Успешная операция:', message);
    clearError();
  }, [clearError]);

  return {
    // Данные
    storageLocation,
    
    // Состояние
    isLoading,
    hasChanges,
    error,
    isSaving,
    isGenerating,
    saveErrorData,
    
    // Методы
    updateStorageLocation,
    saveChanges,
    resetStorageLocation,
    generateTestData,
    clearError,
    clearSaveError,
    handleSuccess
  };
}; 
