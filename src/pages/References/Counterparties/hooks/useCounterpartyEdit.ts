// src/pages/References/Counterparties/hooks/useCounterpartyEdit.ts

import { useMemo } from 'react';
import { useSyncData } from '../../../../hooks/useSyncData';
import { counterpartiesSyncConfig } from '../config/syncConfig';
import { Counterparty } from '../config/tableConfig';
import { useSaveCounterparty } from './useSaveCounterparty';
import { useValidationErrorHandler } from '../../../../hooks/useValidationErrorHandler';
import { useCounterpartyData } from './useCounterpartyData';
import { useBankAccountsManager } from './useBankAccountsManager';
import { useTestDataGeneration, createTestDataConfig } from './useTestDataGeneration';
import { BankInfo } from '../services/testDataGenerator';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
// Алиас для обратной совместимости
export type CounterpartyData = Counterparty;

export interface BankAccountData {
  id?: number;
  organization_id: number;
  bank_id: number;
  account_number: string;
  currency: string;
  is_primary: boolean;
  is_active: boolean;
  purpose: string;
  opening_date?: string;
  closing_date?: string;
  notes?: string;
  // Данные банка (из джойна)
  bank_name?: string;
  bank_bik?: string;
  bank_correspondent_account?: string;
  bank_address?: string;
  bank_swift?: string;
}

export interface UseCounterpartyEditReturn {
  // Данные
  counterparty: CounterpartyData | null;
  bankAccounts: BankAccountData[];
  primaryBank: BankAccountData | null;
  additionalBanks: BankAccountData[];
  
  // Состояние загрузки
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Состояние изменений
  hasChanges: boolean;
  isSaving: boolean;
  isGenerating: boolean;
  
  // Методы управления контрагентом
  updateCounterparty: (updates: Partial<CounterpartyData>) => void;
  resetCounterparty: () => void;
  
  // Методы управления банковскими счетами
  addBankAccount: (bankAccount: Omit<BankAccountData, 'id' | 'organization_id'>) => void;
  updateBankAccount: (id: number, updates: Partial<BankAccountData>) => void;
  removeBankAccount: (id: number) => void;
  setPrimaryBank: (id: number) => void;
  
  // Методы сохранения
  saveChanges: () => Promise<boolean>;
  loadCounterparty: (id: number) => Promise<void>;
  generateTestData: () => Promise<void>;
  
  // Обработка ошибок
  saveErrorData: any;
  clearSaveError: () => void;
  clearError: () => void;
  handleSuccess: (message: string, details?: string) => void;
}

/**
 * Основной хук для управления редактированием контрагента
 * Теперь является координатором специализированных хуков
 */
export const useCounterpartyEdit = (counterpartyId?: number): UseCounterpartyEditReturn => {
  
  // Обработка ошибок и успешных операций
  const { 
    localError, 
    saveErrorData, 
    clearError: clearValidationError, // ← Переименовываем для избежания конфликта
    clearSaveError, 
    handleSaveError,
    handleSuccess  // ← Этот метод доступен так как useToasts: true по умолчанию
  } = useValidationErrorHandler();

  // Управление данными контрагента
  const counterpartyData = useCounterpartyData(counterpartyId, handleSaveError);

  // Управление банковскими счетами
  const bankManager = useBankAccountsManager(counterpartyId);

  // Синхронизация данных (для получения банков и других справочников)
  const {
    isInitialized,
    isLoading: syncLoading,
    error: syncError,
    loadTableData,
    tableData,
    sync: performSync
  } = useSyncData(counterpartiesSyncConfig, { 
    autoInitialize: true, 
    autoSync: false 
  });

  // Сохранение данных
  const { isSaving, saveChanges: performSave } = useSaveCounterparty();

  // Получение данных банков для генерации тестовых данных
  const banksData: BankInfo[] = useMemo(() => 
    tableData?.reference_banks || [], 
    [tableData]
  );

  // Генерация тестовых данных
  const testDataGeneration = useTestDataGeneration(
    createTestDataConfig(
      counterpartiesSyncConfig.apiBaseUrl || DEFAULT_API_BASE_URL,
      (generatedCounterparty, generatedBankAccounts) => {
        // Применяем сгенерированные данные контрагента
        counterpartyData.updateCounterparty(generatedCounterparty);
        
        // Очищаем существующие банковские счета и добавляем новые
        bankManager.setEntities([]);
        generatedBankAccounts.forEach(bankAccount => {
          console.log(`➕ Добавляем счет: ${bankAccount.account_number} (${bankAccount.bank_name})`);
          bankManager.addBankAccount(bankAccount);
        });
      },
      handleSaveError,
      (status) => console.log('🎯 TestDataGenerator статус:', status)
    ),
    {
      isInitialized,
      syncLoading,
      banksData,
      performSync: async () => { await performSync(); }, // ← Обертка
      loadTableData
    }
  );

  // Вычисляемые свойства
  const isLoading = counterpartyData.isLoading || syncLoading || isSaving || testDataGeneration.isGenerating;
  const error = localError || counterpartyData.error || syncError;
  const hasChanges = counterpartyData.hasChanges || bankManager.hasChanges;

  // Комбинированный сброс изменений
  const resetCounterparty = () => {
    counterpartyData.resetCounterparty();
    bankManager.resetEntities();
  };

  // Обертка для сохранения с обработкой ошибок
  const saveChanges = async (): Promise<boolean> => {
    if (!counterpartyData.counterparty) {
      handleSaveError('Нет данных для сохранения');
      return false;
    }

    try {
      const success = await performSave(counterpartyData.counterparty, bankManager.bankAccounts);
      
      if (success) {
        // Обновляем оригинальные данные после успешного сохранения
        counterpartyData.setOriginalCounterparty({ ...counterpartyData.counterparty });
        bankManager.setOriginalEntities([...bankManager.bankAccounts]);
        console.log('✅ Контрагент успешно сохранен');
        
        // Показываем успешное уведомление
        if (handleSuccess) {
          handleSuccess('Контрагент сохранен', 'Данные контрагента и банковские счета успешно обновлены');
        }
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
    counterpartyData.clearError();
  };

  return {
    // Данные
    counterparty: counterpartyData.counterparty,
    bankAccounts: bankManager.bankAccounts,
    primaryBank: bankManager.primaryBank || null,
    additionalBanks: bankManager.additionalBanks,
    
    // Состояние
    isLoading,
    isInitialized: counterpartyData.isInitialized,
    error,
    hasChanges,
    isSaving,
    isGenerating: testDataGeneration.isGenerating,
    
    // Методы управления контрагентом
    updateCounterparty: counterpartyData.updateCounterparty,
    resetCounterparty,
    
    // Методы управления банковскими счетами
    addBankAccount: bankManager.addBankAccount,
    updateBankAccount: bankManager.updateBankAccount,
    removeBankAccount: bankManager.removeBankAccount,
    setPrimaryBank: bankManager.setPrimaryBank,
    
    // Методы сохранения
    saveChanges,
    loadCounterparty: counterpartyData.loadCounterparty,
    generateTestData: testDataGeneration.generateTestData,
    
    // Обработка ошибок
    saveErrorData,
    clearSaveError,
    clearError, // ← Теперь это отдельная функция
    handleSuccess: handleSuccess! // ← Гарантированно доступен так как useToasts: true
  };
};