// src/pages/Assets/Fields/hooks/useFieldData.ts

import { useState, useEffect, useCallback } from 'react';
import { useEntityLoader } from '../../../../hooks/useEntityLoader';
import { useSyncData } from '../../../../hooks/useSyncData';
import { fieldsSyncConfig } from '../config/syncConfig';
import { FieldData } from './useFieldEdit';
import { hasChanges } from '../../../../utils/validation.utils';

export interface UseFieldDataReturn {
  // Данные
  field: FieldData | null;
  originalField: FieldData | null;
  
  // Состояние
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Методы
  loadField: (id: number) => Promise<void>;
  updateField: (updates: Partial<FieldData>) => void;
  resetField: () => void;
  setField: (field: FieldData | null) => void;
  setOriginalField: (field: FieldData | null) => void;
  initializeNewField: () => void;
  clearError: () => void;
}

/**
 * Хук для управления данными полей
 */
export const useFieldData = (
  fieldId?: number,
  errorHandler?: (error: any) => void
): UseFieldDataReturn => {
  
  // Состояние поля
  const [field, setField] = useState<FieldData | null>(null);
  const [originalField, setOriginalField] = useState<FieldData | null>(null);
  const [isLoadingField, setIsLoadingField] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Прямое использование синхронизации
  const {
    isInitialized,
    loadTableData,
    sync,
    error: syncError
  } = useSyncData(fieldsSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Универсальный загрузчик сущностей (для совместимости)
  const entityLoader = useEntityLoader<FieldData>(
    {
      syncConfig: fieldsSyncConfig,
      entityTableName: 'assets_fields',
      relatedTableNames: []
    },
    useSyncData,
    errorHandler || (() => {})
  );

  // Проверка изменений
  const currentHasChanges = hasChanges(field, originalField);

  // Общая ошибка
  const error = syncError || entityLoader.error;

  // Сброс при смене ID
  useEffect(() => {
    setLoadAttempts(0);
    setField(null);
    setOriginalField(null);
  }, [fieldId]);

  // Загрузка поля по ID
  const loadField = useCallback(async (id: number) => {
    if (isLoadingField) {
      console.log('⏳ Загрузка поля уже выполняется, пропускаем...');
      return;
    }

    console.log(`🔍 Загружаем поле ID: ${id}`);
    setIsLoadingField(true);
    
    try {
      // Сначала получаем все данные из таблицы
      const allFields = await loadTableData('assets_fields');
      console.log(`📊 Всего полей в таблице: ${allFields.length}`);
      
      if (allFields.length === 0) {
        console.log('📥 Таблица пустая, выполняем синхронизацию...');
        await sync();
        // Повторно загружаем после синхронизации
        const fieldsAfterSync = await loadTableData('assets_fields');
        console.log(`📊 После синхронизации полей: ${fieldsAfterSync.length}`);
      }
      
      // Ищем конкретное поле
      const foundField = allFields.find((item: any) => item.id === id);
      
      if (foundField) {
        setField(foundField);
        setOriginalField(foundField);
        console.log(`✅ Загружено поле: ${foundField.field_name}`);
      } else {
        console.log(`❌ Поле с ID ${id} не найдено среди ${allFields.length} записей`);
        // Показываем список доступных ID для отладки
        const availableIds = allFields.map((item: any) => item.id).slice(0, 10);
        console.log(`📋 Доступные ID полей: ${availableIds.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки поля:', error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      setIsLoadingField(false);
    }
  }, [isLoadingField, loadTableData, sync, errorHandler]);

  // Автоинициализация нового поля
  useEffect(() => {
    if (!fieldId && !field && isInitialized) {
      initializeNewField();
    }
  }, [fieldId, isInitialized]);

  // Загрузка при инициализации
  useEffect(() => {
    if (fieldId && isInitialized && !field && !isLoadingField && loadAttempts < MAX_LOAD_ATTEMPTS) {
      setLoadAttempts(prev => prev + 1);
      loadField(fieldId);
    }
  }, [fieldId, isInitialized, field, isLoadingField, loadAttempts]);

  // Инициализация нового поля
  const initializeNewField = useCallback(() => {
    const newField: FieldData = {
      id: 0,
      field_name: '',
      area_hectares: 0,
      soil_type: '',
      is_active: true
    };
    
    setField(newField);
    setOriginalField(newField);
    console.log('🆕 Инициализировано новое поле');
  }, []);

  // Обновление поля
  const updateField = useCallback((updates: Partial<FieldData>) => {
    setField(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  // Сброс изменений
  const resetField = useCallback(() => {
    if (originalField) {
      setField({ ...originalField });
      console.log('🔄 Сброшены изменения поля');
    }
  }, [originalField]);

  return {
    // Данные
    field,
    originalField,
    
    // Состояние
    isLoading: entityLoader.isLoading || isLoadingField,
    isInitialized: isInitialized,
    error: error,
    hasChanges: currentHasChanges,
    
    // Методы
    loadField,
    updateField,
    resetField,
    setField,
    setOriginalField,
    initializeNewField,
    clearError: () => {
      entityLoader.clearError();
      // Дополнительная очистка если нужно
    }
  };
}; 
