// src/pages/References/StorageLocations/services/testDataGenerator.ts

import { testDataConfig } from '../config/testDataAIScript';
import { StorageLocationData } from '../hooks/useStorageLocationEdit';
import { AIDataGeneratorService, AIGeneratorOptions } from '../../../../services/AIDataGeneratorService';

export interface TestDataGeneratorOptions extends AIGeneratorOptions {}

/**
 * Специализированный сервис для генерации тестовых данных мест хранения
 */
export class TestDataGeneratorService {
  private aiGenerator: AIDataGeneratorService;
  private onStatusChange?: (status: string) => void;
  private onError?: (error: string) => void;

  constructor(options: TestDataGeneratorOptions = {}) {
    this.onStatusChange = options.onStatusChange;
    this.onError = options.onError;
    
    // Инициализируем универсальный AI генератор
    this.aiGenerator = new AIDataGeneratorService({
      apiBaseUrl: options.apiBaseUrl,
      onStatusChange: this.onStatusChange,
      onError: this.onError
    });
  }

  /**
   * Генерирует тестовые данные места хранения
   * @returns сгенерированные данные места хранения
   */
async generateStorageLocationData(): Promise<Partial<StorageLocationData>> {
  console.log('🎯 TestDataGenerator: Начинаем генерацию тестовых данных места хранения...');

  this.updateStatus('Генерируем тестовые данные места хранения...');

  try {
    // Используем универсальный AI сервис для генерации текстовых полей
    const generatedData = await this.aiGenerator.generateData(testDataConfig.storageLocation);
    
    if (generatedData.length === 0) {
      throw new Error('AI не сгенерировал данные');
    }

    const aiData = generatedData[0];
    
    // Генерируем связанные поля
    const storageType = this.getRandomStorageType();
    const capacities = this.getRandomCapacities();
    
    // Подготавливаем полные данные места хранения (AI + наши числовые поля)
    const storageLocationData: Partial<StorageLocationData> = {
      // Данные от AI
      name: aiData.name,
      code: aiData.code,
      address: aiData.address,
      coordinates: aiData.coordinates,
      contact_person: aiData.contact_person,
      phone: aiData.phone,
      email: aiData.email,
      storage_conditions: aiData.storage_conditions,
      contract_number: aiData.contract_number,
      notes: aiData.notes,
      
      // Числовые и фиксированные поля генерируем сами
      storage_type: storageType,
      counterparty_id: this.getRandomCounterpartyId(storageType),
      total_capacity: capacities.total_capacity,
      available_capacity: capacities.available_capacity,
      storage_types_allowed: this.getRandomStorageTypesAllowed(),
      rental_cost_per_ton: this.getRandomRentalCost(),
      contract_start_date: this.getRandomContractStartDate(),
      contract_end_date: this.getRandomContractEndDate(),
      has_grain_dryer: this.getRandomBoolean(),
      has_cleaning_equipment: this.getRandomBoolean(),
      has_scales: this.getRandomBoolean(),
      has_loading_equipment: this.getRandomBoolean(),
      security_level: this.getRandomSecurityLevel(),
      status: this.getRandomStatus(),
      rating: this.getRandomRating(),
      tags: this.getRandomTags(),
      is_active: true
    };

    this.updateStatus('Тестовые данные места хранения успешно сгенерированы');
    console.log('✅ TestDataGenerator: Данные места хранения успешно сгенерированы');

    return storageLocationData;

  } catch (err) {
    const errorMessage = `Ошибка генерации тестовых данных места хранения: ${err}`;
    this.handleError(errorMessage);
    throw new Error(errorMessage);
  }
}

