// src/pages/References/Banks/services/testDataGenerator.ts

import { testDataConfig } from '../config/testDataAIScript';
import { BankData } from '../hooks/useBankEdit';
import { AIDataGeneratorService, AIGeneratorOptions } from '../../../../services/AIDataGeneratorService';

export interface TestDataGeneratorOptions extends AIGeneratorOptions {}

/**
 * Специализированный сервис для генерации тестовых данных банков
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
   * Генерирует тестовые данные банка
   * @returns сгенерированные данные банка
   */
  async generateBankData(): Promise<Partial<BankData>> {
    console.log('🎯 TestDataGenerator: Начинаем генерацию тестовых данных банка...');

    this.updateStatus('Генерируем тестовые данные банка...');

    try {
      // Используем универсальный AI сервис для генерации текстовых полей
      const generatedData = await this.aiGenerator.generateData(testDataConfig.bank);
      
      if (generatedData.length === 0) {
        throw new Error('AI не сгенерировал данные');
      }

      const aiData = generatedData[0];
      
      // Подготавливаем полные данные банка (AI + наши числовые поля)
      const bankData: Partial<BankData> = {
        // Данные от AI
        name: aiData.name,
        short_name: aiData.short_name,
        region: aiData.region,
        address: aiData.address,
        notes: aiData.notes,
        
        // Числовые и фиксированные поля генерируем сами
        bik: this.generateBIK(),
        correspondent_account: this.generateCorrespondentAccount(),
        swift_code: this.generateSwiftCode(aiData.short_name),
        registration_number: this.generateRegistrationNumber(),
        license_number: this.generateLicenseNumber(),
        license_date: this.generateLicenseDate(),
        phone: this.generatePhone(),
        email: this.generateEmail(aiData.short_name),
        website: this.generateWebsite(aiData.short_name),
        status: this.getRandomStatus(),
        rating: this.getRandomRating(),
        tags: this.getRandomTags(),
        is_active: true
      };

      this.updateStatus('Тестовые данные банка успешно сгенерированы');
      console.log('✅ TestDataGenerator: Данные банка успешно сгенерированы');

      return bankData;

    } catch (err) {
      const errorMessage = `Ошибка генерации тестовых данных банка: ${err}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Методы генерации отдельных полей банка
  private generateBIK(): string {
    // БИК: первые 2 цифры - код страны (04), следующие 2 - код региона, последние 5 - номер банка
    const regionCode = this.getRandomNumber(10, 99);
    const bankCode = this.getRandomNumber(10000, 99999);
    return `04${regionCode}${bankCode}`;
  }

  private generateCorrespondentAccount(): string {
    // Корсчет: 20 цифр, начинается с 30101
    const accountNumber = Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
    return `30101${accountNumber}`;
  }

  private generateSwiftCode(shortName?: string): string {
    // SWIFT: 8-11 символов, формат AAAABBCCXXX
    const bankCode = shortName ? 
      shortName.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4).padEnd(4, 'X') : 
      'BANK';
    const countryCode = 'RU';
    const locationCode = this.getRandomNumber(10, 99);
    return `${bankCode}${countryCode}${locationCode}`;
  }

  private generateRegistrationNumber(): string {
    return this.getRandomNumber(1000, 9999).toString();
  }

  private generateLicenseNumber(): string {
    return this.getRandomNumber(10000, 99999).toString();
  }

  private generateLicenseDate(): string {
    const start = new Date(2010, 0, 1);
    const end = new Date(2023, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }

  private generatePhone(): string {
    const codes = ['495', '499', '812', '843', '383'];
    const code = codes[Math.floor(Math.random() * codes.length)];
    const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `+7 (${code}) ${number.substr(0, 3)}-${number.substr(3, 2)}-${number.substr(5, 2)}`;
  }

  private generateEmail(shortName?: string): string {
    const domains = ['ru', 'com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const name = shortName ? 
      shortName.toLowerCase().replace(/[^a-z]/g, '') : 
      'bank';
    return `info@${name}.${domain}`;
  }

  private generateWebsite(shortName?: string): string {
    const name = shortName ? 
      shortName.toLowerCase().replace(/[^a-z]/g, '') : 
      'bank';
    return `https://${name}.ru`;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomStatus(): string {
    const statuses = ['active', 'inactive'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getRandomRating(): string {
    const ratings = ['excellent', 'good', 'average', 'poor'];
    return ratings[Math.floor(Math.random() * ratings.length)];
  }

  private getRandomTags(): string[] {
    const allTags = [
      'системно_значимый', 
      'региональный', 
      'частный', 
      'государственный', 
      'розничный', 
      'корпоративный'
    ];
    
    const tagsCount = Math.floor(Math.random() * 3) + 1; // 1-3 тега
    const selectedTags: string[] = [];
    
    for (let i = 0; i < tagsCount; i++) {
      const remainingTags = allTags.filter(tag => !selectedTags.includes(tag));
      if (remainingTags.length > 0) {
        const randomTag = remainingTags[Math.floor(Math.random() * remainingTags.length)];
        selectedTags.push(randomTag);
      }
    }
    
    return selectedTags;
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

export const generateTestData = async (apiBaseUrl?: string): Promise<Partial<BankData>> => {
  const generator = createTestDataGenerator({ apiBaseUrl });
  return generator.generateBankData();
};

// Экспорт для использования в тестах
export const TestDataGeneratorUtils = {
  /**
   * Валидирует структуру данных банка
   */
  validateBankData: (bank: any): bank is BankData => {
    return bank && 
           typeof bank.name === 'string' &&
           typeof bank.bik === 'string';
  },

  /**
   * Создает mock данные банка для тестов
   */
  createMockBank: (id: number, name: string): Partial<BankData> => ({
    id,
    name,
    short_name: name.replace(/[^a-zA-Zа-яёА-ЯЁ]/g, ''),
    bik: `04${String(id).padStart(7, '0')}`,
    correspondent_account: `301018103000000${String(id).padStart(5, '0')}`,
    address: `г. Москва, ул. Банковская, д. ${id}`,
    swift_code: `BANK${String(id).padStart(4, '0')}RU`,
    is_active: true
  })
}; 
