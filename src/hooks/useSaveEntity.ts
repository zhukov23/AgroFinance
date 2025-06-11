// src/hooks/useSaveEntity.ts

import { useState, useCallback } from 'react';
import { BaseEntity, RelatedEntity } from '../types/entity.types';
import { UniversalSaveService, SaveServiceOptions } from '../services/UniversalSaveService';

export interface UseSaveEntityReturn<T extends BaseEntity, R extends RelatedEntity = RelatedEntity> {
  isSaving: boolean;
  saveChanges: (
    entity: T, 
    relatedEntities: R[],
    mainTableName: string,
    relatedTableName?: string
  ) => Promise<boolean>;
}

export const useSaveEntity = <T extends BaseEntity, R extends RelatedEntity = RelatedEntity>(
  options: SaveServiceOptions = {}
): UseSaveEntityReturn<T, R> => {
  
  const [isSaving, setIsSaving] = useState(false);
  const saveService = new UniversalSaveService(options);

  const saveChanges = useCallback(async (
    entity: T,
    relatedEntities: R[] = [],
    mainTableName: string,
    relatedTableName?: string
  ): Promise<boolean> => {
    
    if (!entity) {
      console.error('❌ Нет данных сущности для сохранения');
      return false;
    }
    
    setIsSaving(true);
    
    try {
      console.log('💾 useSaveEntity: Сохранение сущности...');
      console.log('📊 Таблица:', mainTableName);
      console.log('📊 Связанных записей:', relatedEntities.length);
      
      let success: boolean;
      
      if (relatedEntities.length > 0 && relatedTableName) {
        // Сохраняем с связанными записями
        success = await saveService.saveEntityWithRelated(
          entity,
          relatedEntities,
          mainTableName,
          relatedTableName,
          options
        );
      } else {
        // Сохраняем только основную сущность
        success = await saveService.saveEntity(entity, mainTableName, options);
      }
      
      if (success) {
        console.log('✅ useSaveEntity: Сущность успешно сохранена');
      }
      
      return success;
      
    } catch (err) {
      // Пробрасываем ошибку дальше для обработки в useValidationErrorHandler
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [saveService, options]);

  return {
    isSaving,
    saveChanges
  };
};