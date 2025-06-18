// src/pages/References/Pesticides/hooks/usePesticideData.ts

import { useState, useEffect, useCallback } from 'react';
import { useEntityLoader } from '../../../../hooks/useEntityLoader';
import { useSyncData } from '../../../../hooks/useSyncData';
import { pesticideSyncConfig } from '../config/syncConfig';
import { PesticideData } from './usePesticideEdit';
import { hasChanges } from '../../../../utils/validation.utils';

export interface UsePesticideDataReturn {
  // Данные
  pesticide: PesticideData | null;
  originalPesticide: PesticideData | null;
  
  // Состояние
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Методы
  loadPesticide: (id: number) => Promise<void>;
  updatePesticide: (updates: Partial<PesticideData>) => void;
  resetPesticide: () => void;
  setPesticide: (pesticide: PesticideData | null) => void;
  setOriginalPesticide: (pesticide: PesticideData | null) => void;
  initializeNewPesticide: () => void;
  clearError: () => void;
}

/**
 * Хук для управления данными СЗР (пестицидов)
 */
export const usePesticideData = (
  pesticideId?: number,
  errorHandler?: (error: any) => void
): UsePesticideDataReturn => {
  
  // Состояние пестицида
  const [pesticide, setPesticide] = useState<PesticideData | null>(null);
  const [originalPesticide, setOriginalPesticide] = useState<PesticideData | null>(null);
  const [isLoadingPesticide, setIsLoadingPesticide] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Прямое использование синхронизации
  const {
    isInitialized,
    loadTableData,
    sync,
    error: syncError
  } = useSyncData(pesticideSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Универсальный загрузчик сущностей
  const entityLoader = useEntityLoader<PesticideData>(
    {
      syncConfig: pesticideSyncConfig,
      entityTableName: 'reference_pesticides',
      relatedTableNames: ['reference_counterparties'] // Связанные производители/поставщики
    },
    useSyncData,
    errorHandler || (() => {})
  );

  // Проверка изменений
  const currentHasChanges = hasChanges(pesticide, originalPesticide);

  // Общая ошибка
  const error = syncError || entityLoader.error;

  // Сброс при смене ID
  useEffect(() => {
    setLoadAttempts(0);
    setPesticide(null);
    setOriginalPesticide(null);
  }, [pesticideId]);

  // Загрузка пестицида по ID
  const loadPesticide = useCallback(async (id: number) => {
    if (isLoadingPesticide) {
      console.log('⏳ Загрузка СЗР уже выполняется, пропускаем...');
      return;
    }

    console.log(`🔍 Загружаем СЗР ID: ${id}`);
    setIsLoadingPesticide(true);
    
    try {
      // Сначала получаем все данные из таблицы
      const allPesticides = await loadTableData('reference_pesticides');
      console.log(`📊 Всего СЗР в таблице: ${allPesticides.length}`);
      
      if (allPesticides.length === 0) {
        console.log('📥 Таблица пустая, выполняем синхронизацию...');
        await sync();
        // Повторно загружаем после синхронизации
        const pesticidesAfterSync = await loadTableData('reference_pesticides');
        console.log(`📊 После синхронизации СЗР: ${pesticidesAfterSync.length}`);
      }
      
      // Ищем конкретный пестицид
      const foundPesticide = allPesticides.find((item: any) => item.id === id);
      
      if (foundPesticide) {
        setPesticide(foundPesticide);
        setOriginalPesticide(foundPesticide);
        console.log(`✅ Загружен СЗР: ${foundPesticide.name}`);
      } else {
        console.log(`❌ СЗР с ID ${id} не найден среди ${allPesticides.length} записей`);
        // Показываем список доступных ID для отладки
        const availableIds = allPesticides.map((item: any) => item.id).slice(0, 10);
        console.log(`📋 Доступные ID СЗР: ${availableIds.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки СЗР:', error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      setIsLoadingPesticide(false);
    }
  }, [isLoadingPesticide, loadTableData, sync, errorHandler]);

  // Автоинициализация нового пестицида
  useEffect(() => {
    if (!pesticideId && !pesticide && isInitialized) {
      initializeNewPesticide();
    }
  }, [pesticideId, isInitialized]);

  // Загрузка при инициализации
  useEffect(() => {
    if (pesticideId && isInitialized && !pesticide && !isLoadingPesticide && loadAttempts < MAX_LOAD_ATTEMPTS) {
      setLoadAttempts(prev => prev + 1);
      loadPesticide(pesticideId);
    }
  }, [pesticideId, isInitialized, pesticide, isLoadingPesticide, loadAttempts]);

  // Инициализация нового пестицида
  const initializeNewPesticide = useCallback(() => {
    const newPesticide: PesticideData = {
      id: 0,
      name: '',
      trade_name: '',
      registration_number: '',
      manufacturer_id: undefined,
      supplier_id: undefined,
      pesticide_type: 'herbicide',
      hazard_class: 'III',
      physical_form: 'liquid',
      active_substances: [],
      registration_status: 'active',
      is_active: true
    };
    
    setPesticide(newPesticide);
    setOriginalPesticide(newPesticide);
    console.log('🆕 Инициализирован новый СЗР');
  }, []);

  // Обновление пестицида
  const updatePesticide = useCallback((updates: Partial<PesticideData>) => {
    setPesticide(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  // Сброс изменений
  const resetPesticide = useCallback(() => {
    if (originalPesticide) {
      setPesticide({ ...originalPesticide });
      console.log('🔄 Сброшены изменения СЗР');
    }
  }, [originalPesticide]);

  return {
    // Данные
    pesticide,
    originalPesticide,
    
    // Состояние
    isLoading: entityLoader.isLoading || isLoadingPesticide,
    isInitialized: isInitialized,
    error: error,
    hasChanges: currentHasChanges,
    
    // Методы
    loadPesticide,
    updatePesticide,
    resetPesticide,
    setPesticide,
    setOriginalPesticide,
    initializeNewPesticide,
    clearError: () => {
      entityLoader.clearError();
    }
  };
};