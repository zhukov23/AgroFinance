export const harvestedProductFormConfig = {
  // Классы качества
  qualityClasses: [
    { value: '1', label: '1 класс (Высший)', color: 'success' },
    { value: '2', label: '2 класс (Первый)', color: 'info' },
    { value: '3', label: '3 класс (Второй)', color: 'warning' },
    { value: '4', label: '4 класс (Третий)', color: 'secondary' },
    { value: 'extra', label: 'Экстра класс', color: 'primary' },
    { value: 'feed', label: 'Кормовой', color: 'dark' }
  ],

  // Сорта/Марки
  grades: [
    { value: 'A', label: 'Сорт A (Высший)' },
    { value: 'B', label: 'Сорт B (Первый)' },
    { value: 'C', label: 'Сорт C (Второй)' },
    { value: 'D', label: 'Сорт D (Третий)' },
    { value: 'premium', label: 'Премиум' },
    { value: 'standard', label: 'Стандарт' },
    { value: 'commercial', label: 'Коммерческий' }
  ],

  // Статусы продукции
  statuses: [
    { value: 'stored', label: '📦 На складе', color: 'success' },
    { value: 'processing', label: '⚙️ В переработке', color: 'warning' },
    { value: 'sold', label: '💰 Продано', color: 'info' },
    { value: 'reserved', label: '🔒 Зарезервировано', color: 'primary' },
    { value: 'damaged', label: '❌ Испорчено', color: 'danger' },
    { value: 'expired', label: '⏰ Просрочено', color: 'dark' }
  ],

  // Рейтинги качества
  ratings: [
    { value: 5, label: '⭐⭐⭐⭐⭐ Отличное' },
    { value: 4, label: '⭐⭐⭐⭐ Хорошее' },
    { value: 3, label: '⭐⭐⭐ Среднее' },
    { value: 2, label: '⭐⭐ Удовлетворительное' },
    { value: 1, label: '⭐ Плохое' }
  ],

  // Условия хранения
  storageConditions: [
    { value: 'temperature_controlled', label: '🌡️ Температурный режим' },
    { value: 'humidity_controlled', label: '💧 Контроль влажности' },
    { value: 'ventilated', label: '🌬️ Вентилируемое' },
    { value: 'sealed', label: '🔒 Герметичное' },
    { value: 'refrigerated', label: '❄️ Охлаждаемое' },
    { value: 'frozen', label: '🧊 Замороженное' },
    { value: 'dry', label: '🏜️ Сухое хранение' },
    { value: 'open_air', label: '🌤️ Открытое' }
  ],

  // Теги для продукции
  commonTags: [
    { value: 'organic', label: '🌿 Органическое', color: 'success' },
    { value: 'gmo_free', label: '🚫 Без ГМО', color: 'success' },
    { value: 'premium_quality', label: '⭐ Премиум качество', color: 'primary' },
    { value: 'early_harvest', label: '⚡ Ранний сбор', color: 'warning' },
    { value: 'late_harvest', label: '🍂 Поздний сбор', color: 'info' },
    { value: 'drought_resistant', label: '🏜️ Засухоустойчивый', color: 'warning' },
    { value: 'high_protein', label: '💪 Высокобелковый', color: 'danger' },
    { value: 'low_moisture', label: '🌵 Низкая влажность', color: 'secondary' },
    { value: 'export_quality', label: '🌍 Экспортное качество', color: 'primary' },
    { value: 'local_variety', label: '🏠 Местный сорт', color: 'info' }
  ],

  // Условия уборки
  harvestConditions: [
    { value: 'optimal', label: '✅ Оптимальные' },
    { value: 'dry_weather', label: '☀️ Сухая погода' },
    { value: 'wet_weather', label: '🌧️ Влажная погода' },
    { value: 'early_morning', label: '🌅 Раннее утро' },
    { value: 'evening', label: '🌇 Вечер' },
    { value: 'emergency', label: '🚨 Экстренная уборка' },
    { value: 'mechanized', label: '🚜 Механизированная' },
    { value: 'manual', label: '👨‍🌾 Ручная' }
  ],

  // Диапазоны влажности (%)
  moistureRanges: [
    { min: 0, max: 10, label: 'Очень сухое (0-10%)', color: 'danger' },
    { min: 10, max: 14, label: 'Сухое (10-14%)', color: 'warning' },
    { min: 14, max: 18, label: 'Оптимальное (14-18%)', color: 'success' },
    { min: 18, max: 25, label: 'Повышенное (18-25%)', color: 'info' },
    { min: 25, max: 100, label: 'Высокое (>25%)', color: 'danger' }
  ],

  // Диапазоны протеина (%)
  proteinRanges: [
    { min: 0, max: 8, label: 'Низкий (0-8%)', color: 'danger' },
    { min: 8, max: 12, label: 'Средний (8-12%)', color: 'warning' },
    { min: 12, max: 16, label: 'Хороший (12-16%)', color: 'success' },
    { min: 16, max: 20, label: 'Высокий (16-20%)', color: 'info' },
    { min: 20, max: 100, label: 'Очень высокий (>20%)', color: 'primary' }
  ]
};

// Валидация полей
export const validation = {
  required: {
    product_name: 'Наименование продукции обязательно',
    harvest_date: 'Дата сбора урожая обязательна',
    quantity: 'Количество обязательно для указания'
  },
  
  patterns: {
    quantity: {
      pattern: /^\d+(\.\d{1,3})?$/,
      message: 'Количество должно быть числом (до 3 знаков после запятой)'
    },
    harvest_area: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Площадь должна быть числом (до 2 знаков после запятой)'
    },
    moisture_content: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Влажность должна быть числом от 0 до 100%'
    },
    protein_content: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Белок должен быть числом от 0 до 100%'
    },
    oil_content: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Масличность должна быть числом от 0 до 100%'
    },
    gluten_content: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Клейковина должна быть числом от 0 до 100%'
    },
    sugar_content: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Сахар должен быть числом от 0 до 100%'
    },
    starch_content: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Крахмал должен быть числом от 0 до 100%'
    },
    impurities: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Примеси должны быть числом от 0 до 100%'
    },
    damaged_grains: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Поврежденные зерна должны быть числом от 0 до 100%'
    },
    test_weight: {
      pattern: /^\d+(\.\d{1,1})?$/,
      message: 'Натурный вес должен быть числом'
    },
    production_cost: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Себестоимость должна быть числом'
    },
    market_price_at_harvest: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Цена должна быть числом'
    },
    current_market_price: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Цена должна быть числом'
    },
    rating: {
      pattern: /^[1-5]$/,
      message: 'Рейтинг должен быть от 1 до 5'
    }
  },

  ranges: {
    moisture_content: { min: 0, max: 100 },
    protein_content: { min: 0, max: 100 },
    oil_content: { min: 0, max: 100 },
    gluten_content: { min: 0, max: 100 },
    sugar_content: { min: 0, max: 100 },
    starch_content: { min: 0, max: 100 },
    impurities: { min: 0, max: 100 },
    damaged_grains: { min: 0, max: 100 },
    quantity: { min: 0.001, max: 999999.999 },
    harvest_area: { min: 0.01, max: 99999.99 },
    rating: { min: 1, max: 5 }
  }
}; 
