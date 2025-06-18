// src/pages/Assets/Equipment/services/testDataGenerator.ts

import { testDataConfig } from '../config/testDataAIScript';
import { EquipmentData } from '../hooks/useEquipmentEdit';
import { AIDataGeneratorService, AIGeneratorOptions } from '../../../../services/AIDataGeneratorService';

export interface TestDataGeneratorOptions extends AIGeneratorOptions {}

/**
 * Специализированный сервис для генерации тестовых данных техники
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
   * Генерирует тестовые данные техники
   * @returns сгенерированные данные техники
   */
  async generateEquipmentData(): Promise<Partial<EquipmentData>> {
    console.log('🎯 TestDataGenerator: Начинаем генерацию тестовых данных техники...');

    this.updateStatus('Генерируем тестовые данные техники...');

    try {
      // Используем универсальный AI сервис для генерации текстовых полей
      const generatedData = await this.aiGenerator.generateData(testDataConfig.equipment);
      
      if (generatedData.length === 0) {
        throw new Error('AI не сгенерировал данные');
      }

      const aiData = generatedData[0];
      
      // Подготавливаем полные данные техники (AI + наши числовые поля)
      const equipmentData: Partial<EquipmentData> = {
        // Данные от AI
        name: aiData.name,
        equipment_code: aiData.equipment_code,
        subcategory: aiData.subcategory,
        manufacturer: aiData.manufacturer,
        model: aiData.model,
        country_origin: aiData.country_origin,
        description: aiData.description,
        
        // Числовые и фиксированные поля генерируем сами
        category: this.getRandomCategory(),
        fuel_type: this.getRandomFuelType(),
        season_usage: this.getRandomSeasonUsage(),
        engine_power: this.getRandomEnginePower(),
        engine_volume: this.getRandomEngineVolume(),
        fuel_consumption: this.getRandomFuelConsumption(),
        working_width: this.getRandomWorkingWidth(),
        working_speed_min: this.getRandomWorkingSpeedMin(),
        working_speed_max: this.getRandomWorkingSpeedMax(),
        capacity: this.getRandomCapacity(),
        length_mm: this.getRandomLength(),
        width_mm: this.getRandomWidth(),
        height_mm: this.getRandomHeight(),
        weight_kg: this.getRandomWeight(),
        purchase_price: this.getRandomPurchasePrice(),
        depreciation_period_years: this.getRandomDepreciationPeriod(),
        maintenance_cost_per_hour: this.getRandomMaintenanceCost(),
        min_field_size: this.getRandomMinFieldSize(),
        suitable_crops: this.getRandomSuitableCrops(),
        specifications: this.getRandomSpecifications(),
        attachments: this.getRandomAttachments(),
        certifications: this.getRandomCertifications(),
        is_active: true
      };

      this.updateStatus('Тестовые данные техники успешно сгенерированы');
      console.log('✅ TestDataGenerator: Данные техники успешно сгенерированы');

      return equipmentData;

    } catch (err) {
      const errorMessage = `Ошибка генерации тестовых данных техники: ${err}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Методы генерации отдельных полей
  private getRandomCategory(): string {
    const categories = ['почвообработка', 'посев', 'уборка', 'защита растений', 'внесение удобрений', 'транспорт', 'заготовка кормов', 'другое'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private getRandomFuelType(): string {
    const fuelTypes = ['дизель', 'бензин', 'газ', 'электричество', 'гибрид'];
    return fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
  }

  private getRandomSeasonUsage(): string {
    const seasons = ['весна', 'лето', 'осень', 'зима', 'круглый год'];
    return seasons[Math.floor(Math.random() * seasons.length)];
  }

  private getRandomEnginePower(): number {
    return Math.round((Math.random() * 400 + 50) * 100) / 100; // 50-450 л.с.
  }

  private getRandomEngineVolume(): number {
    return Math.round((Math.random() * 15 + 2) * 100) / 100; // 2-17 л
  }

  private getRandomFuelConsumption(): number {
    return Math.round((Math.random() * 25 + 5) * 100) / 100; // 5-30 л/ч
  }

  private getRandomWorkingWidth(): number {
    return Math.round((Math.random() * 12 + 1) * 100) / 100; // 1-13 м
  }

  private getRandomWorkingSpeedMin(): number {
    return Math.round((Math.random() * 8 + 2) * 100) / 100; // 2-10 км/ч
  }

  private getRandomWorkingSpeedMax(): number {
    const min = this.getRandomWorkingSpeedMin();
    return Math.round((min + Math.random() * 15 + 5) * 100) / 100; // min + 5-20 км/ч
  }

  private getRandomCapacity(): number {
    return Math.round((Math.random() * 20 + 2) * 100) / 100; // 2-22 га/ч
  }

  private getRandomLength(): number {
    return Math.floor(Math.random() * 8000 + 2000); // 2000-10000 мм
  }

  private getRandomWidth(): number {
    return Math.floor(Math.random() * 5000 + 1500); // 1500-6500 мм
  }

  private getRandomHeight(): number {
    return Math.floor(Math.random() * 3000 + 1000); // 1000-4000 мм
  }

  private getRandomWeight(): number {
    return Math.floor(Math.random() * 15000 + 1000); // 1000-16000 кг
  }

  private getRandomPurchasePrice(): number {
    return Math.round((Math.random() * 8000000 + 500000) * 100) / 100; // 500,000-8,500,000 руб
  }

  private getRandomDepreciationPeriod(): number {
    return Math.floor(Math.random() * 15) + 5; // 5-20 лет
  }

  private getRandomMaintenanceCost(): number {
    return Math.round((Math.random() * 2000 + 200) * 100) / 100; // 200-2200 руб/ч
  }

  private getRandomMinFieldSize(): number {
    return Math.round((Math.random() * 50 + 5) * 100) / 100; // 5-55 га
  }

  private getRandomSuitableCrops(): string[] {
    const crops = ['пшеница', 'ячмень', 'овес', 'рожь', 'кукуруза', 'подсолнечник', 'соя', 'рапс', 'картофель', 'свекла'];
    return this.getRandomArrayItems(crops, Math.floor(Math.random() * 4) + 2);
  }

  private getRandomSpecifications(): any {
    return {
      hydraulic_system: {
        pump_capacity: Math.round((Math.random() * 100 + 50) * 100) / 100,
        working_pressure: Math.floor(Math.random() * 200 + 150)
      },
      electronics: {
        gps_ready: Math.random() > 0.5,
        display_type: ['LCD', 'LED', 'OLED'][Math.floor(Math.random() * 3)],
        auto_steering: Math.random() > 0.7
      },
      transmission: {
        type: ['механическая', 'гидростатическая', 'вариаторная'][Math.floor(Math.random() * 3)],
        gears_count: Math.floor(Math.random() * 20) + 8
      }
    };
  }

  private getRandomAttachments(): any {
    return {
      included: this.getRandomArrayItems(['основная рама', 'гидроцилиндры', 'рабочие органы'], 2),
      optional: this.getRandomArrayItems(['GPS-навигация', 'система автовождения', 'дополнительное освещение'], 1),
      compatible: this.getRandomArrayItems(['фронтальный погрузчик', 'культиватор', 'борона'], 1)
    };
  }

  private getRandomCertifications(): string[] {
    const certs = ['CE', 'ISO_9001', 'GOST', 'EPA', 'Stage_V', 'OECD'];
    return this.getRandomArrayItems(certs, Math.floor(Math.random() * 3) + 1);
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

export const generateTestData = async (apiBaseUrl?: string): Promise<Partial<EquipmentData>> => {
  const generator = createTestDataGenerator({ apiBaseUrl });
  return generator.generateEquipmentData();
};

// Экспорт для использования в тестах
export const TestDataGeneratorUtils = {
  /**
   * Валидирует структуру данных техники
   */
  validateEquipmentData: (equipment: any): equipment is EquipmentData => {
    return equipment && 
           typeof equipment.name === 'string' &&
           typeof equipment.category === 'string';
  },

  /**
   * Создает mock данные техники для тестов
   */
  createMockEquipment: (id: number, name: string): Partial<EquipmentData> => ({
    id,
    name,
    category: 'почвообработка',
    engine_power: 100 + id,
    is_active: true
  })
}; 
