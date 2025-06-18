// src/pages/Assets/Fields/hooks/useFieldEdit.ts

import { useCallback } from 'react';
import { useFieldData } from './useFieldData';
import { useSaveField } from './useSaveField';
import { useTestDataGeneration } from './useTestDataGeneration';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useSyncData } from '../../../../hooks/useSyncData';
import { fieldsSyncConfig } from '../config/syncConfig';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

// Базовый интерфейс для поля
export interface FieldData {
  id?: number;
  field_name: string;
  field_code?: string;
  area_hectares: number;
  soil_type: string;
  soil_quality_score?: number;
  irrigation_type?: string;
  field_status?: string;
  location?: any;
  boundaries?: any;
  soil_analysis?: any;
  terrain_features?: any;
  infrastructure?: any;
  cadastral_number?: string;
  ownership_documents?: any;
  restrictions?: any;
  special_features?: any;
  usage_history?: any;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface UseFieldEditReturn {
  // Данные
  field: FieldData | null;
  
  // Состояние
  isLoading: boolean;
  hasChanges: boolean;
  error: string | null;
  isSaving: boolean;
  isGenerating: boolean;
  saveErrorData: any;
  
  // Методы
  updateField: (updates: Partial<FieldData>) => void;
  saveChanges: () => Promise<boolean>;
  resetField: () => void;
  generateTestData: () => Promise<void>;
  clearError: () => void;
  clearSaveError: () => void;
  handleSuccess: (message: string) => void;
}

/**
 * Главный хук для редактирования полей
 */
export const useFieldEdit = (fieldId?: number): UseFieldEditReturn => {
  
  // Используем хук для синхронизации данных
  const { 
    isInitialized, 
    isLoading: syncLoading, 
    sync: performSyncOriginal 
  } = useSyncData(fieldsSyncConfig, {
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

  // Управление данными поля
  const {
    field,
    isLoading: dataLoading,
    hasChanges,
    error: dataError,
    updateField,
    resetField,
    clearError: clearDataError
  } = useFieldData(fieldId, handleSaveError);

  // Сохранение поля
  const { isSaving, saveChanges: saveField } = useSaveField();

  // Генерация тестовых данных
  const { isGenerating, generateTestData: generateTestDataAction } = useTestDataGeneration(
    {
      apiBaseUrl: DEFAULT_API_BASE_URL,
      onDataGenerated: (data) => {
        console.log('🎯 Получены тестовые данные поля:', data);
        // Применяем только определенные поля из сгенерированных данных
        updateField(data);
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

  // Преобразование объектов в JSON строки для JSONB полей
  const prepareDataForSave = useCallback((data: FieldData): FieldData => {
    const prepared = { ...data };
    
    // Преобразуем объекты в JSON строки для JSONB полей
    if (prepared.location && typeof prepared.location === 'object') {
      prepared.location = JSON.stringify(prepared.location);
    }
    if (prepared.boundaries && typeof prepared.boundaries === 'object') {
      prepared.boundaries = JSON.stringify(prepared.boundaries);
    }
    if (prepared.soil_analysis && typeof prepared.soil_analysis === 'object') {
      prepared.soil_analysis = JSON.stringify(prepared.soil_analysis);
    }
    if (prepared.terrain_features && typeof prepared.terrain_features === 'object') {
      prepared.terrain_features = JSON.stringify(prepared.terrain_features);
    }
    if (prepared.infrastructure && typeof prepared.infrastructure === 'object') {
      prepared.infrastructure = JSON.stringify(prepared.infrastructure);
    }
    if (prepared.ownership_documents && typeof prepared.ownership_documents === 'object') {
      prepared.ownership_documents = JSON.stringify(prepared.ownership_documents);
    }
    if (prepared.restrictions && typeof prepared.restrictions === 'object') {
      prepared.restrictions = JSON.stringify(prepared.restrictions);
    }
    if (prepared.special_features && typeof prepared.special_features === 'object') {
      prepared.special_features = JSON.stringify(prepared.special_features);
    }
    if (prepared.usage_history && typeof prepared.usage_history === 'object') {
      prepared.usage_history = JSON.stringify(prepared.usage_history);
    }
    
    return prepared;
  }, []);

  // Сохранение изменений
  const saveChanges = useCallback(async (): Promise<boolean> => {
    if (!field) {
      const errorMsg = 'Нет данных поля для сохранения';
      console.error('❌', errorMsg);
      setLocalError(errorMsg);
      return false;
    }

    try {
      console.log('💾 Начинаем сохранение поля:', field.field_name);
      
      // Подготавливаем данные для сохранения (преобразуем объекты в JSON)
      const preparedData = prepareDataForSave(field);
      console.log('🔧 Подготовленные данные:', preparedData);
      
      const success = await saveField(preparedData);
      
      if (success) {
        console.log('✅ Поле успешно сохранено');
        return true;
      } else {
        console.log('❌ Сохранение поля не удалось');
        return false;
      }
    } catch (error) {
      console.error('💥 Ошибка при сохранении поля:', error);
      handleSaveError(error);
      return false;
    }
  }, [field, prepareDataForSave, saveField, setLocalError, handleSaveError]);

  // Генерация тестовых данных
  const generateTestData = useCallback(async () => {
    try {
      console.log('🎲 Генерируем тестовые данные поля...');
      await generateTestDataAction();
      console.log('✅ Тестовые данные поля сгенерированы');
    } catch (error) {
      console.error('❌ Ошибка генерации тестовых данных поля:', error);
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
    field,
    
    // Состояние
    isLoading,
    hasChanges,
    error,
    isSaving,
    isGenerating,
    saveErrorData,
    
    // Методы
    updateField,
    saveChanges,
    resetField,
    generateTestData,
    clearError,
    clearSaveError,
    handleSuccess
  };
}; 
