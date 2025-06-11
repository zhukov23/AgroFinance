// src/hooks/useRelatedEntitiesManager.ts

import { useState, useCallback } from 'react';
import { BaseEntity, RelatedEntity } from '../types/entity.types';
import { hasArrayChanges } from '../utils/validation.utils';

export interface RelatedEntitiesConfig<R extends RelatedEntity> {
  parentIdField?: string; // поле связи с родителем (по умолчанию 'organization_id')
  defaultValues?: Partial<R>; // значения по умолчанию для новых записей
  generateTempId?: () => number; // функция генерации временных ID
}

export interface UseRelatedEntitiesManagerReturn<R extends RelatedEntity> {
  // Данные
  entities: R[];
  originalEntities: R[];
  
  // Состояние
  hasChanges: boolean;
  
  // Методы управления
  addEntity: (entityData: Omit<R, 'id' | 'parent_id'>) => void;
  updateEntity: (id: number, updates: Partial<R>) => void;
  removeEntity: (id: number) => void;
  resetEntities: () => void;
  setEntities: (entities: R[]) => void;
  setOriginalEntities: (entities: R[]) => void;
  
  // Специальные методы
  setPrimary?: (id: number) => void; // для записей с флагом is_primary
  getByField?: (field: keyof R, value: any) => R | undefined;
  filterByField?: (field: keyof R, value: any) => R[];
}

/**
 * Универсальный хук для управления связанными сущностями
 */
export const useRelatedEntitiesManager = <R extends RelatedEntity>(
  config: RelatedEntitiesConfig<R> = {},
  parentId?: number
): UseRelatedEntitiesManagerReturn<R> => {
  
  const {
    parentIdField = 'organization_id',
    defaultValues = {},
    generateTempId = () => Date.now()
  } = config;

  // Состояние связанных сущностей
  const [entities, setEntities] = useState<R[]>([]);
  const [originalEntities, setOriginalEntities] = useState<R[]>([]);

  // Проверка изменений
  const hasChanges = hasArrayChanges(entities, originalEntities);

  // Добавление новой связанной записи
// Добавление новой связанной записи
const addEntity = useCallback((entityData: Omit<R, 'id' | 'parent_id'>) => {
  const baseEntity = {
    ...defaultValues,
    ...entityData,
    id: generateTempId(),
    is_active: true
  };
  
  // Динамически устанавливаем parentIdField
  const newEntity = {
    ...baseEntity,
    [parentIdField]: parentId || generateTempId()
  } as R;
  
  setEntities(prev => [...prev, newEntity]);
  console.log('➕ Добавлена связанная запись:', newEntity);
}, [defaultValues, generateTempId, parentId, parentIdField]);
    

  // Обновление существующей записи
  const updateEntity = useCallback((id: number, updates: Partial<R>) => {
    setEntities(prev => prev.map(entity => 
      entity.id === id ? { ...entity, ...updates } : entity
    ));
    console.log('📝 Обновлена связанная запись с ID:', id);
  }, []);

  // Удаление записи
  const removeEntity = useCallback((id: number) => {
    setEntities(prev => prev.filter(entity => entity.id !== id));
    console.log('🗑️ Удалена связанная запись с ID:', id);
  }, []);

  // Сброс изменений
  const resetEntities = useCallback(() => {
    setEntities([...originalEntities]);
    console.log('🔄 Сброшены изменения связанных записей');
  }, [originalEntities]);

  // Установка основной записи (для записей с is_primary)
  const setPrimary = useCallback((id: number) => {
    setEntities(prev => prev.map(entity => ({
      ...entity,
      is_primary: entity.id === id
    } as R)));
    console.log('⭐ Установлена основная запись с ID:', id);
  }, []);

  // Поиск по полю
  const getByField = useCallback((field: keyof R, value: any): R | undefined => {
    return entities.find(entity => entity[field] === value);
  }, [entities]);

  // Фильтрация по полю
  const filterByField = useCallback((field: keyof R, value: any): R[] => {
    return entities.filter(entity => entity[field] === value);
  }, [entities]);

  return {
    // Данные
    entities,
    originalEntities,
    
    // Состояние
    hasChanges,
    
    // Основные методы
    addEntity,
    updateEntity,
    removeEntity,
    resetEntities,
    setEntities,
    setOriginalEntities,
    
    // Специальные методы
    setPrimary,
    getByField,
    filterByField
  };
};

/**
 * Хелперы для работы со связанными сущностями
 */
export const RelatedEntitiesUtils = {
  /**
   * Создает конфигурацию для связанных сущностей
   */
  createConfig: <R extends RelatedEntity>(
    parentIdField: string,
    defaultValues: Partial<R>,
    generateTempId?: () => number
  ): RelatedEntitiesConfig<R> => ({
    parentIdField,
    defaultValues,
    generateTempId
  }),

  /**
   * Группирует связанные сущности по полю
   */
  groupByField: <R extends RelatedEntity>(
    entities: R[],
    field: keyof R
  ): Record<string, R[]> => {
    return entities.reduce((groups, entity) => {
      const key = String(entity[field]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(entity);
      return groups;
    }, {} as Record<string, R[]>);
  },

  /**
   * Валидирует связанные сущности
   */
  validateEntities: <R extends RelatedEntity>(
    entities: R[],
    requiredFields: Array<keyof R>
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    entities.forEach((entity, index) => {
      requiredFields.forEach(field => {
        if (!entity[field]) {
          errors.push(`Запись ${index + 1}: поле "${String(field)}" обязательно`);
        }
      });
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};