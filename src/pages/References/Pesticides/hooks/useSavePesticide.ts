// src/pages/References/Pesticides/hooks/useSavePesticide.ts

import { useState } from 'react';
import { PesticideData } from './usePesticideEdit';
import { UniversalSaveService } from '../../../../services/UniversalSaveService';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
export interface UseSavePesticideReturn {
  isSaving: boolean;
  saveChanges: (pesticide: PesticideData) => Promise<boolean>;
}

export const useSavePesticide = (): UseSavePesticideReturn => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveService = new UniversalSaveService({
    apiBaseUrl: DEFAULT_API_BASE_URL,
    validateSchema: true,
    validateDependencies: true,
    stopOnError: true
  });

  const saveChanges = async (pesticide: PesticideData): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      console.log('💾 useSavePesticide: Сохраняем СЗР...');
      
      // Используем тот же подход что и в других модулях
      // saveEntityWithSteps правильно обрабатывает ошибки валидации
      return await saveService.saveEntityWithSteps(
        pesticide,
        [], // Нет связанных сущностей для сохранения (контрагенты уже существуют)
        'reference_pesticides',
        '', // Нет связанной таблицы
        [] // Нет зависимостей для создания
      );
      
    } catch (error) {
      console.error('💥 Ошибка в useSavePesticide:', error);
      
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