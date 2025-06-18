// src/pages/References/Pesticides/services/testDataGenerator.ts

import { testDataConfig } from '../config/testDataAIScript';
import { PesticideData } from '../hooks/usePesticideEdit';
import { AIDataGeneratorService, AIGeneratorOptions } from '../../../../services/AIDataGeneratorService';

export interface TestDataGeneratorOptions extends AIGeneratorOptions {}

/**
 * Специализированный сервис для генерации тестовых данных пестицидов
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
   * Генерирует тестовые данные пестицида
   * @returns сгенерированные данные пестицида
   */
  async generatePesticideData(): Promise<Partial<PesticideData>> {
    console.log('🎯 TestDataGenerator: Начинаем генерацию тестовых данных пестицида...');

    this.updateStatus('Генерируем тестовые данные пестицида...');

    try {
      // Используем универсальный AI сервис для генерации текстовых полей
      const generatedData = await this.aiGenerator.generateData(testDataConfig.pesticide);
      
      if (generatedData.length === 0) {
        throw new Error('AI не сгенерировал данные');
      }

      const aiData = generatedData[0];
      
      // Подготавливаем полные данные пестицида (AI + наши фиксированные поля)
      const pesticideData: Partial<PesticideData> = {
        // Данные от AI
        name: aiData.name,
        trade_name: aiData.trade_name,
        registration_number: aiData.registration_number,
        application_method: aiData.application_method,
        storage_conditions: aiData.storage_conditions,
        safety_precautions: aiData.safety_precautions,
        antidote_info: aiData.antidote_info,
        price_per_unit: aiData.price_per_unit,
        package_unit: aiData.package_unit,
        registration_authority: aiData.registration_authority,
        notes: aiData.notes,
        
        // Фиксированные поля генерируем сами
        pesticide_type: this.getRandomPesticideType(),
        hazard_class: this.getRandomHazardClass(),
        physical_form: this.getRandomPhysicalForm(),
        active_substances: this.getRandomActiveSubstances(),
        concentration_info: this.getRandomConcentrationInfo(),
        target_pests: this.getRandomTargetPests(),
        target_crops: this.getRandomTargetCrops(),
        dosage_info: this.getRandomDosageInfo(),
        registration_status: this.getRandomRegistrationStatus(),
        registration_date: this.getRandomRegistrationDate(),
        expiry_date: this.getRandomExpiryDate(),
        base_price: this.getRandomBasePrice(),
        currency_code: this.getRandomCurrencyCode(),
        package_size: this.getRandomPackageSize(),
        shelf_life_months: this.getRandomShelfLife(),
        ph_range: this.getRandomPhRange(),
        temperature_range: this.getRandomTemperatureRange(),
        compatibility_info: this.getRandomCompatibilityInfo(),
        certificates: this.getRandomCertificates(),
        documents: this.getRandomDocuments(),
        is_active: true
      };

      this.updateStatus('Тестовые данные пестицида успешно сгенерированы');
      console.log('✅ TestDataGenerator: Данные пестицида успешно сгенерированы');

      return pesticideData;

    } catch (err) {
      const errorMessage = `Ошибка генерации тестовых данных пестицида: ${err}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Методы генерации отдельных полей
  private getRandomPesticideType(): string {
    const types = ['herbicide', 'fungicide', 'insecticide', 'acaricide', 'nematicide', 'rodenticide', 'growth_regulator', 'adjuvant', 'biocide', 'combination'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomHazardClass(): string {
    const classes = ['I', 'II', 'III', 'IV'];
    return classes[Math.floor(Math.random() * classes.length)];
  }

  private getRandomPhysicalForm(): string {
    const forms = ['liquid', 'powder', 'granules', 'emulsion', 'suspension', 'tablets', 'capsules', 'gel', 'aerosol'];
    return forms[Math.floor(Math.random() * forms.length)];
  }

  private getRandomActiveSubstances(): any[] {
    const substances = [
      { substance: 'глифосат', concentration: Math.round(Math.random() * 50 + 20), unit: '%' },
      { substance: '2,4-Д', concentration: Math.round(Math.random() * 30 + 10), unit: '%' },
      { substance: 'имидаклоприд', concentration: Math.round(Math.random() * 20 + 5), unit: '%' },
      { substance: 'тебуконазол', concentration: Math.round(Math.random() * 15 + 5), unit: '%' }
    ];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 вещества
    return substances.slice(0, count);
  }

  private getRandomConcentrationInfo(): any {
    return {
      total_concentration: Math.round(Math.random() * 80 + 20),
      unit: '%',
      formulation_type: ['концентрат эмульсии', 'водный раствор', 'суспензионный концентрат'][Math.floor(Math.random() * 3)]
    };
  }

  private getRandomTargetPests(): any[] {
    const pests = [
      { pest: 'сорняки', effectiveness: 'высокая' },
      { pest: 'колорадский жук', effectiveness: 'высокая' },
      { pest: 'тля', effectiveness: 'средняя' },
      { pest: 'паутинный клещ', effectiveness: 'высокая' },
      { pest: 'мучнистая роса', effectiveness: 'высокая' }
    ];
    const count = Math.floor(Math.random() * 3) + 1;
    return pests.slice(0, count);
  }

  private getRandomTargetCrops(): any[] {
    const crops = [
      { crop: 'пшеница', growth_stage: 'всходы' },
      { crop: 'кукуруза', growth_stage: 'вегетация' },
      { crop: 'подсолнечник', growth_stage: 'цветение' },
      { crop: 'соя', growth_stage: 'бутонизация' },
      { crop: 'картофель', growth_stage: 'всходы' }
    ];
    const count = Math.floor(Math.random() * 3) + 1;
    return crops.slice(0, count);
  }

  private getRandomDosageInfo(): any {
    const minDose = Math.round((Math.random() * 2 + 0.5) * 100) / 100;
    const maxDose = Math.round((minDose + Math.random() * 2) * 100) / 100;
    return {
      min_dose: minDose,
      max_dose: maxDose,
      unit: ['л/га', 'кг/га', 'г/га'][Math.floor(Math.random() * 3)]
    };
  }

  private getRandomRegistrationStatus(): string {
    const statuses = ['active', 'expired', 'suspended', 'cancelled'];
    const weights = [0.7, 0.15, 0.1, 0.05]; // больше вероятность для active
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) return statuses[i];
    }
    return statuses[0];
  }

  private getRandomRegistrationDate(): string {
    const start = new Date(2015, 0, 1);
    const end = new Date(2024, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  }

  private getRandomExpiryDate(): string {
    const start = new Date(2025, 0, 1);
    const end = new Date(2030, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  }

  private getRandomBasePrice(): number {
    return Math.round((Math.random() * 50000 + 1000) * 100) / 100; // 1000-51000 руб
  }

  private getRandomCurrencyCode(): string {
    const currencies = ['RUB', 'USD', 'EUR'];
    const weights = [0.8, 0.15, 0.05]; // больше вероятность для RUB
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) return currencies[i];
    }
    return currencies[0];
  }

  private getRandomPackageSize(): number {
    const sizes = [0.1, 0.25, 0.5, 1, 5, 10, 20, 200, 1000];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  private getRandomShelfLife(): number {
    const months = [12, 18, 24, 36, 48, 60];
    return months[Math.floor(Math.random() * months.length)];
  }

  private getRandomPhRange(): any {
    const minPh = Math.round((Math.random() * 3 + 5) * 10) / 10; // 5.0-8.0
    const maxPh = Math.round((minPh + Math.random() * 2) * 10) / 10;
    return {
      min: minPh,
      max: maxPh
    };
  }

  private getRandomTemperatureRange(): any {
    const minTemp = Math.floor(Math.random() * 10); // 0-9°C
    const maxTemp = Math.floor(Math.random() * 15 + 20); // 20-34°C
    return {
      min: minTemp,
      max: maxTemp,
      unit: '°C'
    };
  }

  private getRandomCompatibilityInfo(): any {
    const compatible = ['медные препараты', 'органические инсектициды', 'стимуляторы роста'];
    const incompatible = ['щелочные препараты', 'масляные растворы'];
    return {
      compatible_with: compatible.slice(0, Math.floor(Math.random() * 2) + 1),
      incompatible_with: incompatible.slice(0, Math.floor(Math.random() * 2))
    };
  }

  private getRandomCertificates(): any {
    const certs = [
      { type: 'GMP', number: `GMP-${Math.floor(Math.random() * 9000) + 1000}`, valid_until: '2026-12-31' },
      { type: 'ISO 9001', number: `ISO-${Math.floor(Math.random() * 9000) + 1000}`, valid_until: '2027-06-30' }
    ];
    return certs.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private getRandomDocuments(): any {
    return {
      safety_sheet: `safety_sheet_${Math.floor(Math.random() * 1000)}.pdf`,
      instruction: `instruction_${Math.floor(Math.random() * 1000)}.pdf`,
      certificate: `certificate_${Math.floor(Math.random() * 1000)}.pdf`
    };
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

export const generateTestData = async (apiBaseUrl?: string): Promise<Partial<PesticideData>> => {
  const generator = createTestDataGenerator({ apiBaseUrl });
  return generator.generatePesticideData();
};

// Экспорт для использования в тестах
export const TestDataGeneratorUtils = {
  /**
   * Валидирует структуру данных пестицида
   */
  validatePesticideData: (pesticide: any): pesticide is PesticideData => {
    return pesticide && 
           typeof pesticide.name === 'string' &&
           typeof pesticide.pesticide_type === 'string' &&
           typeof pesticide.hazard_class === 'string';
  },

  /**
   * Создает mock данные пестицида для тестов
   */
  createMockPesticide: (id: number, name: string): Partial<PesticideData> => ({
    id,
    name,
    pesticide_type: 'herbicide',
    hazard_class: 'III',
    physical_form: 'liquid',
    active_substances: [],
    is_active: true
  })
}; 
