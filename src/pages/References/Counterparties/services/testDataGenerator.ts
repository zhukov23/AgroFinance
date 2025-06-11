// src/pages/References/Counterparties/services/testDataGenerator.ts

import { testDataConfig } from '../config/testDataAIScript';
import { CounterpartyData, BankAccountData } from '../hooks/useCounterpartyEdit';
import { AIDataGeneratorService, AIGeneratorOptions } from '../../../../services/AIDataGeneratorService';

export interface TestDataGeneratorOptions extends AIGeneratorOptions {}

export interface BankInfo {
  id: number;
  name: string;
  bik: string;
  correspondent_account: string;
  address: string;
  swift_code: string;
}

export interface GeneratedTestData {
  counterparty: Partial<CounterpartyData>;
  bankAccounts: Omit<BankAccountData, 'id' | 'organization_id'>[];
}

/**
 * Специализированный сервис для генерации тестовых данных контрагентов
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
   * Генерирует тестовые данные контрагента
   * @param availableBanks - массив доступных банков из справочника
   * @returns сгенерированные данные контрагента и банковских счетов
   */
  async generateCounterpartyData(availableBanks: BankInfo[]): Promise<GeneratedTestData> {
    console.log('🎯 TestDataGenerator: Начинаем генерацию тестовых данных...');
    console.log('📊 Доступно банков:', availableBanks.length);

    this.updateStatus('Генерируем тестовые данные контрагента...');

    // Валидация входных данных
    if (!availableBanks || availableBanks.length === 0) {
      const error = 'Данные банков не доступны для генерации тестовых данных';
      this.handleError(error);
      throw new Error(error);
    }

    try {
      // Используем универсальный AI сервис для генерации
      const generatedData = await this.aiGenerator.generateData(testDataConfig.counterparty);
      
      if (generatedData.length === 0) {
        throw new Error('AI не сгенерировал данные');
      }

      const aiData = generatedData[0];
      
      // Подготавливаем полные данные контрагента (AI + наши числовые поля)
      const counterpartyData: Partial<CounterpartyData> = {
        // Данные от AI
        full_name: aiData.full_name,
        short_name: aiData.short_name,
        address: aiData.address,
        postal_address: aiData.postal_address,
        director_name: aiData.director_name,
        contact_person: aiData.contact_person,
        registration_authority: aiData.registration_authority,
        notes: aiData.notes,
        
        // Числовые и фиксированные поля генерируем сами
        inn: this.generateINN(),
        kpp: this.generateKPP(),
        ogrn: this.generateOGRN(),
        phone: this.generatePhone(),
        email: this.generateEmail(aiData.short_name),
        website: this.generateWebsite(aiData.short_name),
        director_position: 'general_director',
        payment_terms: 'отсрочка 14 дней',
        credit_limit: this.getRandomNumber(500000, 3000000),
        rating: this.getRandomRating(),
        vat_status: 'vat_payer',
        vat_rate: this.getRandomVatRate(),
        okved_code: this.getRandomOKVED(),
        tax_system: 'general',
        registration_date: this.generateRegistrationDate(),
        charter_capital: this.getRandomNumber(100000, 1000000),
        participants_count: this.getRandomNumber(1, 5),
        counterparty_type: this.getRandomCounterpartyTypes(),
        is_active: true
      };

      // Генерируем банковские счета кодом
      const bankAccounts = this.generateBankAccounts(availableBanks);

      this.updateStatus('Тестовые данные успешно сгенерированы');
      console.log('✅ TestDataGenerator: Данные успешно сгенерированы');

      return {
        counterparty: counterpartyData,
        bankAccounts
      };

    } catch (err) {
      const errorMessage = `Ошибка генерации тестовых данных: ${err}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Генерирует банковские счета кодом
   */
  private generateBankAccounts(availableBanks: BankInfo[]): Omit<BankAccountData, 'id' | 'organization_id'>[] {
    const accountsCount = Math.floor(Math.random() * 3) + 1; // 1-3 счета
    const accounts: Omit<BankAccountData, 'id' | 'organization_id'>[] = [];
    
    for (let i = 0; i < accountsCount; i++) {
      const randomBank = availableBanks[Math.floor(Math.random() * availableBanks.length)];
      
      accounts.push({
        bank_id: randomBank.id,
        account_number: this.generateAccountNumber(),
        currency: 'RUB',
        is_primary: i === 0, // Первый счет основной
        is_active: true,
        purpose: 'main',
        opening_date: this.generateOpeningDate(),
        notes: i === 0 ? 'Основной расчетный счет' : 'Дополнительный счет',
        // Данные банка из справочника
        bank_name: randomBank.name,
        bank_bik: randomBank.bik,
        bank_correspondent_account: randomBank.correspondent_account,
        bank_address: randomBank.address,
        bank_swift: randomBank.swift_code
      });
    }
    
    return accounts;
  }

  // Методы генерации отдельных полей
  private generateINN(): string {
    return '77' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  }

  private generateKPP(): string {
    return '771' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }

  private generateOGRN(): string {
    return '1' + Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0');
  }

  private generatePhone(): string {
    const codes = ['495', '499', '916', '926', '985'];
    const code = codes[Math.floor(Math.random() * codes.length)];
    const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `+7 (${code}) ${number.substr(0, 3)}-${number.substr(3, 2)}-${number.substr(5, 2)}`;
  }

  private generateEmail(shortName?: string): string {
    const domains = ['ru', 'com', 'org'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const name = shortName ? shortName.toLowerCase().replace(/[^a-z]/g, '') : 'company';
    return `info@${name}.${domain}`;
  }

  private generateWebsite(shortName?: string): string {
    const name = shortName ? shortName.toLowerCase().replace(/[^a-z]/g, '') : 'company';
    return `https://${name}.ru`;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomRating(): string {
    const ratings = ['excellent', 'good', 'average', 'poor'];
    return ratings[Math.floor(Math.random() * ratings.length)];
  }

  private getRandomOKVED(): string {
    const codes = ['01.11.1', '01.12.1', '01.13.1', '01.14.1', '01.15.1'];
    return codes[Math.floor(Math.random() * codes.length)];
  }

  private getRandomCounterpartyTypes(): string[] {
    const types = [
      ['supplier'],
      ['customer'],
      ['supplier', 'customer'],
      ['contractor'],
      ['supplier', 'contractor']
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  private generateRegistrationDate(): string {
    const start = new Date(2010, 0, 1);
    const end = new Date(2023, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }

  private generateAccountNumber(): string {
    return '407028' + Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0');
  }

  private generateOpeningDate(): string {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }

  /**
   * Обновляет статус генерации
   */
  private updateStatus(status: string): void {
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }
private getRandomVatRate(): string {
  const rates = ["0", "10", "20"];
  return rates[Math.floor(Math.random() * rates.length)];
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

// Остальные экспорты остаются без изменений...
export const createTestDataGenerator = (options?: TestDataGeneratorOptions): TestDataGeneratorService => {
  return new TestDataGeneratorService(options);
};

export const generateTestData = async (
  availableBanks: BankInfo[], 
  apiBaseUrl?: string
): Promise<GeneratedTestData> => {
  const generator = createTestDataGenerator({ apiBaseUrl });
  return generator.generateCounterpartyData(availableBanks);
};

// Экспорт для использования в тестах
export const TestDataGeneratorUtils = {
  /**
   * Валидирует структуру данных банка
   */
  validateBankData: (bank: any): bank is BankInfo => {
    return bank && 
           typeof bank.id !== 'undefined' && 
           typeof bank.name === 'string' &&
           typeof bank.bik === 'string';
  },

  /**
   * Создает mock данные банка для тестов
   */
  createMockBank: (id: number, name: string): BankInfo => ({
    id,
    name,
    bik: `04${String(id).padStart(7, '0')}`,
    correspondent_account: `301018103000000${String(id).padStart(5, '0')}`,
    address: `г. Москва, ул. Банковская, д. ${id}`,
    swift_code: `BANK${String(id).padStart(4, '0')}RU`
  })
};