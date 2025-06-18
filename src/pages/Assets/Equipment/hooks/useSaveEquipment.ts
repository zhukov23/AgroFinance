// src/pages/Assets/Equipment/hooks/useSaveEquipment.ts

import { useState } from 'react';
import { EquipmentData } from './useEquipmentEdit';
import { UniversalSaveService } from '../../../../services/UniversalSaveService';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

export interface UseSaveEquipmentReturn {
  isSaving: boolean;
  saveChanges: (equipment: EquipmentData) => Promise<boolean>;
}

export const useSaveEquipment = (): UseSaveEquipmentReturn => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveService = new UniversalSaveService({
    apiBaseUrl: DEFAULT_API_BASE_URL,
    validateSchema: true,
    validateDependencies: true,
    stopOnError: true
  });

  const saveChanges = async (equipment: EquipmentData): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      console.log('💾 useSaveEquipment: Сохраняем технику...');
      
      // Используем тот же подход что и в других модулях
      // saveEntityWithSteps правильно обрабатывает ошибки валидации
      return await saveService.saveEntityWithSteps(
        equipment,
        [], // Нет связанных сущностей
        'assets_equipment',
        '', // Нет связанной таблицы
        [] // Нет зависимостей
      );
      
    } catch (error) {
      console.error('💥 Ошибка в useSaveEquipment:', error);
      
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
