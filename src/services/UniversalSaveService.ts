// src/services/UniversalSaveService.ts

import { BatchSaveRequest, BatchSaveResponse, BatchOperation } from '../types/api.types';
import { BaseEntity, RelatedEntity } from '../types/entity.types';
import { prepareDataForServer, generateTempId, isTempId } from '../utils/dataTransformation.utils';

export interface SaveServiceOptions {
  apiBaseUrl?: string;
  validateSchema?: boolean;
  validateDependencies?: boolean;
  stopOnError?: boolean;
}

/**
 * Универсальный сервис для сохранения сущностей через batch API
 */
export class UniversalSaveService {
  private apiBaseUrl: string;
  private defaultOptions: Required<SaveServiceOptions>;

  constructor(options: SaveServiceOptions = {}) {
    this.apiBaseUrl = options.apiBaseUrl || 'http://localhost:3000';
    this.defaultOptions = {
      apiBaseUrl: this.apiBaseUrl,
      validateSchema: true,
      validateDependencies: true,
      stopOnError: true
    };
  }

// Добавить в класс UniversalSaveService новый метод:

/**
 * Сохраняет сущности пошагово с учетом зависимостей
 */
async saveEntityWithSteps<T extends BaseEntity, R extends RelatedEntity>(
  entity: T,
  relatedEntities: R[],
  mainTableName: string,
  relatedTableName: string,
  dependencies: any[], // SaveDependency[]
  options: Partial<SaveServiceOptions> = {}
): Promise<boolean> {
  
  const saveOptions = { ...this.defaultOptions, ...options };
  let createdIds: Record<string, number> = {};
  
  try {
    console.log('💾 UniversalSaveService: Пошаговое сохранение...');
    console.log('📊 Основная сущность:', entity);
    console.log('📊 Связанных записей:', relatedEntities.length);

    // ШАГ 1: Сохраняем основную сущность
    const mainTempId = generateTempId('main_entity');
    
    const mainOperation: BatchOperation = {
      type: entity.id && entity.id > 0 ? 'update' : 'create',
      table: mainTableName,
      tempId: mainTempId,
      data: prepareDataForServer(entity),
      ...(entity.id && entity.id > 0 ? { where: { id: entity.id } } : {})
    };

    const mainBatchRequest: BatchSaveRequest = {
      operations: [mainOperation],
      stopOnError: saveOptions.stopOnError,
      validateDependencies: saveOptions.validateDependencies,
      validateSchema: saveOptions.validateSchema
    };

    console.log('📤 ШАГ 1: Сохраняем основную сущность:', mainBatchRequest);
    console.log('📤 JSON тела запроса:', JSON.stringify(mainBatchRequest, null, 2));    

    const mainResponse = await fetch(`${this.apiBaseUrl}/api/data/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mainBatchRequest)
    });

    // Исправляем строку:
    const mainResult: BatchSaveResponse = await mainResponse.json();
    console.log('📋 Результат ШАГ 1:', mainResult);

if (!mainResponse.ok || !mainResult.success) {
  throw this.handleBatchError(mainResult, mainTableName, mainBatchRequest);
}

    // Получаем ID созданной основной сущности
    if (mainResult.ids && mainResult.ids[mainTempId]) {
      createdIds[mainTempId] = mainResult.ids[mainTempId];
      console.log(`✅ Основная сущность создана с ID: ${createdIds[mainTempId]}`);
    }

    // ШАГ 2: Сохраняем связанные сущности если есть
if (relatedEntities.length > 0 && relatedTableName) {
const relatedOperations: BatchOperation[] = relatedEntities.map((relatedEntity, index) => {
  const relatedTempId = generateTempId(`related_${index + 1}`);
  
  return {
    type: 'create', // ← Всегда create для связанных сущностей
    table: relatedTableName,
    tempId: relatedTempId,
data: (() => {
  // Убираем поля банка из связанной сущности
  const { bank_name, bank_bik, bank_correspondent_account, bank_address, bank_swift, ...cleanEntity } = relatedEntity as any;
  return {
    ...prepareDataForServer(cleanEntity),
    organization_id: createdIds[mainTempId] || entity.id
  };
})()
    // Убираем where полностью
  };
});


      const relatedBatchRequest: BatchSaveRequest = {
        operations: relatedOperations,
        stopOnError: saveOptions.stopOnError,
        validateDependencies: saveOptions.validateDependencies,
        validateSchema: saveOptions.validateSchema
      };

      console.log('📤 ШАГ 2: Сохраняем связанные сущности:', relatedBatchRequest);

      const relatedResponse = await fetch(`${this.apiBaseUrl}/api/data/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(relatedBatchRequest)
      });

      const relatedResult: BatchSaveResponse = await relatedResponse.json();
      console.log('📋 Результат ШАГ 2:', relatedResult);

// Во втором вызове:
if (!relatedResponse.ok || !relatedResult.success) {
  throw this.handleBatchError(relatedResult, relatedTableName, relatedBatchRequest);
}

      console.log('✅ Связанные сущности сохранены');
    }

