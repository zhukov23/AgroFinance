// src/pages/References/PlantingMaterials/services/testDataGenerator.ts

import { testDataConfig } from '../config/testDataAIScript';
import { PlantingMaterialData } from '../hooks/usePlantingMaterialEdit';
import { AIDataGeneratorService, AIGeneratorOptions } from '../../../../services/AIDataGeneratorService';

export interface TestDataGeneratorOptions extends AIGeneratorOptions {}

/**
 * Специализированный сервис для генерации тестовых данных посевного материала
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
   * Генерирует тестовые данные посевного материала
   * @returns сгенерированные данные посевного материала
   */
  async generatePlantingMaterialData(): Promise<Partial<PlantingMaterialData>> {
    console.log('🎯 TestDataGenerator: Начинаем генерацию тестовых данных посевного материала...');

    this.updateStatus('Генерируем тестовые данные посевного материала...');

    try {
      // Используем универсальный AI сервис для генерации текстовых полей
      const generatedData = await this.aiGenerator.generateData(testDataConfig.plantingMaterial);
      
      if (generatedData.length === 0) {
        throw new Error('AI не сгенерировал данные');
      }

      const aiData = generatedData[0];
      
      // Подготавливаем полные данные посевного материала (AI + наши числовые поля)
      const plantingMaterialData: Partial<PlantingMaterialData> = {
        // Данные от AI
        name: aiData.name,
        scientific_name: aiData.scientific_name,
        variety: aiData.variety,
        origin_country: aiData.origin_country,
        breeder: aiData.breeder,
        description: aiData.description,
        cultivation_notes: aiData.cultivation_notes,
        storage_requirements: aiData.storage_requirements,
        notes: aiData.notes,
        
        // Числовые и фиксированные поля генерируем сами
        material_type: this.getRandomMaterialType(),
        crop_category: this.getRandomCropCategory(),
        season_type: this.getRandomSeasonType(),
        maturity_days: this.getRandomMaturityDays(),
        planting_rate: this.getRandomPlantingRate(),
        planting_depth: this.getRandomPlantingDepth(),
        row_spacing: this.getRandomRowSpacing(),
        plant_spacing: this.getRandomPlantSpacing(),
        potential_yield: this.getRandomPotentialYield(),
        recommended_soil_types: this.getRandomSoilTypes(),
        ph_range_min: this.getRandomPhMin(),
        ph_range_max: this.getRandomPhMax(),
        frost_resistance: this.getRandomResistance(),
        drought_tolerance: this.getRandomResistance(),
        water_requirement: this.getRandomWaterRequirement(),
        planting_period_start: this.getRandomPlantingStart(),
        planting_period_end: this.getRandomPlantingEnd(),
        harvest_period_start: this.getRandomHarvestStart(),
        harvest_period_end: this.getRandomHarvestEnd(),
        disease_resistance: this.getRandomDiseaseResistance(),
        pest_resistance: this.getRandomPestResistance(),
        shelf_life_months: this.getRandomShelfLife(),
        status: this.getRandomStatus(),
        rating: this.getRandomRating(),
        tags: this.getRandomTags(),
        manufacturer_id: this.getRandomManufacturerId(),
        is_active: true
      };

      this.updateStatus('Тестовые данные посевного материала успешно сгенерированы');
      console.log('✅ TestDataGenerator: Данные посевного материала успешно сгенерированы');

      return plantingMaterialData;

    } catch (err) {
      const errorMessage = `Ошибка генерации тестовых данных посевного материала: ${err}`;
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Методы генерации отдельных полей (обновленные для соответствия ENUM в БД)
  private getRandomMaterialType(): string {
    const types = ['seeds', 'seedlings', 'transplants', 'cuttings', 'bulbs_tubers', 'rhizomes'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomCropCategory(): string {
    const categories = ['cereals', 'legumes', 'oilseeds', 'vegetables', 'fruits', 'berries', 'technical', 'forage', 'ornamental'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private getRandomSeasonType(): string {
    const seasons = ['winter', 'spring', 'summer', 'autumn', 'perennial'];
    return seasons[Math.floor(Math.random() * seasons.length)];
  }

  private getRandomWaterRequirement(): string {
    const requirements = ['low', 'medium', 'high'];
    return requirements[Math.floor(Math.random() * requirements.length)];
  }

  private getRandomMaturityDays(): number {
    return this.getRandomNumber(60, 180);
  }

  private getRandomPlantingRate(): number {
    return Math.round((Math.random() * 200 + 10) * 100) / 100; // 10-210 кг/га
  }

  private getRandomPlantingDepth(): number {
    return Math.round((Math.random() * 8 + 1) * 100) / 100; // 1-9 см
  }

  private getRandomRowSpacing(): number {
    return Math.round((Math.random() * 40 + 10) * 100) / 100; // 10-50 см
  }

  private getRandomPlantSpacing(): number {
    return Math.round((Math.random() * 20 + 2) * 100) / 100; // 2-22 см
  }

  private getRandomPotentialYield(): number {
    return Math.round((Math.random() * 100 + 20) * 100) / 100; // 20-120 ц/га
  }

  private getRandomSoilTypes(): string[] {
    const soils = ['chernozem', 'clay', 'sandy', 'loamy', 'peat', 'silt'];
    const count = Math.floor(Math.random() * 3) + 1;
    return this.getRandomArrayItems(soils, count);
  }

  private getRandomPhMin(): number {
    return Math.round((Math.random() * 3 + 4) * 100) / 100; // 4.0-7.0
  }

  private getRandomPhMax(): number {
    return Math.round((Math.random() * 3 + 7) * 100) / 100; // 7.0-10.0
  }

  private getRandomResistance(): number {
    return Math.floor(Math.random() * 10) + 1; // 1-10
  }

  private getRandomPlantingStart(): string {
    const months = ['03-01', '04-01', '05-01', '09-01', '10-01'];
    return months[Math.floor(Math.random() * months.length)];
  }

  private getRandomPlantingEnd(): string {
    const months = ['04-30', '05-31', '06-30', '10-31', '11-30'];
    return months[Math.floor(Math.random() * months.length)];
  }

  private getRandomHarvestStart(): string {
    const months = ['07-01', '08-01', '09-01', '10-01'];
    return months[Math.floor(Math.random() * months.length)];
  }

  private getRandomHarvestEnd(): string {
    const months = ['08-31', '09-30', '10-31', '11-30'];
    return months[Math.floor(Math.random() * months.length)];
  }

  private getRandomDiseaseResistance(): string[] {
    const diseases = ['мучнистая_роса', 'фитофтороз', 'корневая_гниль', 'ржавчина', 'черная_ножка', 'серая_гниль'];
    return this.getRandomArrayItems(diseases, Math.floor(Math.random() * 3) + 1);
  }

  private getRandomPestResistance(): string[] {
    const pests = ['тля', 'колорадский_жук', 'проволочник', 'медведка', 'белокрылка', 'трипсы'];
    return this.getRandomArrayItems(pests, Math.floor(Math.random() * 2) + 1);
  }

  private getRandomShelfLife(): number {
    return Math.floor(Math.random() * 36) + 12; // 12-48 месяцев
  }

  private getRandomStatus(): string {
    const statuses = ['active', 'discontinued', 'seasonal', 'trial'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getRandomRating(): number {
    return Math.floor(Math.random() * 5) + 1; // 1-5
  }

  private getRandomTags(): string[] {
    const allTags = ['gmo_free', 'organic', 'hybrid', 'early_ripening', 'high_yield', 'disease_resistant', 'drought_tolerant', 'frost_resistant'];
    return this.getRandomArrayItems(allTags, Math.floor(Math.random() * 4) + 1);
  }

  private getRandomManufacturerId(): number {
    // Генерируем случайный ID производителя от 1 до 10 (предполагаем что есть производители)
    return Math.floor(Math.random() * 10) + 1;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

export const generateTestData = async (apiBaseUrl?: string): Promise<Partial<PlantingMaterialData>> => {
  const generator = createTestDataGenerator({ apiBaseUrl });
  return generator.generatePlantingMaterialData();
};

// Экспорт для использования в тестах
export const TestDataGeneratorUtils = {
  /**
   * Валидирует структуру данных посевного материала
   */
  validatePlantingMaterialData: (material: any): material is PlantingMaterialData => {
    return material && 
           typeof material.name === 'string' &&
           typeof material.material_type === 'string' &&
           typeof material.crop_category === 'string';
  },

  /**
   * Создает mock данные посевного материала для тестов
   */
  createMockPlantingMaterial: (id: number, name: string): Partial<PlantingMaterialData> => ({
    id,
    name,
    material_type: 'seeds',
    crop_category: 'cereals',
    variety: `Сорт ${id}`,
    maturity_days: 90 + id,
    is_active: true
  })
};