// src/utils/errorReporting.utils.ts

import { SaveErrorData, ValidationError, FailedOperation } from '../types/validation.types';

/**
 * Форматирует сообщение валидации для отображения пользователю
 */
export const formatValidationMessage = (error: ValidationError): string => {
  return `${error.field}: ${error.message}`;
};

/**
 * Генерирует текстовый отчет об ошибках для копирования
 */
/**
 * Генерирует текстовый отчет об ошибках для копирования
 */
export const generateErrorReport = (
  errorData: SaveErrorData, 
  requestInfo?: {
    url: string;
    method: string;
    body: any;
    timestamp: string;
  }
): string => {
  if (!errorData || !errorData.failed || errorData.failed.length === 0) {
    return 'Нет ошибок для отображения';
  }

  let report = 'ОТЧЕТ ОБ ОШИБКАХ СОХРАНЕНИЯ\n';
  report += '=' .repeat(50) + '\n\n';

  // Добавляем информацию о запросе если есть
  if (requestInfo) {
    report += 'ИНФОРМАЦИЯ О ЗАПРОСЕ:\n';
    report += `Время: ${requestInfo.timestamp}\n`;
    report += `URL: ${requestInfo.url}\n`;
    report += `Метод: ${requestInfo.method}\n`;
    report += `Тело запроса:\n${JSON.stringify(requestInfo.body, null, 2)}\n`;
    report += '=' .repeat(50) + '\n\n';
  }

  errorData.failed.forEach((operation, index) => {
    report += `ОПЕРАЦИЯ ${index + 1}:\n`;
    report += `  Тип: ${operation.operation.toUpperCase()}\n`;
    report += `  Таблица: ${operation.table}\n`;
    report += `  ID: ${operation.tempId}\n`;
    report += `  Порядок выполнения: ${operation.executionOrder}\n`;
    
    if (operation.error && operation.error !== 'Unknown error') {
      report += `  Общая ошибка: ${operation.error}\n`;
    }
    
    if (operation.validationErrors && operation.validationErrors.length > 0) {
      report += `  Ошибки валидации (${operation.validationErrors.length}):\n`;
      operation.validationErrors.forEach((error, errorIndex) => {
        report += `    ${errorIndex + 1}. Поле: ${error.field}\n`;
        report += `       Тип ошибки: ${error.error}\n`;
        report += `       Сообщение: ${error.message}\n`;
        if (error.expected) report += `       Ожидается: ${error.expected}\n`;
        if (error.received) report += `       Получено: ${error.received}\n`;
        if (error.value !== undefined) {
          const value = typeof error.value === 'object' ? JSON.stringify(error.value) : String(error.value);
          report += `       Значение: ${value}\n`;
        }
        report += `\n`;
      });
    }
    report += `${'-'.repeat(30)}\n\n`;
  });

  report += `Всего неудачных операций: ${errorData.failed.length}\n`;
  if (errorData.successful) {
    report += `Успешных операций: ${errorData.successful.length}\n`;
  }

  return report;
};

/**
 * Копирует текст в буфер обмена
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Не удалось скопировать в буфер обмена:', err);
    return false;
  }
};

/**
 * Возвращает иконку для типа ошибки
 */
export const getErrorIcon = (errorType: string): string => {
  switch (errorType) {
    case 'validation':
      return 'ri-error-warning-line';
    case 'required':
      return 'ri-alert-line';
    case 'format':
      return 'ri-information-line';
    default:
      return 'ri-error-warning-line';
  }
};

/**
 * Группирует ошибки по таблицам для удобного отображения
 */
export const groupErrorsByTable = (errorData: SaveErrorData): Record<string, FailedOperation[]> => {
  if (!errorData?.failed) return {};
  
  return errorData.failed.reduce((acc, operation) => {
    if (!acc[operation.table]) {
      acc[operation.table] = [];
    }
    acc[operation.table].push(operation);
    return acc;
  }, {} as Record<string, FailedOperation[]>);
};

/**
 * Извлекает все уникальные поля с ошибками
 */
export const getErrorFields = (errorData: SaveErrorData): string[] => {
  if (!errorData?.failed) return [];
  
  const fields = new Set<string>();
  
  errorData.failed.forEach(operation => {
    operation.validationErrors?.forEach(error => {
      fields.add(error.field);
    });
  });
  
  return Array.from(fields);
};