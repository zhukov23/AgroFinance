// src/pages/References/Counterparties/hooks/useTestDataGeneration.ts

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  TestDataGeneratorService, 
  BankInfo,
  createTestDataGenerator 
} from '../services/testDataGenerator';
import { CounterpartyData, BankAccountData } from './useCounterpartyEdit';

export interface UseTestDataGenerationReturn {
  // Состояние
  isGenerating: boolean;
  
  // Методы
  generateTestData: () => Promise<void>;
  clearError: () => void;
}

export interface TestDataGenerationConfig {
  apiBaseUrl: string;
  onDataGenerated: (counterparty: Partial<CounterpartyData>, bankAccounts: Omit<BankAccountData, 'id' | 'organization_id'>[]) => void;
  onError: (error: any) => void;
  onStatusChange?: (status: string) => void;
}

/**
 * Хук для генерации тестовых данных контрагентов
 */
export const useTestDataGeneration = (
  config: TestDataGenerationConfig,
  dependencies: {
    isInitialized: boolean;
    syncLoading: boolean;
    banksData: BankInfo[];
    performSync: () => Promise<void>;
    loadTableData: (tableName: string) => Promise<any[]>;
  }
): UseTestDataGenerationReturn => {
  
  const [isGenerating, setIsGenerating] = useState(false);
  const testDataGeneratorRef = useRef<TestDataGeneratorService | null>(null);

  // Инициализируем генератор тестовых данных
  useEffect(() => {
    testDataGeneratorRef.current = createTestDataGenerator({
      apiBaseUrl: config.apiBaseUrl,
      onStatusChange: config.onStatusChange,
      onError: config.onError
    });
  }, [config]);

  // Проверка готовности системы
  const checkSystemReady = useCallback(() => {
    if (!dependencies.isInitialized) {
      throw new Error('Система не инициализирована. Подождите...');
    }
    
    if (dependencies.syncLoading) {
      throw new Error('Данные еще загружаются, подождите...');
    }

    if (!testDataGeneratorRef.current) {
      throw new Error('Сервис генерации тестовых данных не инициализирован');
    }
  }, [dependencies]);

  // Получение актуальных данных банков
  const getAvailableBanks = useCallback(async (): Promise<BankInfo[]> => {
    let availableBanks: BankInfo[] = dependencies.banksData;
    
    if (availableBanks.length === 0) {
      console.log('❌ Банки не загружены, выполняем синхронизацию...');
      await dependencies.performSync();
      
      console.log('🔄 Загружаем свежие данные банков после синхронизации...');
      availableBanks = await dependencies.loadTableData('reference_banks');
      console.log('📊 Свежие данные банков:', availableBanks.length);
      
      if (availableBanks.length === 0) {
        throw new Error('Данные банков не загружены. Проверьте соединение с сервером.');
      }
    }
    
    return availableBanks;
  }, [dependencies]);

  // Основная функция генерации
  const generateTestData = useCallback(async () => {
    console.log('🎯 НАЧИНАЕМ generateTestData через сервис');
    console.log('📊 banksData на старте:', dependencies.banksData.length);
    console.log('📊 Состояние загрузки:', { 
      isInitialized: dependencies.isInitialized, 
      syncLoading: dependencies.syncLoading 
    });
    
    setIsGenerating(true);
    
    try {
      // Проверяем готовность системы
      checkSystemReady();
      
      // Получаем актуальные данные банков
      const availableBanks = await getAvailableBanks();
      
      // Генерируем данные
      console.log('🎯 Генерируем данные через TestDataGeneratorService...');
      const generatedData = await testDataGeneratorRef.current!.generateCounterpartyData(availableBanks);
      
      // Передаем сгенерированные данные через callback
      console.log('✅ Применяем сгенерированные данные...');
      config.onDataGenerated(generatedData.counterparty, generatedData.bankAccounts);
      
      console.log('✅ Форма успешно заполнена тестовыми данными');
      
    } catch (err) {
      console.error('❌ Ошибка генерации тестовых данных:', err);
      config.onError(err);
    } finally {
      setIsGenerating(false);
    }
  }, [config, dependencies, checkSystemReady, getAvailableBanks]);

  const clearError = useCallback(() => {
    // Очистка ошибок через переданный обработчик
    // (логика очистки находится в родительском компоненте)
  }, []);

  return {
    // Состояние
    isGenerating,
    
    // Методы
    generateTestData,
    clearError
  };
};

/**
 * Хелпер для создания конфигурации генерации тестовых данных
 */
export const createTestDataConfig = (
  apiBaseUrl: string,
  onDataGenerated: (counterparty: Partial<CounterpartyData>, bankAccounts: Omit<BankAccountData, 'id' | 'organization_id'>[]) => void,
  onError: (error: any) => void,
  onStatusChange?: (status: string) => void
): TestDataGenerationConfig => ({
  apiBaseUrl,
  onDataGenerated,
  onError,
  onStatusChange
});

/**
 * Типы для использования в других компонентах
 */
export type TestDataDependencies = {
  isInitialized: boolean;
  syncLoading: boolean;
  banksData: BankInfo[];
  performSync: () => Promise<any>; // ← Изменить с Promise<void>
  loadTableData: (tableName: string) => Promise<any[]>;
};