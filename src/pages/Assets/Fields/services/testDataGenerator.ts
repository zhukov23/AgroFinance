// src/pages/Assets/Fields/services/testDataGenerator.ts

import { testDataConfig } from '../config/testDataAIScript';
import { FieldData } from '../hooks/useFieldEdit';
import { AIDataGeneratorService, AIGeneratorOptions } from '../../../../services/AIDataGeneratorService';

export interface TestDataGeneratorOptions extends AIGeneratorOptions {}

/**
 * Специализированный сервис для генерации тестовых данных полей
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
   * Генерирует тестовые данные поля
   * @returns сгенерированные данные поля
   */
  async generateFieldData(): Promise<Partial<FieldData>> {
    console.log('🎯 TestDataGenerator: Начинаем генерацию тестовых данных поля...');

    this.updateStatus('Генерируем тестовые данные поля...');

    try {
      // Используем универсальный AI сервис для генерации текстовых полей
      const generatedData = await this.aiGenerator.generateData(testDataConfig.field);
      
      if (generatedData.length === 0) {
        throw new Error('AI не сгенерировал данные');
      }

      const aiData = generatedData[0];
      
      // Подготавливаем полные данные поля (AI + наши числовые поля)
      const fieldData: Partial<FieldData> = {
        // Данные от AI
        field_name: aiData.field_name,
        field_code: aiData.field_code,
        cadastral_number: aiData.cadastral_number,
        notes: aiData.notes,
        
        // Числовые и фиксированные поля генерируем сами
        area_hectares: this.getRandomArea(),
        soil_type: this.getRandomSoilType(),
        soil_quality_score: this.getRandomSoilQuality(),
        irrigation_type: this.getRandomIrrigationType(),
        field_status: this.getRandomFieldStatus(),
        location: this.getRandomLocation(),
        boundaries: this.getRandomBoundaries(),
        soil_analysis: this.getRandomSoilAnalysis(),
        terrain_features: this.getRandomTerrainFeatures(),
        infrastructure: this.getRandomInfrastructure(),
        ownership_documents: this.getRandomOwnershipDocuments(),
        restrictions: this.getRandomRestrictions(),
        special_features: this.getRandomSpecialFeatures(),
        usage_history: this.getRandomUsageHistory(),
        is_active: true
      };

      this.updateStatus('Тестовые данные поля успешно сгенерированы');
      console.log('✅ TestDataGenerator: Данные поля успешно сгенерированы');

      return fieldData;

    } catch (err) {
      const errorMessage = `Ошибка генерации тестовых данных поля: ${err}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Методы генерации отдельных полей
  private getRandomArea(): number {
    return Math.round((Math.random() * 500 + 10) * 10000) / 10000; // 10-510 га
  }

private getRandomSoilType(): string {
  const soilTypes = ['чернозем', 'суглинок', 'супесь', 'песчаная', 'глинистая', 'торфяная', 'другая'];
  return soilTypes[Math.floor(Math.random() * soilTypes.length)];
}

private getRandomIrrigationType(): string {
  const irrigationTypes = ['отсутствует', 'капельное', 'дождевание', 'поверхностное', 'подпочвенное'];
  return irrigationTypes[Math.floor(Math.random() * irrigationTypes.length)];
}

private getRandomFieldStatus(): string {
  const statuses = ['активное', 'под_паром', 'в_севообороте', 'временно_неиспользуемое', 'подготовка_к_обработке'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}
  private getRandomSoilQuality(): number {
    return Math.floor(Math.random() * 10) + 1; // 1-10
  }


  private getRandomLocation(): any {
    const lat = 55.7558 + (Math.random() - 0.5) * 2; // Примерно Москва ±1°
    const lng = 37.6176 + (Math.random() - 0.5) * 2;
    
    return {
      lat: Math.round(lat * 1000000) / 1000000,
      lng: Math.round(lng * 1000000) / 1000000,
      address: `Поле в ${Math.floor(Math.random() * 50 + 10)} км от центра`
    };
  }

  private getRandomBoundaries(): any {
    const centerLat = 55.7558 + (Math.random() - 0.5) * 2;
    const centerLng = 37.6176 + (Math.random() - 0.5) * 2;
    const size = 0.01; // Примерный размер поля
    
    return {
      type: 'Polygon',
      coordinates: [[
        [centerLng - size, centerLat - size],
        [centerLng + size, centerLat - size],
        [centerLng + size, centerLat + size],
        [centerLng - size, centerLat + size],
        [centerLng - size, centerLat - size]
      ]]
    };
  }

  private getRandomSoilAnalysis(): any {
    return {
      ph: Math.round((Math.random() * 3 + 5.5) * 100) / 100, // 5.5-8.5
      humus: Math.round((Math.random() * 5 + 2) * 100) / 100, // 2-7%
      N: Math.floor(Math.random() * 100 + 80), // 80-180
      P: Math.floor(Math.random() * 80 + 40), // 40-120
      K: Math.floor(Math.random() * 120 + 100), // 100-220
      analysis_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  private getRandomTerrainFeatures(): any {
    const reliefTypes = ['равнинный', 'холмистый', 'склон', 'низина', 'возвышенность'];
    const drainageTypes = ['хороший', 'удовлетворительный', 'плохой', 'заболоченный'];
    
    return {
      relief: reliefTypes[Math.floor(Math.random() * reliefTypes.length)],
      slope: Math.round(Math.random() * 15 * 100) / 100, // 0-15°
      drainage: drainageTypes[Math.floor(Math.random() * drainageTypes.length)],
      elevation: Math.floor(Math.random() * 300 + 100) // 100-400 м
    };
  }

  private getRandomInfrastructure(): any {
    const roadTypes = ['асфальтированная', 'грунтовая', 'щебеночная', 'полевая'];
    const waterSources = ['скважина', 'колодец', 'река', 'пруд', 'водопровод'];
    
    return {
      roads: this.getRandomArrayItems(roadTypes, Math.floor(Math.random() * 2) + 1),
      water_sources: this.getRandomArrayItems(waterSources, Math.floor(Math.random() * 2) + 1),
      power_lines: Math.random() > 0.6,
      storage_buildings: Math.random() > 0.7
    };
  }

  private getRandomOwnershipDocuments(): any {
    return {
      ownership_type: ['собственность', 'аренда', 'субаренда'][Math.floor(Math.random() * 3)],
      registration_date: new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      document_number: `${Math.floor(Math.random() * 90000 + 10000)}`,
      valid_until: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
    };
  }

  private getRandomRestrictions(): any {
    const restrictionTypes = ['экологические', 'санитарные', 'охранные_зоны', 'водоохранные', 'газопровод'];
    
    if (Math.random() > 0.6) {
      return {
        types: this.getRandomArrayItems(restrictionTypes, Math.floor(Math.random() * 2) + 1),
        description: 'Ограничения использования согласно законодательству'
      };
    }
    
    return null;
  }

  private getRandomSpecialFeatures(): any {
    const features = ['эрозия', 'заболоченность', 'каменистость', 'близость_воды', 'ветрозащита'];
    
    if (Math.random() > 0.5) {
      return {
        features: this.getRandomArrayItems(features, Math.floor(Math.random() * 2) + 1),
        severity: ['низкая', 'средняя', 'высокая'][Math.floor(Math.random() * 3)]
      };
    }
    
    return null;
  }

  private getRandomUsageHistory(): any {
    const crops = ['пшеница', 'ячмень', 'кукуруза', 'подсолнечник', 'соя', 'рапс', 'пар'];
    const currentYear = new Date().getFullYear();
    
    return {
      recent_crops: this.getRandomArrayItems(crops, Math.floor(Math.random() * 3) + 1),
      years: [currentYear - 1, currentYear - 2, currentYear - 3],
      yield_history: {
        [currentYear - 1]: Math.round((Math.random() * 40 + 20) * 100) / 100,
        [currentYear - 2]: Math.round((Math.random() * 40 + 20) * 100) / 100,
        [currentYear - 3]: Math.round((Math.random() * 40 + 20) * 100) / 100
      }
    };
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

export const generateTestData = async (apiBaseUrl?: string): Promise<Partial<FieldData>> => {
  const generator = createTestDataGenerator({ apiBaseUrl });
  return generator.generateFieldData();
};

// Экспорт для использования в тестах
export const TestDataGeneratorUtils = {
  /**
   * Валидирует структуру данных поля
   */
  validateFieldData: (field: any): field is FieldData => {
    return field && 
           typeof field.field_name === 'string' &&
           typeof field.area_hectares === 'number' &&
           typeof field.soil_type === 'string';
  },

  /**
   * Создает mock данные поля для тестов
   */
  createMockField: (id: number, name: string): Partial<FieldData> => ({
    id,
    field_name: name,
    area_hectares: 100 + id,
    soil_type: 'чернозем',
    is_active: true
  })
}; 
