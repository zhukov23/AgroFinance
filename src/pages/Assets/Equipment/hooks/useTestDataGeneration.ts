// src/pages/Assets/Equipment/hooks/useTestDataGeneration.ts

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  TestDataGeneratorService, 
  createTestDataGenerator 
} from '../services/testDataGenerator';
import { EquipmentData } from './useEquipmentEdit';

export interface UseTestDataGenerationReturn {
  // Состояние
  isGenerating: boolean;
  
  // Методы
  generateTestData: () => Promise<void>;
  clearError: () => void;
}

export interface TestDataGenerationConfig {
  apiBaseUrl: string;
  onDataGenerated: (equipment: Partial<EquipmentData>) => void;
  onError: (error: any) => void;
  onStatusChange?: (status: string) => void;
}

/**
 * Хук для генерации тестовых данных техники
 */
export const useTestDataGeneration = (
  config: TestDataGenerationConfig,
  dependencies: {
    isInitialized: boolean;
    syncLoading: boolean;
    performSync: () => Promise<void>;
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

  // Основная функция генерации
  const generateTestData = useCallback(async () => {
    console.log('🎯 НАЧИНАЕМ generateTestData для техники через сервис');
    console.log('📊 Состояние загрузки:', { 
      isInitialized: dependencies.isInitialized, 
      syncLoading: dependencies.syncLoading 
    });
    
    setIsGenerating(true);
    
    try {
      // Проверяем готовность системы
      checkSystemReady();
      
      // Генерируем данные техники
      console.log('🎯 Генерируем данные техники через TestDataGeneratorService...');
      const generatedData = await testDataGeneratorRef.current!.generateEquipmentData();
      
      // Передаем сгенерированные данные через callback
      console.log('✅ Применяем сгенерированные данные техники...');
      config.onDataGenerated(generatedData);
      
      console.log('✅ Форма техники успешно заполнена тестовыми данными');
      
    } catch (err) {
      console.error('❌ Ошибка генерации тестовых данных техники:', err);
      config.onError(err);
    } finally {
      setIsGenerating(false);
    }
  }, [config, dependencies, checkSystemReady]);

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
  onDataGenerated: (equipment: Partial<EquipmentData>) => void,
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
  performSync: () => Promise<void>;
}; 
