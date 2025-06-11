// src/hooks/useEntityLoader.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { BaseEntity } from '../types/entity.types';

export interface EntityLoaderConfig {
  syncConfig: any; // конфигурация синхронизации
  entityTableName: string; // имя таблицы основной сущности
  relatedTableNames?: string[]; // имена связанных таблиц
  autoInitialize?: boolean;
  autoSync?: boolean;
}

export interface UseEntityLoaderReturn<T extends BaseEntity> {
  // Состояние загрузки
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Данные
  tableData: any;
  
  // Методы
  loadEntity: (id: number) => Promise<T | null>;
  loadTableData: (tableName: string) => Promise<any[]>;
  performSync: () => Promise<void>;
  clearError: () => void;
}

/**
 * Универсальный хук для загрузки сущностей с синхронизацией
 */
export const useEntityLoader = <T extends BaseEntity>(
  config: EntityLoaderConfig,
  useSyncDataHook: any, // хук useSyncData
  errorHandler: (error: any) => void
): UseEntityLoaderReturn<T> => {
  
  const dataLoadedRef = useRef(false);
  const isLoadingDataRef = useRef(false);

  // Подключаем синхронизацию данных
  const {
    isInitialized,
    isLoading: syncLoading,
    error: syncError,
    loadTableData,
    tableData,
    sync: performSync
  } = useSyncDataHook(config.syncConfig, { 
    autoInitialize: config.autoInitialize ?? true, 
    autoSync: config.autoSync ?? false 
  });

  // Состояние загрузки
  const [localError, setLocalError] = useState<string | null>(null);
  
  const isLoading = syncLoading || isLoadingDataRef.current;
  const error = localError || syncError;

  const clearError = useCallback(() => {
    setLocalError(null);
  }, []);

  // Универсальная загрузка сущности по ID
  const loadEntity = useCallback(async (id: number): Promise<T | null> => {
    if (isLoadingDataRef.current) {
      console.log('⏳ Загрузка уже выполняется, пропускаем...');
      return null;
    }

    try {
      isLoadingDataRef.current = true;
      clearError();
      
      console.log(`🔍 Загружаем сущность ID: ${id} из таблицы: ${config.entityTableName}`);
      
      // Получаем данные основной таблицы
      const entityData = tableData?.[config.entityTableName] || [];
      
      // Если данных нет, выполняем синхронизацию
      if (entityData.length === 0) {
        console.log('📥 Данные отсутствуют, выполняем синхронизацию...');
        await performSync();
        return null; // После синхронизации вызовут повторно
      }
      
      // Ищем сущность в загруженных данных
      const foundEntity = entityData.find((entity: T) => entity.id === id);
      
      if (!foundEntity) {
        throw new Error(`Сущность с ID ${id} не найдена в таблице ${config.entityTableName}`);
      }
      
      console.log(`✅ Загружена сущность из ${config.entityTableName}:`, foundEntity);
      return foundEntity;
      
    } catch (err) {
      const errorMessage = `Ошибка загрузки сущности: ${err}`;
      setLocalError(errorMessage);
      errorHandler(errorMessage);
      return null;
    } finally {
      isLoadingDataRef.current = false;
    }
  }, [tableData, config.entityTableName, performSync, clearError, errorHandler]);

  return {
    // Состояние
    isLoading,
    isInitialized,
    error,
    
    // Данные
    tableData,
    
    // Методы
    loadEntity,
    loadTableData,
    performSync,
    clearError
  };
};

/**
 * Хелпер для получения связанных записей
 */
export const getRelatedEntities = <R extends BaseEntity>(
  tableData: any,
  tableName: string,
  parentId: number,
  parentIdField: string = 'organization_id'
): R[] => {
  const relatedData = tableData?.[tableName] || [];
  return relatedData.filter((item: R) => 
    (item as any)[parentIdField] === parentId && !(item as any).closing_date
  );
};

/**
 * Хелпер для инициализации новой сущности
 */
export const createNewEntity = <T extends BaseEntity>(defaultValues: Partial<T>): T => {
  return {
    id: 0, // Временный ID для новой сущности
    is_active: true,
    ...defaultValues
  } as T;
};