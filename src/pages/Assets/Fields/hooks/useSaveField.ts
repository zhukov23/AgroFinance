// src/pages/Assets/Fields/hooks/useSaveField.ts

import { useState } from 'react';
import { FieldData } from './useFieldEdit';
import { UniversalSaveService } from '../../../../services/UniversalSaveService';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

export interface UseSaveFieldReturn {
  isSaving: boolean;
  saveChanges: (field: FieldData) => Promise<boolean>;
}

export const useSaveField = (): UseSaveFieldReturn => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveService = new UniversalSaveService({
    apiBaseUrl: DEFAULT_API_BASE_URL,
    validateSchema: true,
    validateDependencies: true,
    stopOnError: true
  });

  const saveChanges = async (field: FieldData): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      console.log('💾 useSaveField: Сохраняем поле...');
      
      // Используем тот же подход что и в других модулях
      // saveEntityWithSteps правильно обрабатывает ошибки валидации
      return await saveService.saveEntityWithSteps(
        field,
        [], // Нет связанных сущностей
        'assets_fields',
        '', // Нет связанной таблицы
        [] // Нет зависимостей
      );
      
    } catch (error) {
      console.error('💥 Ошибка в useSaveField:', error);
      
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
