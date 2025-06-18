// src/pages/References/StorageLocations/hooks/useSaveStorageLocation.ts

import { useState } from 'react';
import { StorageLocationData } from './useStorageLocationEdit';
import { UniversalSaveService } from '../../../../services/UniversalSaveService';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
export interface UseSaveStorageLocationReturn {
  isSaving: boolean;
  saveChanges: (storageLocation: StorageLocationData) => Promise<boolean>;
}

export const useSaveStorageLocation = (): UseSaveStorageLocationReturn => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveService = new UniversalSaveService({
    apiBaseUrl: DEFAULT_API_BASE_URL,
    validateSchema: true,
    validateDependencies: true,
    stopOnError: true
  });

  const saveChanges = async (storageLocation: StorageLocationData): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      console.log('💾 useSaveStorageLocation: Сохраняем место хранения...');
      
      // Используем тот же подход что и в посевном материале
      // saveEntityWithSteps правильно обрабатывает ошибки валидации
      return await saveService.saveEntityWithSteps(
        storageLocation,
        [], // Нет связанных сущностей
        'reference_storage_locations',
        '', // Нет связанной таблицы
        [] // Нет зависимостей
      );
      
    } catch (error) {
      console.error('💥 Ошибка в useSaveStorageLocation:', error);
      
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
