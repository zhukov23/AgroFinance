// src/pages/References/Banks/hooks/useErrorHandlers.ts

import { useState, useCallback } from 'react';

// Типы для ошибок
export interface ValidationError {
  field: string;
  error: string;
  message: string;
  expected?: string;
  received?: string;
  value?: any;
}

export interface FailedOperation {
  error: string;
  executionOrder: number;
  operation: string;
  table: string;
  tempId: string;
  validationErrors: ValidationError[];
}

export interface SaveErrorData {
  failed: FailedOperation[];
  successful?: any[];
}

export interface UseErrorHandlerReturn {
  // Состояние ошибок
  localError: string | null;
  saveErrorData: SaveErrorData | null;
  
  // Методы управления ошибками
  setLocalError: (error: string | null) => void;
  setSaveErrorData: (errorData: SaveErrorData | null) => void;
  clearError: () => void;
  clearSaveError: () => void;
  clearAllErrors: () => void;
  
  // Метод для обработки ошибок сохранения
  handleSaveError: (error: any) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [saveErrorData, setSaveErrorData] = useState<SaveErrorData | null>(null);

  const clearError = useCallback(() => {
    setLocalError(null);
  }, []);

  const clearSaveError = useCallback(() => {
    setSaveErrorData(null);
  }, []);

  const clearAllErrors = useCallback(() => {
    setLocalError(null);
    setSaveErrorData(null);
  }, []);

  const handleSaveError = useCallback((error: any) => {
    console.error('❌ handleSaveError вызван с:', error);
    console.log('🔍 Тип ошибки:', typeof error, error);

    if (error && error.type === 'validation' && error.validationErrors) {
        console.log('📋 Найдены ошибки валидации, устанавливаем saveErrorData:', error.validationErrors);
        setSaveErrorData(error.validationErrors);
    } else {
        console.log('🔍 Устанавливаем локальную ошибку');
        setLocalError(error instanceof Error ? error.message : String(error));
    }
  }, []);

  return {
    // Состояние ошибок
    localError,
    saveErrorData,
    
    // Методы управления ошибками
    setLocalError,
    setSaveErrorData,
    clearError,
    clearSaveError,
    clearAllErrors,
    
    // Обработчик ошибок сохранения
    handleSaveError
  };
}; 
