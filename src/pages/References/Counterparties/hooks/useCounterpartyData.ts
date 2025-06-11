// src/pages/References/Counterparties/hooks/useCounterpartyData.ts

import { useState, useEffect, useCallback } from 'react';
import { useEntityLoader } from '../../../../hooks/useEntityLoader';
import { useSyncData } from '../../../../hooks/useSyncData';
import { counterpartiesSyncConfig } from '../config/syncConfig';
import { CounterpartyData } from './useCounterpartyEdit';
import { hasChanges } from '../../../../utils/validation.utils';

export interface UseCounterpartyDataReturn {
  // Данные
  counterparty: CounterpartyData | null;
  originalCounterparty: CounterpartyData | null;
  
  // Состояние
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Методы
  loadCounterparty: (id: number) => Promise<void>;
  updateCounterparty: (updates: Partial<CounterpartyData>) => void;
  resetCounterparty: () => void;
  setCounterparty: (counterparty: CounterpartyData | null) => void;
  setOriginalCounterparty: (counterparty: CounterpartyData | null) => void;
  initializeNewCounterparty: () => void;
  clearError: () => void;
}

/**
 * Хук для управления данными контрагента
 */
export const useCounterpartyData = (
  counterpartyId?: number,
  errorHandler?: (error: any) => void
): UseCounterpartyDataReturn => {
  
  // Состояние контрагента
  const [counterparty, setCounterparty] = useState<CounterpartyData | null>(null);
  const [originalCounterparty, setOriginalCounterparty] = useState<CounterpartyData | null>(null);
  const [isLoadingCounterparty, setIsLoadingCounterparty] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Прямое использование синхронизации
  const {
    isInitialized,
    loadTableData,
    sync,
    error: syncError
  } = useSyncData(counterpartiesSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Универсальный загрузчик сущностей (для совместимости)
  const entityLoader = useEntityLoader<CounterpartyData>(
    {
      syncConfig: counterpartiesSyncConfig,
      entityTableName: 'reference_counterparties',
      relatedTableNames: ['link_counterparties_bank_accounts', 'reference_banks']
    },
    useSyncData,
    errorHandler || (() => {})
  );

  // Проверка изменений
  const currentHasChanges = hasChanges(counterparty, originalCounterparty);

  // Общая ошибка
  const error = syncError || entityLoader.error;

  // Сброс при смене ID
  useEffect(() => {
    setLoadAttempts(0);
    setCounterparty(null);
    setOriginalCounterparty(null);
  }, [counterpartyId]);

  // Загрузка контрагента по ID
  const loadCounterparty = useCallback(async (id: number) => {
    if (isLoadingCounterparty) {
      console.log('⏳ Загрузка контрагента уже выполняется, пропускаем...');
      return;
    }

    console.log(`🔍 Загружаем контрагента ID: ${id}`);
    setIsLoadingCounterparty(true);
    
    try {
      // Сначала получаем все данные из таблицы
      const allCounterparties = await loadTableData('reference_counterparties');
      console.log(`📊 Всего контрагентов в таблице: ${allCounterparties.length}`);
      
      if (allCounterparties.length === 0) {
        console.log('📥 Таблица пустая, выполняем синхронизацию...');
        await sync();
        // Повторно загружаем после синхронизации
        const counterpartiesAfterSync = await loadTableData('reference_counterparties');
        console.log(`📊 После синхронизации контрагентов: ${counterpartiesAfterSync.length}`);
      }
      
      // Ищем конкретного контрагента
      const foundCounterparty = allCounterparties.find((cp: any) => cp.id === id);
      
      if (foundCounterparty) {
        setCounterparty(foundCounterparty);
        setOriginalCounterparty(foundCounterparty);
        console.log(`✅ Загружен контрагент: ${foundCounterparty.full_name}`);
      } else {
        console.log(`❌ Контрагент с ID ${id} не найден среди ${allCounterparties.length} записей`);
        // Показываем список доступных ID для отладки
        const availableIds = allCounterparties.map((cp: any) => cp.id).slice(0, 10);
        console.log(`📋 Доступные ID контрагентов: ${availableIds.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки контрагента:', error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      setIsLoadingCounterparty(false);
    }
  }, [isLoadingCounterparty, loadTableData, sync, errorHandler]);

  // Автоинициализация нового контрагента
  useEffect(() => {
    if (!counterpartyId && !counterparty && isInitialized) {
      initializeNewCounterparty();
    }
  }, [counterpartyId, isInitialized]);

  // Загрузка при инициализации
  useEffect(() => {
    if (counterpartyId && isInitialized && !counterparty && !isLoadingCounterparty && loadAttempts < MAX_LOAD_ATTEMPTS) {
      setLoadAttempts(prev => prev + 1);
      loadCounterparty(counterpartyId);
    }
  }, [counterpartyId, isInitialized, counterparty, isLoadingCounterparty, loadAttempts]);

  // Инициализация нового контрагента
  const initializeNewCounterparty = useCallback(() => {
    const newCounterparty: CounterpartyData = {
      id: 0,
      full_name: '',
      counterparty_type: [],
      is_active: true,
      legal_name: undefined,
      legal_address: undefined,
      contact_email: undefined,
      contract_number: undefined,
      contract_date: undefined,
      contact_phone: undefined
    };
    
    setCounterparty(newCounterparty);
    setOriginalCounterparty(newCounterparty);
    console.log('🆕 Инициализирован новый контрагент');
  }, []);

  // Обновление контрагента
  const updateCounterparty = useCallback((updates: Partial<CounterpartyData>) => {
    setCounterparty(prev => {
      if (!prev) return null;
      
      // Убираем служебные поля
      const { bank_accounts, ...cleanUpdates } = updates as any;
      return { ...prev, ...cleanUpdates };
    });
  }, []);

  // Сброс изменений
  const resetCounterparty = useCallback(() => {
    if (originalCounterparty) {
      setCounterparty({ ...originalCounterparty });
      console.log('🔄 Сброшены изменения контрагента');
    }
  }, [originalCounterparty]);

  return {
    // Данные
    counterparty,
    originalCounterparty,
    
    // Состояние
    isLoading: entityLoader.isLoading || isLoadingCounterparty,
    isInitialized: isInitialized,
    error: error,
    hasChanges: currentHasChanges,
    
    // Методы
    loadCounterparty,
    updateCounterparty,
    resetCounterparty,
    setCounterparty,
    setOriginalCounterparty,
    initializeNewCounterparty,
    clearError: () => {
      entityLoader.clearError();
      // Дополнительная очистка если нужно
    }
  };
};