// src/types/entity.types.ts

/**
 * Базовая сущность с обязательными полями
 */
/**
 * Базовая сущность с обязательными полями
 */
export interface BaseEntity {
  id?: number; // Делаем опциональным для новых записей
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Состояние редактирования сущности
 */
export interface EntityEditState<T extends BaseEntity> {
  current: T | null;
  original: T | null;
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  error: string | null;
}

/**
 * Опции для хука редактирования сущности
 */
export interface EntityEditOptions {
  autoLoad?: boolean;
  autoSave?: boolean;
  validateOnChange?: boolean;
}

/**
 * Результат сохранения сущности
 */
export interface SaveResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: any;
}

/**
 * Связанная сущность (дочерняя запись)
 */
export interface RelatedEntity extends BaseEntity {
  parent_id?: number; // ID родительской сущности (опциональный для совместимости)
}

/**
 * Хук для управления сущностью - возвращаемые методы
 */
export interface EntityEditHookReturn<T extends BaseEntity, R extends RelatedEntity = RelatedEntity> {
  // Данные
  entity: T | null;
  originalEntity: T | null;
  relatedEntities: R[];
  originalRelatedEntities: R[];
  
  // Состояние
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  error: string | null;
  
  // Методы для основной сущности
  updateEntity: (updates: Partial<T>) => void;
  resetEntity: () => void;
  loadEntity: (id: number) => Promise<void>;
  
  // Методы для связанных сущностей
  addRelatedEntity: (entity: Omit<R, 'id' | 'parent_id'>) => void;
  updateRelatedEntity: (id: number, updates: Partial<R>) => void;
  removeRelatedEntity: (id: number) => void;
  
  // Общие методы
  saveChanges: () => Promise<boolean>;
  clearError: () => void;
}