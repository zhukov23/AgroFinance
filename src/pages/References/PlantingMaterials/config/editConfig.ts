export const plantingMaterialFormConfig = {
  // Типы посевного материала (соответствуют ENUM planting_material_type)
  materialTypes: [
    { value: 'seeds', label: '🌱 Семена', color: 'success' },
    { value: 'seedlings', label: '🌿 Рассада', color: 'info' },
    { value: 'transplants', label: '🌱 Саженцы', color: 'warning' },
    { value: 'cuttings', label: '🌿 Черенки', color: 'primary' },
    { value: 'bulbs_tubers', label: '🧅 Луковицы/Клубни', color: 'secondary' },
    { value: 'rhizomes', label: '🌿 Корневища', color: 'dark' }
  ],

  // Категории культур (соответствуют ENUM crop_category)
  cropCategories: [
    { value: 'cereals', label: '🌾 Зерновые', color: 'warning' },
    { value: 'legumes', label: '🫘 Бобовые', color: 'success' },
    { value: 'oilseeds', label: '🌻 Масличные', color: 'info' },
    { value: 'vegetables', label: '🥕 Овощи', color: 'primary' },
    { value: 'fruits', label: '🍎 Фрукты', color: 'danger' },
    { value: 'berries', label: '🍓 Ягоды', color: 'success' },
    { value: 'technical', label: '🏭 Технические', color: 'dark' },
    { value: 'forage', label: '🐄 Кормовые', color: 'secondary' },
    { value: 'ornamental', label: '🌺 Декоративные', color: 'info' }
  ],

  // Типы по сезону (соответствуют ENUM season_type)
  seasonTypes: [
    { value: 'winter', label: '❄️ Озимые', color: 'info' },
    { value: 'spring', label: '🌸 Яровые', color: 'success' },
    { value: 'summer', label: '☀️ Летние', color: 'warning' },
    { value: 'autumn', label: '🍂 Осенние', color: 'secondary' },
    { value: 'perennial', label: '🌳 Многолетние', color: 'primary' }
  ],

  // Потребность в воде (соответствуют ENUM water_requirement)
  waterRequirements: [
    { value: 'low', label: '💧 Низкая', color: 'warning' },
    { value: 'medium', label: '💧💧 Средняя', color: 'info' },
    { value: 'high', label: '💧💧💧 Высокая', color: 'primary' }
  ],

  // Статусы
  statuses: [
    { value: 'active', label: '✅ Активный', color: 'success' },
    { value: 'discontinued', label: '❌ Снят с производства', color: 'danger' },
    { value: 'seasonal', label: '⏰ Сезонный', color: 'warning' },
    { value: 'trial', label: '🧪 Испытания', color: 'info' }
  ],

  // Рейтинги
  ratings: [
    { value: 5, label: '⭐⭐⭐⭐⭐ Отличный' },
    { value: 4, label: '⭐⭐⭐⭐ Хороший' },
    { value: 3, label: '⭐⭐⭐ Средний' },
    { value: 2, label: '⭐⭐ Низкий' },
    { value: 1, label: '⭐ Плохой' }
  ],

  // Типы почв
  soilTypes: [
    { value: 'chernozem', label: 'Чернозем' },
    { value: 'clay', label: 'Глинистые' },
    { value: 'sandy', label: 'Песчаные' },
    { value: 'loamy', label: 'Суглинистые' },
    { value: 'peat', label: 'Торфяные' },
    { value: 'silt', label: 'Илистые' }
  ],

  // Теги
  commonTags: [
    { value: 'gmo_free', label: '🚫 Без ГМО', color: 'success' },
    { value: 'organic', label: '🌿 Органический', color: 'success' },
    { value: 'hybrid', label: '🔬 Гибрид', color: 'info' },
    { value: 'early_ripening', label: '⚡ Скороспелый', color: 'warning' },
    { value: 'high_yield', label: '📈 Высокоурожайный', color: 'primary' },
    { value: 'disease_resistant', label: '🛡️ Устойчивый к болезням', color: 'success' },
    { value: 'drought_tolerant', label: '🏜️ Засухоустойчивый', color: 'warning' },
    { value: 'frost_resistant', label: '❄️ Морозостойкий', color: 'info' }
  ],

  // Страны происхождения (основные)
  originCountries: [
    { value: 'russia', label: 'Россия' },
    { value: 'ukraine', label: 'Украина' },
    { value: 'belarus', label: 'Беларусь' },
    { value: 'kazakhstan', label: 'Казахстан' },
    { value: 'germany', label: 'Германия' },
    { value: 'france', label: 'Франция' },
    { value: 'netherlands', label: 'Нидерланды' },
    { value: 'usa', label: 'США' },
    { value: 'canada', label: 'Канада' },
    { value: 'other', label: 'Другая' }
  ]
};

// Валидация полей
export const validation = {
  required: {
    name: 'Наименование посевного материала обязательно',
    material_type: 'Выберите тип посевного материала',
    crop_category: 'Выберите категорию культуры'
  },
  
  patterns: {
    maturity_days: {
      pattern: /^\d+$/,
      message: 'Срок созревания должен быть числом'
    },
    planting_rate: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Норма высева должна быть числом (до 2 знаков после запятой)'
    },
    planting_depth: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Глубина посева должна быть числом (до 2 знаков после запятой)'
    },
    potential_yield: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Потенциальная урожайность должна быть числом'
    },
    ph_range_min: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'pH должен быть числом от 0 до 14'
    },
    ph_range_max: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'pH должен быть числом от 0 до 14'
    },
    frost_resistance: {
      pattern: /^([1-9]|10)$/,
      message: 'Морозостойкость должна быть от 1 до 10'
    },
    drought_tolerance: {
      pattern: /^([1-9]|10)$/,
      message: 'Засухоустойчивость должна быть от 1 до 10'
    },
    shelf_life_months: {
      pattern: /^\d+$/,
      message: 'Срок хранения должен быть числом в месяцах'
    },
    rating: {
      pattern: /^[1-5]$/,
      message: 'Рейтинг должен быть от 1 до 5'
    }
  }
};