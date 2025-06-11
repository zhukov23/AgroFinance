// src/pages/References/Banks/hooks/useBankData.ts

import { useState, useEffect, useCallback } from 'react';
import { useEntityLoader } from '../../../../hooks/useEntityLoader';
import { useSyncData } from '../../../../hooks/useSyncData';
import { banksSyncConfig } from '../config/syncConfig';
import { BankData } from './useBankEdit';
import { hasChanges } from '../../../../utils/validation.utils';

export interface UseBankDataReturn {
  // Данные
  bank: BankData | null;
  originalBank: BankData | null;
  
  // Состояние
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Методы
  loadBank: (id: number) => Promise<void>;
  updateBank: (updates: Partial<BankData>) => void;
  resetBank: () => void;
  setBank: (bank: BankData | null) => void;
  setOriginalBank: (bank: BankData | null) => void;
  initializeNewBank: () => void;
  clearError: () => void;
}

/**
 * Хук для управления данными банка
 */
export const useBankData = (
  bankId?: number,
  errorHandler?: (error: any) => void
): UseBankDataReturn => {
  
  // Состояние банка
  const [bank, setBank] = useState<BankData | null>(null);
  const [originalBank, setOriginalBank] = useState<BankData | null>(null);
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Прямое использование синхронизации
  const {
    isInitialized,
    loadTableData,
    sync,
    error: syncError
  } = useSyncData(banksSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Универсальный загрузчик сущностей (для совместимости)
  const entityLoader = useEntityLoader<BankData>(
    {
      syncConfig: banksSyncConfig,
      entityTableName: 'reference_banks',
      relatedTableNames: []
    },
    useSyncData,
    errorHandler || (() => {})
  );

  // Проверка изменений
  const currentHasChanges = hasChanges(bank, originalBank);

  // Общая ошибка
  const error = syncError || entityLoader.error;

  // Загрузка банка по ID
  const loadBank = useCallback(async (id: number) => {
    if (isLoadingBank) {
      console.log('⏳ Загрузка банка уже выполняется, пропускаем...');
      return;
    }

    console.log(`🔍 Загружаем банк ID: ${id}`);
    setIsLoadingBank(true);
    
    try {
      // Сначала получаем все данные из таблицы
      const allBanks = await loadTableData('reference_banks');
      console.log(`📊 Всего банков в таблице: ${allBanks.length}`);
      
      if (allBanks.length === 0) {
        console.log('📥 Таблица пустая, выполняем синхронизацию...');
        await sync();
        // Повторно загружаем после синхронизации
        const banksAfterSync = await loadTableData('reference_banks');
        console.log(`📊 После синхронизации банков: ${banksAfterSync.length}`);
      }
      
      // Ищем конкретный банк
      const foundBank = allBanks.find((bank: any) => bank.id === id);
      
      if (foundBank) {
        setBank(foundBank);
        setOriginalBank(foundBank);
        console.log(`✅ Загружен банк: ${foundBank.name}`);
      } else {
        console.log(`❌ Банк с ID ${id} не найден среди ${allBanks.length} записей`);
        // Показываем список доступных ID для отладки
        const availableIds = allBanks.map((bank: any) => bank.id).slice(0, 10);
        console.log(`📋 Доступные ID банков: ${availableIds.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки банка:', error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      setIsLoadingBank(false);
    }
  }, [isLoadingBank, loadTableData, sync, errorHandler]);

  // Автоинициализация нового банка
  useEffect(() => {
    if (!bankId && !bank && isInitialized) {
      initializeNewBank();
    }
  }, [bankId, isInitialized]);

  // Загрузка при инициализации
  useEffect(() => {
    if (bankId && isInitialized && !bank && !isLoadingBank && loadAttempts < MAX_LOAD_ATTEMPTS) {
      setLoadAttempts(prev => prev + 1);
      loadBank(bankId);
    }
  }, [bankId, isInitialized, bank, isLoadingBank, loadAttempts]);

  // Инициализация нового банка
  const initializeNewBank = useCallback(() => {
    const newBank: BankData = {
      id: 0,
      name: '',
      bik: '',
      is_active: true
    };
    
    setBank(newBank);
    setOriginalBank(newBank);
    console.log('🆕 Инициализирован новый банк');
  }, []);

  // Сброс при смене ID
  useEffect(() => {
    setLoadAttempts(0);
    setBank(null);
    setOriginalBank(null);
  }, [bankId]);

  // Обновление банка
  const updateBank = useCallback((updates: Partial<BankData>) => {
    setBank(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  // Сброс изменений
  const resetBank = useCallback(() => {
    if (originalBank) {
      setBank({ ...originalBank });
      console.log('🔄 Сброшены изменения банка');
    }
  }, [originalBank]);

  return {
    // Данные
    bank,
    originalBank,
    
    // Состояние
    isLoading: entityLoader.isLoading || isLoadingBank,
    isInitialized: isInitialized,
    error: error,
    hasChanges: currentHasChanges,
    
    // Методы
    loadBank,
    updateBank,
    resetBank,
    setBank,
    setOriginalBank,
    initializeNewBank,
    clearError: () => {
      entityLoader.clearError();
      // Дополнительная очистка если нужно
    }
  };
};