// src/pages/Assets/Equipment/hooks/useEquipmentData.ts

import { useState, useEffect, useCallback } from 'react';
import { useEntityLoader } from '../../../../hooks/useEntityLoader';
import { useSyncData } from '../../../../hooks/useSyncData';
import { equipmentSyncConfig } from '../config/syncConfig';
import { EquipmentData } from './useEquipmentEdit';
import { hasChanges } from '../../../../utils/validation.utils';

export interface UseEquipmentDataReturn {
  // Данные
  equipment: EquipmentData | null;
  originalEquipment: EquipmentData | null;
  
  // Состояние
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Методы
  loadEquipment: (id: number) => Promise<void>;
  updateEquipment: (updates: Partial<EquipmentData>) => void;
  resetEquipment: () => void;
  setEquipment: (equipment: EquipmentData | null) => void;
  setOriginalEquipment: (equipment: EquipmentData | null) => void;
  initializeNewEquipment: () => void;
  clearError: () => void;
}

/**
 * Хук для управления данными техники
 */
export const useEquipmentData = (
  equipmentId?: number,
  errorHandler?: (error: any) => void
): UseEquipmentDataReturn => {
  
  // Состояние техники
  const [equipment, setEquipment] = useState<EquipmentData | null>(null);
  const [originalEquipment, setOriginalEquipment] = useState<EquipmentData | null>(null);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Прямое использование синхронизации
  const {
    isInitialized,
    loadTableData,
    sync,
    error: syncError
  } = useSyncData(equipmentSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Универсальный загрузчик сущностей (для совместимости)
const entityLoader = useEntityLoader<EquipmentData>(
  {
    syncConfig: equipmentSyncConfig,
    entityTableName: 'assets_equipment',  // Было: 'references_equipment'
    relatedTableNames: []
  },
  useSyncData,
  errorHandler || (() => {})
);


  // Проверка изменений
  const currentHasChanges = hasChanges(equipment, originalEquipment);

  // Общая ошибка
  const error = syncError || entityLoader.error;

  // Сброс при смене ID
  useEffect(() => {
    setLoadAttempts(0);
    setEquipment(null);
    setOriginalEquipment(null);
  }, [equipmentId]);

  // Загрузка техники по ID
  const loadEquipment = useCallback(async (id: number) => {
    if (isLoadingEquipment) {
      console.log('⏳ Загрузка техники уже выполняется, пропускаем...');
      return;
    }

    console.log(`🔍 Загружаем технику ID: ${id}`);
    setIsLoadingEquipment(true);
    
    try {
      // Сначала получаем все данные из таблицы
      const allEquipment = await loadTableData('assets_equipment');
      console.log(`📊 Всего техники в таблице: ${allEquipment.length}`);
      
      if (allEquipment.length === 0) {
        console.log('📥 Таблица пустая, выполняем синхронизацию...');
        await sync();
        // Повторно загружаем после синхронизации
        const equipmentAfterSync = await loadTableData('assets_equipment');
        console.log(`📊 После синхронизации техники: ${equipmentAfterSync.length}`);
      }
      
      // Ищем конкретную технику
      const foundEquipment = allEquipment.find((item: any) => item.id === id);
      
      if (foundEquipment) {
        setEquipment(foundEquipment);
        setOriginalEquipment(foundEquipment);
        console.log(`✅ Загружена техника: ${foundEquipment.name}`);
      } else {
        console.log(`❌ Техника с ID ${id} не найдена среди ${allEquipment.length} записей`);
        // Показываем список доступных ID для отладки
        const availableIds = allEquipment.map((item: any) => item.id).slice(0, 10);
        console.log(`📋 Доступные ID техники: ${availableIds.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки техники:', error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      setIsLoadingEquipment(false);
    }
  }, [isLoadingEquipment, loadTableData, sync, errorHandler]);

  // Автоинициализация новой техники
  useEffect(() => {
    if (!equipmentId && !equipment && isInitialized) {
      initializeNewEquipment();
    }
  }, [equipmentId, isInitialized]);

  // Загрузка при инициализации
  useEffect(() => {
    if (equipmentId && isInitialized && !equipment && !isLoadingEquipment && loadAttempts < MAX_LOAD_ATTEMPTS) {
      setLoadAttempts(prev => prev + 1);
      loadEquipment(equipmentId);
    }
  }, [equipmentId, isInitialized, equipment, isLoadingEquipment, loadAttempts]);

  // Инициализация новой техники
  const initializeNewEquipment = useCallback(() => {
    const newEquipment: EquipmentData = {
      id: 0,
      name: '',
      category: '',
      is_active: true
    };
    
    setEquipment(newEquipment);
    setOriginalEquipment(newEquipment);
    console.log('🆕 Инициализирована новая техника');
  }, []);

  // Обновление техники
  const updateEquipment = useCallback((updates: Partial<EquipmentData>) => {
    setEquipment(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  // Сброс изменений
  const resetEquipment = useCallback(() => {
    if (originalEquipment) {
      setEquipment({ ...originalEquipment });
      console.log('🔄 Сброшены изменения техники');
    }
  }, [originalEquipment]);

  return {
    // Данные
    equipment,
    originalEquipment,
    
    // Состояние
    isLoading: entityLoader.isLoading || isLoadingEquipment,
    isInitialized: isInitialized,
    error: error,
    hasChanges: currentHasChanges,
    
    // Методы
    loadEquipment,
    updateEquipment,
    resetEquipment,
    setEquipment,
    setOriginalEquipment,
    initializeNewEquipment,
    clearError: () => {
      entityLoader.clearError();
      // Дополнительная очистка если нужно
    }
  };
}; 