    console.log('✅ Пошаговое сохранение завершено успешно');
    return true;

  } catch (error) {
    console.error('❌ Ошибка в пошаговом сохранении:', error);
    throw error;
  }
}

/**
 * Обработка ошибок от batch API
 */
private handleBatchError(result: BatchSaveResponse, tableName: string, requestBody: any): any {
  console.log('🔍 handleBatchError получил:', result);
  console.log('🔍 result.data:', result.data); // ДОБАВЬ ЭТУ СТРОКУ
  
  // Новый формат - validationErrors в корне ответа
  if (result.validationErrors && Array.isArray(result.validationErrors)) {
    console.log('📋 ПУТЬ 1: validationErrors в корне');
    console.log('📋 Найдены validationErrors в корне:', result.validationErrors);
    const adaptedErrorData = {
      failed: result.validationErrors.map((error: any, index: number) => ({
        error: error.error || result.error || 'Validation error',
        executionOrder: index + 1,
        operation: error.operation || 'create',
        table: error.table || tableName,
        tempId: error.tempId || `validation_error_${index + 1}`,
        validationErrors: [error] // Оборачиваем в массив
      })),
      requestInfo: {
        url: `${this.apiBaseUrl}/api/data/batch`,
        method: 'POST',
        body: requestBody, // Передаем реальный запрос
        timestamp: new Date().toISOString()
      }
    };
    console.log('📋 Адаптированные ошибки:', adaptedErrorData);
    return { validationErrors: adaptedErrorData, type: 'validation' };
  }
  
  if (result.data && result.data.failed && Array.isArray(result.data.failed)) {
    console.log('📋 ПУТЬ 2: data.failed найден');
    
    const adaptedErrorData = {
      failed: result.data.failed,
      requestInfo: {
        url: `${this.apiBaseUrl}/api/data/batch`,
        method: 'POST',
        body: requestBody,
        timestamp: new Date().toISOString()
      }
    };
    console.log('📋 Адаптированные ошибки из data.failed:', adaptedErrorData);
    console.log('📋 Возвращаем объект с type validation');
    return { validationErrors: adaptedErrorData, type: 'validation' };
  }
    // Обычная ошибка
  console.log('📋 ПУТЬ 3: Обычная ошибка');
  return new Error(`HTTP error: ${result.error || 'Unknown error'}`);
}
/**
 * Сохраняет основную сущность с связанными записями
 */
