// src/pages/Assets/Equipment/hooks/useEquipmentEdit.ts

import { useCallback } from 'react';
import { useEquipmentData } from './useEquipmentData';
import { useSaveEquipment } from './useSaveEquipment';
import { useTestDataGeneration } from './useTestDataGeneration';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useSyncData } from '../../../../hooks/useSyncData';
import { equipmentSyncConfig } from '../config/syncConfig';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

// Базовый интерфейс для техники
export interface EquipmentData {
  id?: number;
  name: string;
  equipment_code?: string;
  category: string;
  subcategory?: string;
  manufacturer?: string;
  model?: string;
  country_origin?: string;
  engine_power?: number;
  engine_volume?: number;
  fuel_type?: string;
  fuel_consumption?: number;
  working_width?: number;
  working_speed_min?: number;
  working_speed_max?: number;
  capacity?: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  weight_kg?: number;
  purchase_price?: number;
  depreciation_period_years?: number;
  maintenance_cost_per_hour?: number;
  suitable_crops?: string[];
  season_usage?: string;
  min_field_size?: number;
  description?: string;
  specifications?: any;
  attachments?: any;
  certifications?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface UseEquipmentEditReturn {
  // Данные
  equipment: EquipmentData | null;
  
  // Состояние
  isLoading: boolean;
  hasChanges: boolean;
  error: string | null;
  isSaving: boolean;
  isGenerating: boolean;
  saveErrorData: any;
  
  // Методы
  updateEquipment: (updates: Partial<EquipmentData>) => void;
  saveChanges: () => Promise<boolean>;
  resetEquipment: () => void;
  generateTestData: () => Promise<void>;
  clearError: () => void;
  clearSaveError: () => void;
  handleSuccess: (message: string) => void;
}

/**
 * Главный хук для редактирования техники
 */
export const useEquipmentEdit = (equipmentId?: number): UseEquipmentEditReturn => {
  
  // Используем хук для синхронизации данных
  const { 
    isInitialized, 
    isLoading: syncLoading, 
    sync: performSyncOriginal 
  } = useSyncData(equipmentSyncConfig, {
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

  // Управление данными техники
  const {
    equipment,
    isLoading: dataLoading,
    hasChanges,
    error: dataError,
    updateEquipment,
    resetEquipment,
    clearError: clearDataError
  } = useEquipmentData(equipmentId, handleSaveError);

  // Сохранение техники
  const { isSaving, saveChanges: saveEquipment } = useSaveEquipment();

  // Генерация тестовых данных
  const { isGenerating, generateTestData: generateTestDataAction } = useTestDataGeneration(
    {
      apiBaseUrl: DEFAULT_API_BASE_URL,
      onDataGenerated: (data) => {
        console.log('🎯 Получены тестовые данные техники:', data);
        // Применяем только определенные поля из сгенерированных данных
        updateEquipment(data);
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
// Преобразование массивов в JSON строки для JSONB полей
const prepareDataForSave = useCallback((data: EquipmentData): EquipmentData => {
  const prepared = { ...data };
  
  // Для ARRAY полей НЕ преобразуем в JSON строки, оставляем как массивы
  // suitable_crops и certifications это ARRAY типы в PostgreSQL
  
  // Преобразуем только JSONB поля в JSON строки
  if (prepared.specifications && typeof prepared.specifications === 'object') {
    prepared.specifications = JSON.stringify(prepared.specifications);
  }
  if (prepared.attachments && typeof prepared.attachments === 'object') {
    prepared.attachments = JSON.stringify(prepared.attachments);
  }
  
  return prepared;
}, []);

  // Сохранение изменений
  const saveChanges = useCallback(async (): Promise<boolean> => {
    if (!equipment) {
      const errorMsg = 'Нет данных техники для сохранения';
      console.error('❌', errorMsg);
      setLocalError(errorMsg);
      return false;
    }

    try {
      console.log('💾 Начинаем сохранение техники:', equipment.name);
      
      // Подготавливаем данные для сохранения (преобразуем массивы в JSON)
      const preparedData = prepareDataForSave(equipment);
      console.log('🔧 Подготовленные данные:', preparedData);
      
      const success = await saveEquipment(preparedData);
      
      if (success) {
        console.log('✅ Техника успешно сохранена');
        return true;
      } else {
        console.log('❌ Сохранение техники не удалось');
        return false;
      }
    } catch (error) {
      console.error('💥 Ошибка при сохранении техники:', error);
      handleSaveError(error);
      return false;
    }
  }, [equipment, prepareDataForSave, saveEquipment, setLocalError, handleSaveError]);

  // Генерация тестовых данных
  const generateTestData = useCallback(async () => {
    try {
      console.log('🎲 Генерируем тестовые данные техники...');
      await generateTestDataAction();
      console.log('✅ Тестовые данные техники сгенерированы');
    } catch (error) {
      console.error('❌ Ошибка генерации тестовых данных техники:', error);
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
    equipment,
    
    // Состояние
    isLoading,
    hasChanges,
    error,
    isSaving,
    isGenerating,
    saveErrorData,
    
    // Методы
    updateEquipment,
    saveChanges,
    resetEquipment,
    generateTestData,
    clearError,
    clearSaveError,
    handleSuccess
  };
}; 
