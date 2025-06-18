// src/pages/References/PlantingMaterials/hooks/useSavePlantingMaterial.ts

import { useState } from 'react';
import { PlantingMaterialData } from './usePlantingMaterialEdit';
import { UniversalSaveService } from '../../../../services/UniversalSaveService';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';

export interface UseSavePlantingMaterialReturn {
  isSaving: boolean;
  saveChanges: (plantingMaterial: PlantingMaterialData) => Promise<boolean>;
}

export const useSavePlantingMaterial = (): UseSavePlantingMaterialReturn => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveService = new UniversalSaveService({
    apiBaseUrl: DEFAULT_API_BASE_URL,
    validateSchema: true,
    validateDependencies: true,
    stopOnError: true
  });

  const saveChanges = async (plantingMaterial: PlantingMaterialData): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      console.log('💾 useSavePlantingMaterial: Сохраняем посевной материал...');
      
      // Используем тот же подход что и в контрагентах
      // saveEntityWithSteps правильно обрабатывает ошибки валидации
      return await saveService.saveEntityWithSteps(
        plantingMaterial,
        [], // Нет связанных сущностей
        'reference_planting_materials',
        '', // Нет связанной таблицы
        [] // Нет зависимостей
      );
      
    } catch (error) {
      console.error('💥 Ошибка в useSavePlantingMaterial:', error);
      
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