// src/pages/References/Banks/hooks/useBankEdit.ts

import { useMemo } from 'react';
import { useSyncData } from '../../../../hooks/useSyncData';
import { banksSyncConfig } from '../config/syncConfig';
import { Bank } from '../config/tableConfig';
import { useSaveBank } from './useSaveBank';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useBankData } from './useBankData';
import { useTestDataGeneration, createTestDataConfig } from './useTestDataGeneration';

// Алиас для обратной совместимости
export type BankData = Bank;

export interface UseBankEditReturn {
  // Данные
  bank: BankData | null;
  
  // Состояние загрузки
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Состояние изменений
  hasChanges: boolean;
  isSaving: boolean;
  isGenerating: boolean;
  
  // Методы управления банком
  updateBank: (updates: Partial<BankData>) => void;
  resetBank: () => void;
  
  // Методы сохранения
  saveChanges: () => Promise<boolean>;
  loadBank: (id: number) => Promise<void>;
  generateTestData: () => Promise<void>;
  
  // Обработка ошибок
  saveErrorData: any;
  clearSaveError: () => void;
  clearError: () => void;
  handleSuccess: (message: string, details?: string) => void;
}

/**
 * Основной хук для управления редактированием банка
 * Координатор специализированных хуков
 */
export const useBankEdit = (bankId?: number): UseBankEditReturn => {
  
  // Обработка ошибок и успешных операций
  const { 
    localError, 
    saveErrorData, 
    clearError, 
    clearSaveError, 
    handleSaveError,
    handleSuccess  
  } = useValidationErrorHandler();

  // Управление данными банка
  const bankData = useBankData(bankId, handleSaveError);

  // Синхронизация данных
  const {
    isInitialized,
    isLoading: syncLoading,
    error: syncError,
    sync: performSync
  } = useSyncData(banksSyncConfig, { 
    autoInitialize: true, 
    autoSync: false 
  });

  // Сохранение данных
  const { isSaving, saveChanges: performSave } = useSaveBank();

  // Генерация тестовых данных
  const testDataGeneration = useTestDataGeneration(
    createTestDataConfig(
      banksSyncConfig.apiBaseUrl || 'http://localhost:3000',
      (generatedBank) => {
        // Применяем сгенерированные данные банка
        bankData.updateBank(generatedBank);
      },
      handleSaveError,
      (status) => console.log('🎯 TestDataGenerator статус:', status)
    ),
    {
      isInitialized,
      syncLoading,
      performSync: async () => { await performSync(); }
    }
  );

  // Вычисляемые свойства
  const isLoading = bankData.isLoading || syncLoading || isSaving || testDataGeneration.isGenerating;
  const error = localError || bankData.error || syncError;
  const hasChanges = bankData.hasChanges;

  // Сброс изменений
  const resetBank = () => {
    bankData.resetBank();
  };

  // Обертка для сохранения с обработкой ошибок
  const saveChanges = async (): Promise<boolean> => {
    if (!bankData.bank) {
      handleSaveError('Нет данных для сохранения');
      return false;
    }

    try {
      const success = await performSave(bankData.bank);
      
      if (success) {
        // Обновляем оригинальные данные после успешного сохранения
        bankData.setOriginalBank({ ...bankData.bank });
        console.log('✅ Банк успешно сохранен');
      }
      
      return success;
    } catch (error) {
      handleSaveError(error);
      return false;
    }
  };

  return {
    // Данные
    bank: bankData.bank,
    
    // Состояние
    isLoading,
    isInitialized: bankData.isInitialized,
    error,
    hasChanges,
    isSaving,
    isGenerating: testDataGeneration.isGenerating,
    
    // Методы управления банком
    updateBank: bankData.updateBank,
    resetBank,
    
    // Методы сохранения
    saveChanges,
    loadBank: bankData.loadBank,
    generateTestData: testDataGeneration.generateTestData,
    
    // Обработка ошибок
    saveErrorData,
    clearSaveError,
    clearError: () => {
      clearError();
      bankData.clearError();
    },
    handleSuccess
  };
}; 
