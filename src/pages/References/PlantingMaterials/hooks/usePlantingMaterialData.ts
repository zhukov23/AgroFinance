// src/pages/References/PlantingMaterials/hooks/usePlantingMaterialData.ts

import { useState, useEffect, useCallback } from 'react';
import { useEntityLoader } from '../../../../hooks/useEntityLoader';
import { useSyncData } from '../../../../hooks/useSyncData';
import { plantingMaterialsSyncConfig } from '../config/syncConfig';
import { PlantingMaterialData } from './usePlantingMaterialEdit';
import { hasChanges } from '../../../../utils/validation.utils';

export interface UsePlantingMaterialDataReturn {
  // Данные
  plantingMaterial: PlantingMaterialData | null;
  originalPlantingMaterial: PlantingMaterialData | null;
  
  // Состояние
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Методы
  loadPlantingMaterial: (id: number) => Promise<void>;
  updatePlantingMaterial: (updates: Partial<PlantingMaterialData>) => void;
  resetPlantingMaterial: () => void;
  setPlantingMaterial: (plantingMaterial: PlantingMaterialData | null) => void;
  setOriginalPlantingMaterial: (plantingMaterial: PlantingMaterialData | null) => void;
  initializeNewPlantingMaterial: () => void;
  clearError: () => void;
}

/**
 * Хук для управления данными посевного материала
 */
export const usePlantingMaterialData = (
  plantingMaterialId?: number,
  errorHandler?: (error: any) => void
): UsePlantingMaterialDataReturn => {
  
  // Состояние посевного материала
  const [plantingMaterial, setPlantingMaterial] = useState<PlantingMaterialData | null>(null);
  const [originalPlantingMaterial, setOriginalPlantingMaterial] = useState<PlantingMaterialData | null>(null);
  const [isLoadingMaterial, setIsLoadingMaterial] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Прямое использование синхронизации
  const {
    isInitialized,
    loadTableData,
    sync,
    error: syncError
  } = useSyncData(plantingMaterialsSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Универсальный загрузчик сущностей (для совместимости)
  const entityLoader = useEntityLoader<PlantingMaterialData>(
    {
      syncConfig: plantingMaterialsSyncConfig,
      entityTableName: 'reference_planting_materials',
      relatedTableNames: ['reference_counterparties'] // Связь с производителями
    },
    useSyncData,
    errorHandler || (() => {})
  );

  // Проверка изменений
  const currentHasChanges = hasChanges(plantingMaterial, originalPlantingMaterial);

  // Общая ошибка
  const error = syncError || entityLoader.error;

  // Сброс при смене ID
  useEffect(() => {
    setLoadAttempts(0);
    setPlantingMaterial(null);
    setOriginalPlantingMaterial(null);
  }, [plantingMaterialId]);

  // Загрузка посевного материала по ID
  const loadPlantingMaterial = useCallback(async (id: number) => {
    if (isLoadingMaterial) {
      console.log('⏳ Загрузка посевного материала уже выполняется, пропускаем...');
      return;
    }

    console.log(`🔍 Загружаем посевной материал ID: ${id}`);
    setIsLoadingMaterial(true);
    
    try {
      // Сначала получаем все данные из таблицы
      const allMaterials = await loadTableData('reference_planting_materials');
      console.log(`📊 Всего посевного материала в таблице: ${allMaterials.length}`);
      
      if (allMaterials.length === 0) {
        console.log('📥 Таблица пустая, выполняем синхронизацию...');
        await sync();
        // Повторно загружаем после синхронизации
        const materialsAfterSync = await loadTableData('reference_planting_materials');
        console.log(`📊 После синхронизации материалов: ${materialsAfterSync.length}`);
      }
      
      // Ищем конкретный материал
      const foundMaterial = allMaterials.find((material: any) => material.id === id);
      
      if (foundMaterial) {
        setPlantingMaterial(foundMaterial);
        setOriginalPlantingMaterial(foundMaterial);
        console.log(`✅ Загружен посевной материал: ${foundMaterial.name}`);
      } else {
        console.log(`❌ Посевной материал с ID ${id} не найден среди ${allMaterials.length} записей`);
        // Показываем список доступных ID для отладки
        const availableIds = allMaterials.map((material: any) => material.id).slice(0, 10);
        console.log(`📋 Доступные ID материалов: ${availableIds.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки посевного материала:', error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      setIsLoadingMaterial(false);
    }
  }, [isLoadingMaterial, loadTableData, sync, errorHandler]);

  // Автоинициализация нового материала
  useEffect(() => {
    if (!plantingMaterialId && !plantingMaterial && isInitialized) {
      initializeNewPlantingMaterial();
    }
  }, [plantingMaterialId, isInitialized]);

  // Загрузка при инициализации
  useEffect(() => {
    if (plantingMaterialId && isInitialized && !plantingMaterial && !isLoadingMaterial && loadAttempts < MAX_LOAD_ATTEMPTS) {
      setLoadAttempts(prev => prev + 1);
      loadPlantingMaterial(plantingMaterialId);
    }
  }, [plantingMaterialId, isInitialized, plantingMaterial, isLoadingMaterial, loadAttempts]);

  // Инициализация нового материала
  const initializeNewPlantingMaterial = useCallback(() => {
    const newMaterial: PlantingMaterialData = {
      id: 0,
      name: '',
      material_type: '',
      crop_category: '',
      is_active: true
    };
    
    setPlantingMaterial(newMaterial);
    setOriginalPlantingMaterial(newMaterial);
    console.log('🆕 Инициализирован новый посевной материал');
  }, []);

  // Обновление материала
  const updatePlantingMaterial = useCallback((updates: Partial<PlantingMaterialData>) => {
    setPlantingMaterial(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  // Сброс изменений
  const resetPlantingMaterial = useCallback(() => {
    if (originalPlantingMaterial) {
      setPlantingMaterial({ ...originalPlantingMaterial });
      console.log('🔄 Сброшены изменения посевного материала');
    }
  }, [originalPlantingMaterial]);

  return {
    // Данные
    plantingMaterial,
    originalPlantingMaterial,
    
    // Состояние
    isLoading: entityLoader.isLoading || isLoadingMaterial,
    isInitialized: isInitialized,
    error: error,
    hasChanges: currentHasChanges,
    
    // Методы
    loadPlantingMaterial,
    updatePlantingMaterial,
    resetPlantingMaterial,
    setPlantingMaterial,
    setOriginalPlantingMaterial,
    initializeNewPlantingMaterial,
    clearError: () => {
      entityLoader.clearError();
      // Дополнительная очистка если нужно
    }
  };
}; 
