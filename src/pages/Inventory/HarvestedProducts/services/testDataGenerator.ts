// src/pages/Inventory/HarvestedProducts/services/testDataGenerator.ts

import { testDataConfig } from '../config/testDataAIScript';
import { HarvestedProductData } from '../hooks/useHarvestedProductEdit';
import { AIDataGeneratorService, AIGeneratorOptions } from '../../../../services/AIDataGeneratorService';

export interface TestDataGeneratorOptions extends AIGeneratorOptions {}

/**
 * Специализированный сервис для генерации тестовых данных урожайной продукции
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
   * Генерирует тестовые данные урожайной продукции
   * @returns сгенерированные данные урожайной продукции
   */
  async generateHarvestedProductData(): Promise<Partial<HarvestedProductData>> {
    console.log('🎯 TestDataGenerator: Начинаем генерацию тестовых данных урожайной продукции...');

    this.updateStatus('Генерируем тестовые данные урожайной продукции...');

    try {
      // Используем универсальный AI сервис для генерации текстовых полей
      const generatedData = await this.aiGenerator.generateData(testDataConfig.harvestedProduct);
      
      if (generatedData.length === 0) {
        throw new Error('AI не сгенерировал данные');
      }

      const aiData = generatedData[0];
      
      // Подготавливаем полные данные урожайной продукции (AI + наши числовые поля)
      const harvestedProductData: Partial<HarvestedProductData> = {
        // Данные от AI
        product_name: aiData.product_name,
        field_name: aiData.field_name,
        harvest_conditions: aiData.harvest_conditions,
        storage_conditions: aiData.storage_conditions,
        processing_recommendations: aiData.processing_recommendations,
        lab_certificate_number: aiData.lab_certificate_number,
        notes: aiData.notes,
        
        // Числовые и фиксированные поля генерируем сами
        harvest_date: this.getRandomHarvestDate(),
        harvest_area: this.getRandomHarvestArea(),
        quantity: this.getRandomQuantity(),
        moisture_content: this.getRandomMoistureContent(),
        protein_content: this.getRandomProteinContent(),
        oil_content: this.getRandomOilContent(),
        gluten_content: this.getRandomGlutenContent(),
        sugar_content: this.getRandomSugarContent(),
        starch_content: this.getRandomStarchContent(),
        impurities: this.getRandomImpurities(),
        damaged_grains: this.getRandomDamagedGrains(),
        test_weight: this.getRandomTestWeight(),
        quality_class: this.getRandomQualityClass(),
        grade: this.getRandomGrade(),
        storage_date: this.getRandomStorageDate(),
        production_cost: this.getRandomProductionCost(),
        production_cost_per_unit: this.getRandomProductionCostPerUnit(),
        market_price_at_harvest: this.getRandomMarketPrice(),
        current_market_price: this.getRandomCurrentMarketPrice(),
        lab_analysis_date: this.getRandomLabAnalysisDate(),
        additional_indicators: this.getRandomAdditionalIndicators(),
        quantity_sold: this.getRandomQuantitySold(),
        quantity_processed: this.getRandomQuantityProcessed(),
        quantity_reserved: this.getRandomQuantityReserved(),
        quantity_damaged: this.getRandomQuantityDamaged(),
        status: this.getRandomStatus(),
        rating: this.getRandomRating(),
        tags: this.getRandomTags(),
        storage_location_id: this.getRandomStorageLocationId(),
        planting_id: this.getRandomPlantingId(),
        planting_material_id: this.getRandomPlantingMaterialId(),
        is_active: true
      };

      this.updateStatus('Тестовые данные урожайной продукции успешно сгенерированы');
      console.log('✅ TestDataGenerator: Данные урожайной продукции успешно сгенерированы');

      return harvestedProductData;

    } catch (err) {
      const errorMessage = `Ошибка генерации тестовых данных урожайной продукции: ${err}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Методы генерации отдельных полей
  private getRandomHarvestDate(): string {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 5, 1); // 1 июня
    const endDate = new Date(year, 10, 30); // 30 ноября
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  }

  private getRandomStorageDate(): string {
    const harvestDate = new Date(this.getRandomHarvestDate());
    const storageDate = new Date(harvestDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // До 30 дней после сбора
    return storageDate.toISOString().split('T')[0];
  }

  private getRandomLabAnalysisDate(): string {
    const harvestDate = new Date(this.getRandomHarvestDate());
    const analysisDate = new Date(harvestDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // До 7 дней после сбора
    return analysisDate.toISOString().split('T')[0];
  }

  private getRandomHarvestArea(): number {
    return Math.round((Math.random() * 500 + 10) * 100) / 100; // 10-510 га
  }

  private getRandomQuantity(): number {
    return Math.round((Math.random() * 2000 + 50) * 1000) / 1000; // 50-2050 тонн
  }

  private getRandomMoistureContent(): number {
    return Math.round((Math.random() * 20 + 8) * 100) / 100; // 8-28%
  }

  private getRandomProteinContent(): number {
    return Math.round((Math.random() * 15 + 8) * 100) / 100; // 8-23%
  }

  private getRandomOilContent(): number {
    return Math.round((Math.random() * 40 + 15) * 100) / 100; // 15-55%
  }

  private getRandomGlutenContent(): number {
    return Math.round((Math.random() * 20 + 18) * 100) / 100; // 18-38%
  }

  private getRandomSugarContent(): number {
    return Math.round((Math.random() * 10 + 12) * 100) / 100; // 12-22%
  }

  private getRandomStarchContent(): number {
    return Math.round((Math.random() * 20 + 60) * 100) / 100; // 60-80%
  }

  private getRandomImpurities(): number {
    return Math.round((Math.random() * 3 + 0.5) * 100) / 100; // 0.5-3.5%
  }

  private getRandomDamagedGrains(): number {
    return Math.round((Math.random() * 5 + 1) * 100) / 100; // 1-6%
  }

  private getRandomTestWeight(): number {
    return Math.round((Math.random() * 100 + 650) * 10) / 10; // 650-750 г/л
  }

  private getRandomQualityClass(): string {
    const classes = ['1', '2', '3', '4', 'extra', 'feed'];
    return classes[Math.floor(Math.random() * classes.length)];
  }

  private getRandomGrade(): string {
    const grades = ['A', 'B', 'C', 'D', 'premium', 'standard', 'commercial'];
    return grades[Math.floor(Math.random() * grades.length)];
  }

  private getRandomProductionCost(): number {
    return Math.round((Math.random() * 500000 + 100000) * 100) / 100; // 100,000-600,000 руб
  }

  private getRandomProductionCostPerUnit(): number {
    return Math.round((Math.random() * 15000 + 5000) * 100) / 100; // 5,000-20,000 руб/т
  }

  private getRandomMarketPrice(): number {
    return Math.round((Math.random() * 20000 + 10000) * 100) / 100; // 10,000-30,000 руб/т
  }

  private getRandomCurrentMarketPrice(): number {
    return Math.round((Math.random() * 25000 + 12000) * 100) / 100; // 12,000-37,000 руб/т
  }

  private getRandomAdditionalIndicators(): any {
    return {
      ash_content: Math.round((Math.random() * 2 + 1) * 100) / 100,
      falling_number: Math.floor(Math.random() * 100 + 200),
      hardness: Math.floor(Math.random() * 20 + 40)
    };
  }

  private getRandomQuantitySold(): number {
    return Math.round((Math.random() * 100 + 0) * 1000) / 1000; // 0-100 тонн
  }

  private getRandomQuantityProcessed(): number {
    return Math.round((Math.random() * 50 + 0) * 1000) / 1000; // 0-50 тонн
  }

  private getRandomQuantityReserved(): number {
    return Math.round((Math.random() * 30 + 0) * 1000) / 1000; // 0-30 тонн
  }

  private getRandomQuantityDamaged(): number {
    return Math.round((Math.random() * 10 + 0) * 1000) / 1000; // 0-10 тонн
  }

  private getRandomStatus(): string {
    const statuses = ['stored', 'processing', 'sold', 'reserved', 'damaged'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getRandomRating(): number {
    return Math.floor(Math.random() * 5) + 1; // 1-5
  }

  private getRandomTags(): string[] {
    const allTags = ['organic', 'gmo_free', 'premium_quality', 'early_harvest', 'late_harvest', 'high_protein', 'export_quality', 'local_variety'];
    return this.getRandomArrayItems(allTags, Math.floor(Math.random() * 4) + 1);
  }

  private getRandomStorageLocationId(): number {
    return Math.floor(Math.random() * 10) + 1; // 1-10
  }

  private getRandomPlantingId(): number {
    return Math.floor(Math.random() * 20) + 1; // 1-20
  }

  private getRandomPlantingMaterialId(): number {
    return Math.floor(Math.random() * 15) + 1; // 1-15
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

export const generateTestData = async (apiBaseUrl?: string): Promise<Partial<HarvestedProductData>> => {
  const generator = createTestDataGenerator({ apiBaseUrl });
  return generator.generateHarvestedProductData();
};

// Экспорт для использования в тестах
export const TestDataGeneratorUtils = {
  /**
   * Валидирует структуру данных урожайной продукции
   */
  validateHarvestedProductData: (product: any): product is HarvestedProductData => {
    return product && 
           typeof product.product_name === 'string' &&
           typeof product.harvest_date === 'string' &&
           typeof product.quantity === 'number';
  },

  /**
   * Создает mock данные урожайной продукции для тестов
   */
  createMockHarvestedProduct: (id: number, productName: string): Partial<HarvestedProductData> => ({
    id,
    product_name: productName,
    harvest_date: new Date().toISOString().split('T')[0],
    quantity: 100 + id,
    is_active: true
  })
}; 
