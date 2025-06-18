// src/hooks/useValidationErrorHandler.ts
import { useSuccessToast } from '../components/Common/MessageToast/SuccessToast';
import { useState, useCallback } from 'react';
import { SaveErrorData } from '../types/validation.types';

export interface UseValidationErrorHandlerReturn {
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
  
  // Метод для обработки успеха (всегда доступен)
  handleSuccess: (message: string, details?: string) => void;
}

export const useValidationErrorHandler = (): UseValidationErrorHandlerReturn => {
  
  const [localError, setLocalError] = useState<string | null>(null);
  const [saveErrorData, setSaveErrorData] = useState<SaveErrorData | null>(null);
  const { showSuccess } = useSuccessToast();
  
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

  const handleSuccess = useCallback((message: string, details?: string) => {
    // Очищаем ошибки при успехе
    clearAllErrors();
    // Показываем успешное уведомление
    showSuccess(message, details);
  }, [showSuccess, clearAllErrors]);

  const handleSaveError = useCallback((error: any) => {
    console.error('❌ handleSaveError вызван с:', error);
    console.log('🔍 Тип ошибки:', typeof error, error);
    console.log('🔍 error.type:', error?.type);
    console.log('🔍 error.validationErrors:', error?.validationErrors);

    if (error && error.type === 'validation' && error.validationErrors) {
      console.log('📋 ✅ УСЛОВИЕ ВЫПОЛНЕНО: Найдены ошибки валидации');
      console.log('📋 Устанавливаем saveErrorData:', error.validationErrors);
      setSaveErrorData(error.validationErrors);
      setLocalError(null);
    } else {
      console.log('🔍 ❌ УСЛОВИЕ НЕ ВЫПОЛНЕНО: Устанавливаем локальную ошибку');
      setLocalError(error instanceof Error ? error.message : String(error));
      setSaveErrorData(null);
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
    handleSaveError,
    
    // Обработчик успеха (всегда доступен)
    handleSuccess
  };
};