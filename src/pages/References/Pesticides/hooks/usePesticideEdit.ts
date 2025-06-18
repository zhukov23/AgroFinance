// src/pages/References/Pesticides/hooks/usePesticideEdit.ts

import { useCallback } from 'react';
import { usePesticideData } from './usePesticideData';
import { useSavePesticide } from './useSavePesticide';
import { useTestDataGeneration } from './useTestDataGeneration';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useSyncData } from '../../../../hooks/useSyncData';
import { pesticideSyncConfig } from '../config/syncConfig';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
// Базовый интерфейс для пестицида
export interface PesticideData {
  id?: number;
  name: string;
  trade_name?: string;
  registration_number?: string;
  manufacturer_id?: number;
  supplier_id?: number;
  pesticide_type: string;
  hazard_class: string;
  physical_form: string;
  active_substances: any[];
  concentration_info?: any;
  target_pests?: any[];
  target_crops?: any[];
  application_method?: string;
  dosage_info?: any;
  registration_status?: string;
  registration_date?: string;
  expiry_date?: string;
  registration_authority?: string;
  base_price?: number;
  currency_code?: string;
  price_per_unit?: string;
  package_size?: number;
  package_unit?: string;
  storage_conditions?: string;
  shelf_life_months?: number;
  safety_precautions?: string;
  antidote_info?: string;
  ph_range?: any;
  temperature_range?: any;
  compatibility_info?: any;
  certificates?: any;
  documents?: any;
  is_active?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
}

export interface UsePesticideEditReturn {
  // Данные
  pesticide: PesticideData | null;
  
  // Состояние
  isLoading: boolean;
  hasChanges: boolean;
  error: string | null;
  isSaving: boolean;
  isGenerating: boolean;
  saveErrorData: any;
  
  // Методы
  updatePesticide: (updates: Partial<PesticideData>) => void;
  saveChanges: () => Promise<boolean>;
  resetPesticide: () => void;
  generateTestData: () => Promise<void>;
  clearError: () => void;
  clearSaveError: () => void;
  handleSuccess: (message: string) => void;
}

/**
 * Главный хук для редактирования пестицидов
 */
export const usePesticideEdit = (pesticideId?: number): UsePesticideEditReturn => {
  
  // Используем хук для синхронизации данных
  const { 
    isInitialized, 
    isLoading: syncLoading, 
    sync: performSyncOriginal 
  } = useSyncData(pesticideSyncConfig, {
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

  // Управление данными пестицида
  const {
    pesticide,
    isLoading: dataLoading,
    hasChanges,
    error: dataError,
    updatePesticide,
    resetPesticide,
    clearError: clearDataError
  } = usePesticideData(pesticideId, handleSaveError);

  // Сохранение пестицида
  const { isSaving, saveChanges: savePesticide } = useSavePesticide();

  // Генерация тестовых данных
  const { isGenerating, generateTestData: generateTestDataAction } = useTestDataGeneration(
    {
      apiBaseUrl: DEFAULT_API_BASE_URL,
      onDataGenerated: (data) => {
        console.log('🎯 Получены тестовые данные пестицида:', data);
        // Применяем только определенные поля из сгенерированных данных
        updatePesticide(data);
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
  const prepareDataForSave = useCallback((data: PesticideData): PesticideData => {
    const prepared = { ...data };
    
    // Преобразуем объекты в JSON строки для JSONB полей
    const jsonbFields = [
      'active_substances', 'concentration_info', 'target_pests', 'target_crops',
      'dosage_info', 'ph_range', 'temperature_range', 'compatibility_info',
      'certificates', 'documents'
    ];

    jsonbFields.forEach(field => {
      if (prepared[field as keyof PesticideData] && typeof prepared[field as keyof PesticideData] === 'object') {
        (prepared as any)[field] = JSON.stringify(prepared[field as keyof PesticideData]);
      }
    });
    
    return prepared;
  }, []);

  // Сохранение изменений
  const saveChanges = useCallback(async (): Promise<boolean> => {
    if (!pesticide) {
      const errorMsg = 'Нет данных пестицида для сохранения';
      console.error('❌', errorMsg);
      setLocalError(errorMsg);
      return false;
    }

    try {
      console.log('💾 Начинаем сохранение пестицида:', pesticide.name);
      
      // Подготавливаем данные для сохранения (преобразуем объекты в JSON)
      const preparedData = prepareDataForSave(pesticide);
      console.log('🔧 Подготовленные данные:', preparedData);
      
      const success = await savePesticide(preparedData);
      
      if (success) {
        console.log('✅ Пестицид успешно сохранен');
        return true;
      } else {
        console.log('❌ Сохранение пестицида не удалось');
        return false;
      }
    } catch (error) {
      console.error('💥 Ошибка при сохранении пестицида:', error);
      handleSaveError(error);
      return false;
    }
  }, [pesticide, prepareDataForSave, savePesticide, setLocalError, handleSaveError]);

  // Генерация тестовых данных
  const generateTestData = useCallback(async () => {
    try {
      console.log('🎲 Генерируем тестовые данные пестицида...');
      await generateTestDataAction();
      console.log('✅ Тестовые данные пестицида сгенерированы');
    } catch (error) {
      console.error('❌ Ошибка генерации тестовых данных пестицида:', error);
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
    pesticide,
    
    // Состояние
    isLoading,
    hasChanges,
    error,
    isSaving,
    isGenerating,
    saveErrorData,
    
    // Методы
    updatePesticide,
    saveChanges,
    resetPesticide,
    generateTestData,
    clearError,
    clearSaveError,
    handleSuccess
  };
}; 
