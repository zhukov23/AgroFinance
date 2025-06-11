// src/types/validation.types.ts

/**
 * Ошибка валидации поля
 */
export interface ValidationError {
  field: string;
  error: string;
  message: string;
  expected?: string;
  received?: string;
  value?: any;
}

/**
 * Неудачная операция при batch-сохранении
 */
export interface FailedOperation {
  error: string;
  executionOrder: number;
  operation: string;
  table: string;
  tempId: string;
  validationErrors: ValidationError[];
}

/**
 * Данные об ошибках сохранения
 */
/**
 * Данные об ошибках сохранения с информацией о запросе
 */
export interface SaveErrorData {
  failed: FailedOperation[];
  successful?: any[];
  requestInfo?: {
    url: string;
    method: string;
    body: any;
    timestamp: string;
  };
}

/**
 * Результат валидации
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Опции валидации
 */
export interface ValidationOptions {
  validateSchema?: boolean;
  validateDependencies?: boolean;
  stopOnError?: boolean;
}