  // Методы генерации отдельных полей
// Методы генерации отдельных полей
private getRandomStorageType(): string {
  const types = ['own', 'external'];
  return types[Math.floor(Math.random() * types.length)];
}

// Генерируем связанные емкости (доступная <= общая)
private getRandomCapacities(): { total_capacity: number; available_capacity: number } {
  const totalCapacity = Math.round((Math.random() * 5000 + 500) * 100) / 100; // 500-5500 тонн
  const availablePercent = 0.3 + Math.random() * 0.65; // 30-95% от общей
  const availableCapacity = Math.round((totalCapacity * availablePercent) * 100) / 100;
  
  return {
    total_capacity: totalCapacity,
    available_capacity: availableCapacity
  };
}

private getRandomCounterpartyId(storageType: string): number | undefined {
  // Для собственных складов counterparty_id должен быть NULL
  // Для внешних складов counterparty_id должен быть NOT NULL
  if (storageType === 'own') {
    return undefined; // NULL для собственных
  } else {
    return Math.floor(Math.random() * 10) + 1; // NOT NULL для внешних
  }
}

  private getRandomTotalCapacity(): number {
    return Math.round((Math.random() * 5000 + 500) * 100) / 100; // 500-5500 тонн
  }

  private getRandomAvailableCapacity(): number {
    // Генерируем доступную емкость как процент от общей емкости (30-95%)
    const totalCapacity = this.getRandomTotalCapacity();
    const availablePercent = 0.3 + Math.random() * 0.65; // 30-95%
    return Math.round((totalCapacity * availablePercent) * 100) / 100;
  }

  private getRandomStorageTypesAllowed(): string[] {
    const types = ['grain', 'seeds', 'fertilizers', 'chemicals', 'equipment', 'feed', 'fuel'];
    const count = Math.floor(Math.random() * 3) + 1;
    return this.getRandomArrayItems(types, count);
  }

  private getRandomRentalCost(): number | undefined {
    // Для внешних складов генерируем стоимость аренды
    return Math.random() > 0.6 ? Math.round((Math.random() * 500 + 50) * 100) / 100 : undefined;
  }

  private getRandomContractStartDate(): string | undefined {
    if (Math.random() > 0.7) {
      const start = new Date();
      start.setMonth(start.getMonth() - Math.floor(Math.random() * 12));
      return start.toISOString().split('T')[0];
    }
    return undefined;
  }

  private getRandomContractEndDate(): string | undefined {
    if (Math.random() > 0.7) {
      const end = new Date();
      end.setMonth(end.getMonth() + Math.floor(Math.random() * 24) + 1);
      return end.toISOString().split('T')[0];
    }
    return undefined;
  }

  private getRandomBoolean(): boolean {
    return Math.random() > 0.5;
  }

  private getRandomSecurityLevel(): string {
    const levels = ['low', 'medium', 'high', 'maximum'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  private getRandomStatus(): string {
    const statuses = ['active', 'maintenance', 'renovation', 'inactive'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getRandomRating(): number {
    return Math.floor(Math.random() * 5) + 1; // 1-5
  }

  private getRandomTags(): string[] {
    const allTags = ['climate_controlled', 'refrigerated', 'automated', 'certified', 'eco_friendly', 'fire_protected', 'pest_controlled', 'modern'];
    return this.getRandomArrayItems(allTags, Math.floor(Math.random() * 4) + 1);
  }

  private getRandomArrayItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
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
    console.error('❌ TestDataGenerator:', error);
    if (this.onError) {
      this.onError(error);
    }
  }
}

// Экспорты для использования в хуках
export const createTestDataGenerator = (options?: TestDataGeneratorOptions): TestDataGeneratorService => {
  return new TestDataGeneratorService(options);
};

export const generateTestData = async (apiBaseUrl?: string): Promise<Partial<StorageLocationData>> => {
  const generator = createTestDataGenerator({ apiBaseUrl });
  return generator.generateStorageLocationData();
};

// Экспорт для использования в тестах
export const TestDataGeneratorUtils = {
  /**
   * Валидирует структуру данных места хранения
   */
  validateStorageLocationData: (location: any): location is StorageLocationData => {
    return location && 
           typeof location.name === 'string' &&
           typeof location.storage_type === 'string';
  },

  /**
   * Создает mock данные места хранения для тестов
   */
  createMockStorageLocation: (id: number, name: string): Partial<StorageLocationData> => ({
    id,
    name,
    storage_type: 'own',
    total_capacity: 1000 + id * 100,
    is_active: true
  })
};