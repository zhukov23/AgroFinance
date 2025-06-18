// src/pages/Inventory/HarvestedProducts/hooks/useHarvestedProductEdit.ts

import { useCallback } from 'react';
import { useHarvestedProductData } from './useHarvestedProductData';
import { useSaveHarvestedProduct } from './useSaveHarvestedProduct';
import { useTestDataGeneration } from './useTestDataGeneration';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useSyncData } from '../../../../hooks/useSyncData';
import { harvestedProductsSyncConfig } from '../config/syncConfig';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

// Базовый интерфейс для урожайной продукции
export interface HarvestedProductData {
  id?: number;
  planting_id?: number;
  product_name: string;
  planting_material_id?: number;
  harvest_date: string;
  field_name?: string;
  harvest_area?: number;
  quantity: number;
  moisture_content?: number;
  protein_content?: number;
  oil_content?: number;
  gluten_content?: number;
  sugar_content?: number;
  starch_content?: number;
  impurities?: number;
  damaged_grains?: number;
  test_weight?: number;
  quality_class?: string;
  grade?: string;
  storage_date?: string;
  storage_conditions?: string;
  production_cost?: number;
  production_cost_per_unit?: number;
  market_price_at_harvest?: number;
  current_market_price?: number;
  lab_analysis_date?: string;
  lab_certificate_number?: string;
  additional_indicators?: any;
  quantity_sold?: number;
  quantity_processed?: number;
  quantity_reserved?: number;
  quantity_damaged?: number;
  quantity_available?: number;
  harvest_conditions?: string;
  processing_recommendations?: string;
  status?: string;
  rating?: number;
  notes?: string;
  tags?: string[];
  is_active?: boolean;
  storage_location_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface UseHarvestedProductEditReturn {
  // Данные
  harvestedProduct: HarvestedProductData | null;
  
  // Состояние
  isLoading: boolean;
  hasChanges: boolean;
  error: string | null;
  isSaving: boolean;
  isGenerating: boolean;
  saveErrorData: any;
  
  // Методы
  updateHarvestedProduct: (updates: Partial<HarvestedProductData>) => void;
  saveChanges: () => Promise<boolean>;
  resetHarvestedProduct: () => void;
  generateTestData: () => Promise<void>;
  clearError: () => void;
  clearSaveError: () => void;
  handleSuccess: (message: string) => void;
}

/**
 * Главный хук для редактирования урожайной продукции
 */
export const useHarvestedProductEdit = (harvestedProductId?: number): UseHarvestedProductEditReturn => {
  
  // Используем хук для синхронизации данных
  const { 
    isInitialized, 
    isLoading: syncLoading, 
    sync: performSyncOriginal 
  } = useSyncData(harvestedProductsSyncConfig, {
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

  // Управление данными урожайной продукции
  const {
    harvestedProduct,
    isLoading: dataLoading,
    hasChanges,
    error: dataError,
    updateHarvestedProduct,
    resetHarvestedProduct,
    clearError: clearDataError
  } = useHarvestedProductData(harvestedProductId, handleSaveError);

  // Сохранение урожайной продукции
  const { isSaving, saveChanges: saveHarvestedProduct } = useSaveHarvestedProduct();

  // Генерация тестовых данных
  const { isGenerating, generateTestData: generateTestDataAction } = useTestDataGeneration(
    {
      apiBaseUrl: DEFAULT_API_BASE_URL,
      onDataGenerated: (data) => {
        console.log('🎯 Получены тестовые данные урожайной продукции:', data);
        // Применяем только определенные поля из сгенерированных данных
        updateHarvestedProduct(data);
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
  const prepareDataForSave = useCallback((data: HarvestedProductData): HarvestedProductData => {
    const prepared = { ...data };
    
    // Преобразуем массивы в JSON строки для JSONB полей
    if (Array.isArray(prepared.tags)) {
      prepared.tags = JSON.stringify(prepared.tags) as any;
    }
    if (prepared.additional_indicators && typeof prepared.additional_indicators === 'object') {
      prepared.additional_indicators = JSON.stringify(prepared.additional_indicators);
    }
    
    return prepared;
  }, []);

  // Сохранение изменений
  const saveChanges = useCallback(async (): Promise<boolean> => {
    if (!harvestedProduct) {
      const errorMsg = 'Нет данных урожайной продукции для сохранения';
      console.error('❌', errorMsg);
      setLocalError(errorMsg);
      return false;
    }

    try {
      console.log('💾 Начинаем сохранение урожайной продукции:', harvestedProduct.product_name);
      
      // Подготавливаем данные для сохранения (преобразуем массивы в JSON)
      const preparedData = prepareDataForSave(harvestedProduct);
      console.log('🔧 Подготовленные данные:', preparedData);
      
      const success = await saveHarvestedProduct(preparedData);
      
      if (success) {
        console.log('✅ Урожайная продукция успешно сохранена');
        return true;
      } else {
        console.log('❌ Сохранение урожайной продукции не удалось');
        return false;
      }
    } catch (error) {
      console.error('💥 Ошибка при сохранении урожайной продукции:', error);
      handleSaveError(error);
      return false;
    }
  }, [harvestedProduct, prepareDataForSave, saveHarvestedProduct, setLocalError, handleSaveError]);

  // Генерация тестовых данных
  const generateTestData = useCallback(async () => {
    try {
      console.log('🎲 Генерируем тестовые данные урожайной продукции...');
      await generateTestDataAction();
      console.log('✅ Тестовые данные урожайной продукции сгенерированы');
    } catch (error) {
      console.error('❌ Ошибка генерации тестовых данных урожайной продукции:', error);
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
    harvestedProduct,
    
    // Состояние
    isLoading,
    hasChanges,
    error,
    isSaving,
    isGenerating,
    saveErrorData,
    
    // Методы
    updateHarvestedProduct,
    saveChanges,
    resetHarvestedProduct,
    generateTestData,
    clearError,
    clearSaveError,
    handleSuccess
  };
}; 
