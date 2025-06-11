// src/utils/validation.utils.ts

import { ValidationError, ValidationResult } from '../types/validation.types';
import { BaseEntity } from '../types/entity.types';

/**
 * Проверяет наличие изменений между двумя объектами
 */
export const hasChanges = <T>(current: T | null, original: T | null): boolean => {
  if (!current && !original) return false;
  if (!current || !original) return true;
  
  return JSON.stringify(current) !== JSON.stringify(original);
};

/**
 * Проверяет наличие изменений в массиве сущностей
 */
export const hasArrayChanges = <T>(current: T[], original: T[]): boolean => {
  if (current.length !== original.length) return true;
  
  return JSON.stringify(current) !== JSON.stringify(original);
};

/**
 * Проверяет заполнение обязательных полей
 */
export const validateRequiredFields = <T extends Record<string, any>>(
  entity: T, 
  requiredFields: Array<keyof T>
): ValidationResult => {
  const errors: ValidationError[] = [];
  
  requiredFields.forEach(field => {
    const value = entity[field];
    if (value === undefined || value === null || value === '') {
      errors.push({
        field: String(field),
        error: 'required',
        message: `Поле "${String(field)}" обязательно для заполнения`,
        expected: 'не пустое значение',
        received: String(value)
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Проверяет корректность email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Проверяет корректность телефона (российский формат)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Создает ValidationError для поля
 */
export const createValidationError = (
  field: string,
  message: string,
  expected?: string,
  received?: string
): ValidationError => ({
  field,
  error: 'validation',
  message,
  expected,
  received
});

/**
 * Объединяет результаты валидации
 */
export const combineValidationResults = (...results: ValidationResult[]): ValidationResult => ({
  isValid: results.every(r => r.isValid),
  errors: results.flatMap(r => r.errors)
});

/**
 * Проверяет, что сущность имеет валидный ID (для обновления)
 */
export const isExistingEntity = <T extends BaseEntity>(entity: T | null): entity is T => {
  return entity !== null && entity.id !== undefined && entity.id > 0;
};

/**
 * Проверяет, что это новая сущность (для создания)
 */
export const isNewEntity = <T extends BaseEntity>(entity: T | null): boolean => {
  return entity !== null && (entity.id === undefined || entity.id <= 0);
};