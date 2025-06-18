// src/pages/Inventory/HarvestedProducts/hooks/useSaveHarvestedProduct.ts

import { useState } from 'react';
import { HarvestedProductData } from './useHarvestedProductEdit';
import { UniversalSaveService } from '../../../../services/UniversalSaveService';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

export interface UseSaveHarvestedProductReturn {
  isSaving: boolean;
  saveChanges: (harvestedProduct: HarvestedProductData) => Promise<boolean>;
}

export const useSaveHarvestedProduct = (): UseSaveHarvestedProductReturn => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveService = new UniversalSaveService({
    apiBaseUrl: DEFAULT_API_BASE_URL,
    validateSchema: true,
    validateDependencies: true,
    stopOnError: true
  });

  const saveChanges = async (harvestedProduct: HarvestedProductData): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      console.log('💾 useSaveHarvestedProduct: Сохраняем урожайную продукцию...');
      
      // Используем тот же подход что и в других модулях
      // saveEntityWithSteps правильно обрабатывает ошибки валидации
      return await saveService.saveEntityWithSteps(
        harvestedProduct,
        [], // Нет связанных сущностей
        'inventory_harvested_products',
        '', // Нет связанной таблицы
        [] // Нет зависимостей
      );
      
    } catch (error) {
      console.error('💥 Ошибка в useSaveHarvestedProduct:', error);
      
      // Пробрасываем ошибку для обработки в вызывающем коде
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveChanges
  };
}; 
