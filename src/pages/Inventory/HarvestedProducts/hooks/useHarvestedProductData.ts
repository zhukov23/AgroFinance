// src/pages/Inventory/HarvestedProducts/hooks/useHarvestedProductData.ts

import { useState, useEffect, useCallback } from 'react';
import { useEntityLoader } from '../../../../hooks/useEntityLoader';
import { useSyncData } from '../../../../hooks/useSyncData';
import { harvestedProductsSyncConfig } from '../config/syncConfig';
import { HarvestedProductData } from './useHarvestedProductEdit';
import { hasChanges } from '../../../../utils/validation.utils';

export interface UseHarvestedProductDataReturn {
  // Данные
  harvestedProduct: HarvestedProductData | null;
  originalHarvestedProduct: HarvestedProductData | null;
  
  // Состояние
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Методы
  loadHarvestedProduct: (id: number) => Promise<void>;
  updateHarvestedProduct: (updates: Partial<HarvestedProductData>) => void;
  resetHarvestedProduct: () => void;
  setHarvestedProduct: (product: HarvestedProductData | null) => void;
  setOriginalHarvestedProduct: (product: HarvestedProductData | null) => void;
  initializeNewHarvestedProduct: () => void;
  clearError: () => void;
}

/**
 * Хук для управления данными урожайной продукции
 */
export const useHarvestedProductData = (
  harvestedProductId?: number,
  errorHandler?: (error: any) => void
): UseHarvestedProductDataReturn => {
  
  // Состояние урожайной продукции
  const [harvestedProduct, setHarvestedProduct] = useState<HarvestedProductData | null>(null);
  const [originalHarvestedProduct, setOriginalHarvestedProduct] = useState<HarvestedProductData | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  // Прямое использование синхронизации
  const {
    isInitialized,
    loadTableData,
    sync,
    error: syncError
  } = useSyncData(harvestedProductsSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Универсальный загрузчик сущностей (для совместимости)
  const entityLoader = useEntityLoader<HarvestedProductData>(
    {
      syncConfig: harvestedProductsSyncConfig,
      entityTableName: 'inventory_harvested_products',
      relatedTableNames: ['reference_storage_locations', 'reference_planting_materials']
    },
    useSyncData,
    errorHandler || (() => {})
  );

  // Проверка изменений
  const currentHasChanges = hasChanges(harvestedProduct, originalHarvestedProduct);

  // Общая ошибка
  const error = syncError || entityLoader.error;

  // Сброс при смене ID
  useEffect(() => {
    setLoadAttempts(0);
    setHarvestedProduct(null);
    setOriginalHarvestedProduct(null);
  }, [harvestedProductId]);

  // Загрузка урожайной продукции по ID
  const loadHarvestedProduct = useCallback(async (id: number) => {
    if (isLoadingProduct) {
      console.log('⏳ Загрузка урожайной продукции уже выполняется, пропускаем...');
      return;
    }

    console.log(`🔍 Загружаем урожайную продукцию ID: ${id}`);
    setIsLoadingProduct(true);
    
    try {
      // Сначала получаем все данные из таблицы
      const allProducts = await loadTableData('inventory_harvested_products');
      console.log(`📊 Всего урожайной продукции в таблице: ${allProducts.length}`);
      
      if (allProducts.length === 0) {
        console.log('📥 Таблица пустая, выполняем синхронизацию...');
        await sync();
        // Повторно загружаем после синхронизации
        const productsAfterSync = await loadTableData('inventory_harvested_products');
        console.log(`📊 После синхронизации продукции: ${productsAfterSync.length}`);
      }
      
      // Ищем конкретную продукцию
      const foundProduct = allProducts.find((product: any) => product.id === id);
      
      if (foundProduct) {
        setHarvestedProduct(foundProduct);
        setOriginalHarvestedProduct(foundProduct);
        console.log(`✅ Загружена урожайная продукция: ${foundProduct.product_name}`);
      } else {
        console.log(`❌ Урожайная продукция с ID ${id} не найдена среди ${allProducts.length} записей`);
        // Показываем список доступных ID для отладки
        const availableIds = allProducts.map((product: any) => product.id).slice(0, 10);
        console.log(`📋 Доступные ID продукции: ${availableIds.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки урожайной продукции:', error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      setIsLoadingProduct(false);
    }
  }, [isLoadingProduct, loadTableData, sync, errorHandler]);

  // Автоинициализация новой продукции
  useEffect(() => {
    if (!harvestedProductId && !harvestedProduct && isInitialized) {
      initializeNewHarvestedProduct();
    }
  }, [harvestedProductId, isInitialized]);

  // Загрузка при инициализации
  useEffect(() => {
    if (harvestedProductId && isInitialized && !harvestedProduct && !isLoadingProduct && loadAttempts < MAX_LOAD_ATTEMPTS) {
      setLoadAttempts(prev => prev + 1);
      loadHarvestedProduct(harvestedProductId);
    }
  }, [harvestedProductId, isInitialized, harvestedProduct, isLoadingProduct, loadAttempts]);

  // Инициализация новой продукции
  const initializeNewHarvestedProduct = useCallback(() => {
    const newProduct: HarvestedProductData = {
      id: 0,
      product_name: '',
      harvest_date: new Date().toISOString().split('T')[0],
      quantity: 0,
      is_active: true
    };
    
    setHarvestedProduct(newProduct);
    setOriginalHarvestedProduct(newProduct);
    console.log('🆕 Инициализирована новая урожайная продукция');
  }, []);

  // Обновление продукции
  const updateHarvestedProduct = useCallback((updates: Partial<HarvestedProductData>) => {
    setHarvestedProduct(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  // Сброс изменений
  const resetHarvestedProduct = useCallback(() => {
    if (originalHarvestedProduct) {
      setHarvestedProduct({ ...originalHarvestedProduct });
      console.log('🔄 Сброшены изменения урожайной продукции');
    }
  }, [originalHarvestedProduct]);

  return {
    // Данные
    harvestedProduct,
    originalHarvestedProduct,
    
    // Состояние
    isLoading: entityLoader.isLoading || isLoadingProduct,
    isInitialized: isInitialized,
    error: error,
    hasChanges: currentHasChanges,
    
    // Методы
    loadHarvestedProduct,
    updateHarvestedProduct,
    resetHarvestedProduct,
    setHarvestedProduct,
    setOriginalHarvestedProduct,
    initializeNewHarvestedProduct,
    clearError: () => {
      entityLoader.clearError();
      // Дополнительная очистка если нужно
    }
  };
}; 
