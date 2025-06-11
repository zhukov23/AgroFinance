// src/utils/dataTransformation.utils.ts

/**
 * Преобразует массив в строку для отправки на сервер
 */
export const adaptArrayToString = (value: any[]): string => {
  if (!Array.isArray(value)) return '';
  return JSON.stringify(value);
};

/**
 * Преобразует строку в массив при получении с сервера
 */
export const adaptStringToArray = (value: string): any[] => {
  if (!value || typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Преобразует число в строку для отправки
 */
export const adaptNumberToString = (value: number | null | undefined): string | undefined => {
  if (value === null || value === undefined) return undefined;
  return String(value);
};

/**
 * Преобразует строку в число при получении
 */
export const adaptStringToNumber = (value: string | null | undefined): number | undefined => {
  if (!value) return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

/**
 * Преобразует boolean в число для БД (1/0)
 */
export const adaptBooleanToNumber = (value: boolean): number => {
  return value ? 1 : 0;
};

/**
 * Преобразует число в boolean из БД
 */
export const adaptNumberToBoolean = (value: number | string): boolean => {
  return Boolean(Number(value));
};

/**
 * Очищает объект от undefined и null значений
 */
export const cleanObjectData = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      cleaned[key as keyof T] = value;
    }
  });
  
  return cleaned;
};

/**
 * Подготавливает данные для отправки на сервер (универсальная адаптация)
 */
/**
 * Подготавливает данные для отправки на сервер (универсальная адаптация)
 */
export const prepareDataForServer = <T extends Record<string, any>>(data: T): Record<string, any> => {
  const prepared: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Пропускаем пустые значения и id для новых записей
    if (value === undefined || 
        value === null || 
        (key === 'id')) {
      return;
    }
    
    // Специальная обработка для конкретных полей
    if (key === 'vat_rate' && typeof value === 'number') {
      prepared[key] = String(value);
    } else if (Array.isArray(value)) {
      prepared[key] = value;
    } else if (typeof value === 'boolean') {
      prepared[key] = adaptBooleanToNumber(value);
    } else if (typeof value === 'object' && value !== null) {
      prepared[key] = JSON.stringify(value);
    } else {
      prepared[key] = value;
    }
  });
  
  return prepared;
};

/**
 * Обрабатывает данные, полученные с сервера
 */
export const processDataFromServer = <T extends Record<string, any>>(
  data: Record<string, any>,
  arrayFields: string[] = [],
  booleanFields: string[] = []
): T => {
  const processed = { ...data } as T;
  
  // Обрабатываем массивы
  arrayFields.forEach(field => {
    if (processed[field as keyof T] && typeof processed[field as keyof T] === 'string') {
      processed[field as keyof T] = adaptStringToArray(processed[field as keyof T] as string) as T[keyof T];
    }
  });
  
  // Обрабатываем boolean поля
  booleanFields.forEach(field => {
    if (processed[field as keyof T] !== undefined) {
      processed[field as keyof T] = adaptNumberToBoolean(processed[field as keyof T] as number) as T[keyof T];
    }
  });
  
  return processed;
};

/**
 * Создает временный ID для новых записей
 */
export const generateTempId = (prefix: string = 'entity'): string => {
  return `temp_${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// /**
//  * Проверяет, является ли ID временным
//  */
// export const isTempId = (id: string | number): boolean => {
//   return typeof id === 'string' && id.startsWith('temp_');
// };
/**
 * Проверяет, является ли ID временным
 */
export const isTempId = (id: string | number): boolean => {
  return typeof id === 'string' && id.toString().startsWith('temp_');
};