async saveEntityWithRelated<T extends BaseEntity, R extends RelatedEntity>(
  entity: T,
  relatedEntities: R[],
  mainTableName: string,
  relatedTableName: string,
  options: Partial<SaveServiceOptions> = {}
): Promise<boolean> {
  
  const saveOptions = { ...this.defaultOptions, ...options };
  
  try {
    console.log('💾 UniversalSaveService: Начинаем сохранение...');
    console.log('📊 Основная сущность:', entity);
    console.log('📊 Связанных записей:', relatedEntities.length);

    // Подготавливаем операции для batch-запроса
    const operations: BatchOperation[] = [];
    const mainTempId = generateTempId('main_entity');

    // Операция для основной сущности
    operations.push({
      type: entity.id && entity.id > 0 ? 'update' : 'create',
      table: mainTableName,
      tempId: mainTempId,
      data: prepareDataForServer(entity),
      ...(entity.id && entity.id > 0 ? { where: { id: entity.id } } : {})
    });

    // Операции для связанных сущностей
    relatedEntities.forEach((relatedEntity, index) => {
      const relatedTempId = generateTempId(`related_${index + 1}`);
      
      operations.push({
        type: relatedEntity.id && relatedEntity.id > 0 ? 'update' : 'create',
        table: relatedTableName,
        tempId: relatedTempId,
        data: {
          ...prepareDataForServer(relatedEntity),
          parent_id: entity.id && entity.id > 0 ? entity.id : mainTempId
        },
        ...(relatedEntity.id && relatedEntity.id > 0 ? { where: { id: relatedEntity.id } } : {})
      });
    });

    // Формируем batch-запрос
    const batchRequest: BatchSaveRequest = {
      operations,
      stopOnError: saveOptions.stopOnError,
      validateDependencies: saveOptions.validateDependencies,
      validateSchema: saveOptions.validateSchema
    };

    console.log('📤 Отправляем batch-запрос:', batchRequest);

    // Отправляем запрос
    const response = await fetch(`${this.apiBaseUrl}/api/data/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchRequest)
    });

    const result: BatchSaveResponse = await response.json();
    console.log('📋 Полный ответ от сервера:', result);

    // Обрабатываем ответ
    if (!response.ok || !result.success) {
      // Проверяем есть ли структурированные ошибки валидации
// В функции saveEntityWithRelated, в блоке обработки ошибок:

if (result.validationErrors && Array.isArray(result.validationErrors) && result.validationErrors.length > 0) {
  console.log('📋 Найдены ошибки валидации, форматируем для ErrorToast');
  
  // Адаптируем структуру для ErrorToast с информацией о запросе
  const adaptedErrorData = {
    failed: result.validationErrors.map((validationError: any, index: number) => ({
      error: validationError.error || result.error || 'Validation error',
      executionOrder: validationError.executionOrder || index + 1,
      operation: validationError.operation || 'create',
      table: validationError.table || mainTableName,
      tempId: validationError.tempId || `validation_error_${index + 1}`,
      validationErrors: validationError.validationErrors || [validationError]
    })),
    requestInfo: {
      url: `${this.apiBaseUrl}/api/data/batch`,
      method: 'POST',
      body: batchRequest,
      timestamp: new Date().toISOString()
    }
  };
  
  console.log('📋 Адаптированные ошибки для ErrorToast:', adaptedErrorData);
  throw { validationErrors: adaptedErrorData, type: 'validation' };
}
    }

    console.log('✅ Сущность успешно сохранена:', result);
    return true;

  } catch (error) {
    console.error('❌ Ошибка в UniversalSaveService:', error);
    throw error;
  }
}

  /**
   * Сохраняет только основную сущность без связанных записей
   */
  async saveEntity<T extends BaseEntity>(
    entity: T,
    tableName: string,
    options: Partial<SaveServiceOptions> = {}
  ): Promise<boolean> {
    return this.saveEntityWithRelated(entity, [], tableName, '', options);
  }

  /**
   * Создает операцию для batch-запроса
   */
  private createOperation<T extends Record<string, any>>(
    entity: T,
    tableName: string,
    tempId: string,
    isUpdate: boolean = false
  ): BatchOperation {
    return {
      type: isUpdate ? 'update' : 'create',
      table: tableName,
      tempId,
      data: prepareDataForServer(entity),
      ...(isUpdate && (entity as any).id ? { where: { id: (entity as any).id } } : {})
    };
  }
}