// src/services/AIDataGeneratorService.ts
import {DEFAULT_API_BASE_URL} from '../dataSync/index';
export interface AIGeneratorOptions {
  apiBaseUrl?: string;
  onStatusChange?: (status: string) => void;
  onError?: (error: string) => void;
}

export interface AIGenerationConfig {
  [key: string]: any;
}

export interface AIGenerationResult<T = any> {
  success: boolean;
  data?: T[];
  error?: string;
}

/**
 * Универсальный сервис для генерации тестовых данных через AI
 */
export class AIDataGeneratorService {
  private apiBaseUrl: string;
  private onStatusChange?: (status: string) => void;
  private onError?: (error: string) => void;

  constructor(options: AIGeneratorOptions = {}) {
    this.apiBaseUrl = options.apiBaseUrl || DEFAULT_API_BASE_URL;
    this.onStatusChange = options.onStatusChange;
    this.onError = options.onError;
  }

  /**
   * Генерирует тестовые данные через AI API
   * @param config - конфигурация для генерации
   * @returns сгенерированные данные
   */
  async generateData<T = any>(config: AIGenerationConfig): Promise<T[]> {
    console.log('🤖 AIDataGeneratorService: Начинаем генерацию...');
    
    this.updateStatus('Отправляем запрос к AI для генерации данных...');

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/ai/generate-test-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: AIGenerationResult<T> = await response.json();
      console.log('🤖 Получен ответ от AI:', result);

      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error(result.error || 'Некорректный ответ от AI сервера');
      }

      this.updateStatus('Данные успешно сгенерированы AI');
      console.log('✅ AIDataGeneratorService: Данные сгенерированы');

      return result.data;

    } catch (err) {
      const errorMessage = `Ошибка генерации через AI: ${err}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Обновляет статус генерации
   */
  private updateStatus(status: string): void {
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }

  /**
   * Обрабатывает ошибки
   */
  private handleError(error: string): void {
    console.error('❌ AIDataGeneratorService:', error);
    if (this.onError) {
      this.onError(error);
    }
  }
}

/**
 * Фабричная функция для создания AI генератора
 */
export const createAIDataGenerator = (options?: AIGeneratorOptions): AIDataGeneratorService => {
  return new AIDataGeneratorService(options);
};