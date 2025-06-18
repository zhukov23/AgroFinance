// src/pages/References/Banks/hooks/useBankEdit.ts

import { useMemo } from 'react';
import { useSyncData } from '../../../../hooks/useSyncData';
import { banksSyncConfig } from '../config/syncConfig';
import { Bank } from '../config/tableConfig';
import { useSaveBank } from './useSaveBank';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useBankData } from './useBankData';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

// Добавить другие импорты если есть связанные сущности...

// Алиас для обратной совместимости (ВАЖНО: экспортируем тип BankData)
export type BankData = Bank;

// Интерфейсы
export interface UseBankEditReturn {
  // Данные
  bank: BankData | null;
  // ... другие данные если есть связанные сущности
  
  // Состояние загрузки
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Состояние изменений
  hasChanges: boolean;
  isSaving: boolean;
  isGenerating?: boolean;
  
  // Методы управления банком
  updateBank: (updates: Partial<BankData>) => void;
  resetBank: () => void;
  
  // Методы сохранения
  saveChanges: () => Promise<boolean>;
  loadBank: (id: number) => Promise<void>;
  generateTestData?: () => Promise<void>;
  
  // Обработка ошибок
  saveErrorData: any;
  clearSaveError: () => void;
  clearError: () => void;
  handleSuccess: (message: string, details?: string) => void;
}

/**
 * Основной хук для управления редактированием банка
 */
export const useBankEdit = (bankId?: number): UseBankEditReturn => {
  
  // Обработка ошибок и успешных операций
  const { 
    localError, 
    saveErrorData, 
    clearError: clearValidationError, // ← Переименовываем для избежания конфликта
    clearSaveError, 
    handleSaveError,
    handleSuccess  // ← Всегда доступен
  } = useValidationErrorHandler();

  // Управление данными банка
  const bankData = useBankData(bankId, handleSaveError);

  // Синхронизация данных
  const {
    isInitialized,
    isLoading: syncLoading,
    error: syncError,
    loadTableData,
    tableData,
    sync: performSync
  } = useSyncData(banksSyncConfig, { 
    autoInitialize: true, 
    autoSync: false 
  });

  // Сохранение данных
  const { isSaving, saveChanges: performSave } = useSaveBank();

  // Если есть генерация тестовых данных - добавить здесь...
  // const testDataGeneration = useTestDataGeneration(...);

  // Вычисляемые свойства
  const isLoading = bankData.isLoading || syncLoading || isSaving;
  const error = localError || bankData.error || syncError;
  const hasChanges = bankData.hasChanges;

  // Сброс изменений
  const resetBank = () => {
    bankData.resetBank();
    // Сброс связанных сущностей если есть...
  };

  // Обертка для сохранения с обработкой ошибок
  const saveChanges = async (): Promise<boolean> => {
    if (!bankData.bank) {
      handleSaveError('Нет данных для сохранения');
      return false;
    }

    try {
      // Если есть связанные сущности, передать их в performSave
      const success = await performSave(bankData.bank /* , relatedEntities */);
      
      if (success) {
        // Обновляем оригинальные данные после успешного сохранения
        bankData.setOriginalBank({ ...bankData.bank });
        // Обновить связанные сущности если есть...
        console.log('✅ Банк успешно сохранен');
        
        // Показываем успешное уведомление
        handleSuccess('Банк сохранен', 'Данные банка успешно обновлены');
      }
      
      return success;
    } catch (error) {
      handleSaveError(error);
      return false;
    }
  };

  // Комбинированная функция очистки ошибок
  const clearError = () => {
    clearValidationError(); // ← Используем переименованную функцию
    bankData.clearError();
  };

  return {
    // Данные
    bank: bankData.bank,
    // ... другие данные если есть
    
    // Состояние
    isLoading,
    isInitialized: bankData.isInitialized,
    error,
    hasChanges,
    isSaving,
    // isGenerating: testDataGeneration?.isGenerating,
    
    // Методы управления банком
    updateBank: bankData.updateBank,
    resetBank,
    
    // Методы сохранения
    saveChanges,
    loadBank: bankData.loadBank,
    // generateTestData: testDataGeneration?.generateTestData,
    
    // Обработка ошибок
    saveErrorData,
    clearSaveError,
    clearError, // ← Локальная функция
    handleSuccess // ← Всегда доступен
  };
};