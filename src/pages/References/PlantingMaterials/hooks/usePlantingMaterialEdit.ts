// src/pages/References/PlantingMaterials/hooks/usePlantingMaterialEdit.ts

import { useCallback } from 'react';
import { usePlantingMaterialData } from './usePlantingMaterialData';
import { useSavePlantingMaterial } from './useSavePlantingMaterial';
import { useTestDataGeneration } from './useTestDataGeneration';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useSyncData } from '../../../../hooks/useSyncData';
import { plantingMaterialsSyncConfig } from '../config/syncConfig';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

// Базовый интерфейс для посевного материала
export interface PlantingMaterialData {
  id?: number;
  name: string;
  scientific_name?: string;
  variety?: string;
  material_type: string;
  crop_category: string;
  season_type?: string;
  origin_country?: string;
  breeder?: string;
  maturity_days?: number;
  planting_rate?: number;
  planting_depth?: number;
  row_spacing?: number;
  plant_spacing?: number;
  potential_yield?: number;
  recommended_soil_types?: string[];
  ph_range_min?: number;
  ph_range_max?: number;
  frost_resistance?: number;
  drought_tolerance?: number;
  water_requirement?: string;
  planting_period_start?: string;
  planting_period_end?: string;
  harvest_period_start?: string;
  harvest_period_end?: string;
  disease_resistance?: string[];
  pest_resistance?: string[];
  storage_requirements?: string;
  shelf_life_months?: number;
  description?: string;
  cultivation_notes?: string;
  status?: string;
  rating?: number;
  notes?: string;
  tags?: string[];
  is_active?: boolean;
  manufacturer_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface UsePlantingMaterialEditReturn {
  // Данные
  plantingMaterial: PlantingMaterialData | null;
  
  // Состояние
  isLoading: boolean;
  hasChanges: boolean;
  error: string | null;
  isSaving: boolean;
  isGenerating: boolean;
  saveErrorData: any;
  
  // Методы
  updatePlantingMaterial: (updates: Partial<PlantingMaterialData>) => void;
  saveChanges: () => Promise<boolean>;
  resetPlantingMaterial: () => void;
  generateTestData: () => Promise<void>;
  clearError: () => void;
  clearSaveError: () => void;
  handleSuccess: (message: string) => void;
}

/**
 * Главный хук для редактирования посевного материала
 */
export const usePlantingMaterialEdit = (plantingMaterialId?: number): UsePlantingMaterialEditReturn => {
  
  // Используем хук для синхронизации данных
  const { 
    isInitialized, 
    isLoading: syncLoading, 
    sync: performSyncOriginal 
  } = useSyncData(plantingMaterialsSyncConfig, {
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

  // Управление данными посевного материала
  const {
    plantingMaterial,
    isLoading: dataLoading,
    hasChanges,
    error: dataError,
    updatePlantingMaterial,
    resetPlantingMaterial,
    clearError: clearDataError
  } = usePlantingMaterialData(plantingMaterialId, handleSaveError);

  // Сохранение посевного материала
  const { isSaving, saveChanges: savePlantingMaterial } = useSavePlantingMaterial();

  // Генерация тестовых данных
  const { isGenerating, generateTestData: generateTestDataAction } = useTestDataGeneration(
    {
      apiBaseUrl: DEFAULT_API_BASE_URL,
      onDataGenerated: (data) => {
        console.log('🎯 Получены тестовые данные посевного материала:', data);
        // Применяем только определенные поля из сгенерированных данных
        updatePlantingMaterial(data);
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
  const prepareDataForSave = useCallback((data: PlantingMaterialData): PlantingMaterialData => {
    const prepared = { ...data };
    
    // Преобразуем массивы в JSON строки для JSONB полей
    if (Array.isArray(prepared.recommended_soil_types)) {
      prepared.recommended_soil_types = JSON.stringify(prepared.recommended_soil_types) as any;
    }
    if (Array.isArray(prepared.disease_resistance)) {
      prepared.disease_resistance = JSON.stringify(prepared.disease_resistance) as any;
    }
    if (Array.isArray(prepared.pest_resistance)) {
      prepared.pest_resistance = JSON.stringify(prepared.pest_resistance) as any;
    }
    if (Array.isArray(prepared.tags)) {
      prepared.tags = JSON.stringify(prepared.tags) as any;
    }
    
    return prepared;
  }, []);

  // Сохранение изменений
  const saveChanges = useCallback(async (): Promise<boolean> => {
    if (!plantingMaterial) {
      const errorMsg = 'Нет данных посевного материала для сохранения';
      console.error('❌', errorMsg);
      setLocalError(errorMsg);
      return false;
    }

    try {
      console.log('💾 Начинаем сохранение посевного материала:', plantingMaterial.name);
      
      // Подготавливаем данные для сохранения (преобразуем массивы в JSON)
      const preparedData = prepareDataForSave(plantingMaterial);
      console.log('🔧 Подготовленные данные:', preparedData);
      
      const success = await savePlantingMaterial(preparedData);
      
      if (success) {
        console.log('✅ Посевной материал успешно сохранен');
        return true;
      } else {
        console.log('❌ Сохранение посевного материала не удалось');
        return false;
      }
    } catch (error) {
      console.error('💥 Ошибка при сохранении посевного материала:', error);
      handleSaveError(error);
      return false;
    }
  }, [plantingMaterial, prepareDataForSave, savePlantingMaterial, setLocalError, handleSaveError]);

  // Генерация тестовых данных
  const generateTestData = useCallback(async () => {
    try {
      console.log('🎲 Генерируем тестовые данные посевного материала...');
      await generateTestDataAction();
      console.log('✅ Тестовые данные посевного материала сгенерированы');
    } catch (error) {
      console.error('❌ Ошибка генерации тестовых данных посевного материала:', error);
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
    plantingMaterial,
    
    // Состояние
    isLoading,
    hasChanges,
    error,
    isSaving,
    isGenerating,
    saveErrorData,
    
    // Методы
    updatePlantingMaterial,
    saveChanges,
    resetPlantingMaterial,
    generateTestData,
    clearError,
    clearSaveError,
    handleSuccess
  };
};