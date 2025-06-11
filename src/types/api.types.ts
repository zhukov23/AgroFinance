// src/types/api.types.ts

import { SaveErrorData } from './validation.types';

/**
 * Тип операции в batch-запросе
 */
export type BatchOperationType = 'create' | 'update' | 'delete';

/**
 * Операция для batch-сохранения
 */
export interface BatchOperation {
  type: BatchOperationType;
  table: string;
  tempId: string;
  data: Record<string, any>;
  where?: Record<string, any>; // для update/delete
}

/**
 * Запрос на batch-сохранение
 */
export interface BatchSaveRequest {
  operations: BatchOperation[];
  stopOnError?: boolean;
  validateDependencies?: boolean;
  validateSchema?: boolean;
}

/**
 * Ответ на batch-сохранение
 */
export interface BatchSaveResponse {
  success: boolean;
  error?: string;
  data?: any;
  validationErrors?: any[]; // Добавляем для совместимости
}
export interface BatchSaveResponse {
  success: boolean;
  error?: string;
  id?: number; // ID для одиночных операций
  ids?: Record<string, number>; // ID для множественных операций
  data?: any;
  validationErrors?: any[]; // Добавляем для совместимости
}
/**
 * Стандартный ответ API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Опции для API запросов
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}