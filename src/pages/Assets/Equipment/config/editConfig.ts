export const equipmentFormConfig = {
  // Категории техники (соответствуют ENUM category)
  categories: [
    { value: 'почвообработка', label: '🚜 Почвообработка', color: 'primary' },
    { value: 'посев', label: '🌱 Посев', color: 'success' },
    { value: 'уборка', label: '🌾 Уборка', color: 'warning' },
    { value: 'защита растений', label: '🛡️ Защита растений', color: 'info' },
    { value: 'внесение удобрений', label: '💧 Внесение удобрений', color: 'secondary' },
    { value: 'транспорт', label: '🚛 Транспорт', color: 'dark' },
    { value: 'заготовка кормов', label: '🌿 Заготовка кормов', color: 'success' },
    { value: 'другое', label: '⚙️ Другое', color: 'secondary' }
  ],

  // Типы топлива (соответствуют ENUM fuel_type)
  fuelTypes: [
    { value: 'дизель', label: '⛽ Дизель', color: 'primary' },
    { value: 'бензин', label: '⛽ Бензин', color: 'warning' },
    { value: 'газ', label: '🔥 Газ', color: 'info' },
    { value: 'электричество', label: '⚡ Электричество', color: 'success' },
    { value: 'гибрид', label: '🔋 Гибрид', color: 'secondary' }
  ],

  // Сезон использования (соответствуют ENUM season_usage)
  seasonUsage: [
    { value: 'весна', label: '🌸 Весна', color: 'success' },
    { value: 'лето', label: '☀️ Лето', color: 'warning' },
    { value: 'осень', label: '🍂 Осень', color: 'secondary' },
    { value: 'зима', label: '❄️ Зима', color: 'info' },
    { value: 'круглый год', label: '🔄 Круглый год', color: 'primary' }
  ],

  // Подкатегории по категориям
  subcategories: {
    'почвообработка': [
      'Плуги', 'Культиваторы', 'Бороны', 'Дискаторы', 'Чизели', 'Фрезы'
    ],
    'посев': [
      'Сеялки зерновые', 'Сеялки пропашные', 'Сажалки', 'Разбрасыватели семян'
    ],
    'уборка': [
      'Комбайны зерноуборочные', 'Жатки', 'Косилки', 'Пресс-подборщики'
    ],
    'защита растений': [
      'Опрыскиватели', 'Протравители', 'Аэраторы'
    ],
    'внесение удобрений': [
      'Разбрасыватели минеральных удобрений', 'Разбрасыватели органических удобрений', 'Инжекторы'
    ],
    'транспорт': [
      'Тракторы', 'Прицепы', 'Погрузчики', 'Самосвалы'
    ],
    'заготовка кормов': [
      'Косилки-плющилки', 'Ворошилки', 'Грабли', 'Измельчители'
    ],
    'другое': [
      'Генераторы', 'Компрессоры', 'Насосы', 'Прочее оборудование'
    ]
  }as {[key: string]: string[]},

  // Популярные производители
  manufacturers: [
    { value: 'John Deere', label: 'John Deere (США)' },
    { value: 'Claas', label: 'Claas (Германия)' },
    { value: 'New Holland', label: 'New Holland (Нидерланды)' },
    { value: 'Case IH', label: 'Case IH (США)' },
    { value: 'Fendt', label: 'Fendt (Германия)' },
    { value: 'Massey Ferguson', label: 'Massey Ferguson (Великобритания)' },
    { value: 'Ростсельмаш', label: 'Ростсельмаш (Россия)' },
    { value: 'Беларус', label: 'Беларус (Беларусь)' },
    { value: 'Кировец', label: 'Кировец (Россия)' },
    { value: 'Amazone', label: 'Amazone (Германия)' },
    { value: 'Lemken', label: 'Lemken (Германия)' },
    { value: 'Väderstad', label: 'Väderstad (Швеция)' }
  ],

  // Страны происхождения
  originCountries: [
    { value: 'Россия', label: 'Россия' },
    { value: 'Беларусь', label: 'Беларусь' },
    { value: 'Германия', label: 'Германия' },
    { value: 'США', label: 'США' },
    { value: 'Нидерланды', label: 'Нидерланды' },
    { value: 'Швеция', label: 'Швеция' },
    { value: 'Италия', label: 'Италия' },
    { value: 'Франция', label: 'Франция' },
    { value: 'Великобритания', label: 'Великобритания' },
    { value: 'Китай', label: 'Китай' },
    { value: 'Другая', label: 'Другая' }
  ],

  // Подходящие культуры
  suitableCrops: [
    { value: 'пшеница', label: '🌾 Пшеница' },
    { value: 'ячмень', label: '🌾 Ячмень' },
    { value: 'овес', label: '🌾 Овес' },
    { value: 'рожь', label: '🌾 Рожь' },
    { value: 'кукуруза', label: '🌽 Кукуруза' },
    { value: 'подсолнечник', label: '🌻 Подсолнечник' },
    { value: 'соя', label: '🫘 Соя' },
    { value: 'рапс', label: '🌼 Рапс' },
    { value: 'картофель', label: '🥔 Картофель' },
    { value: 'свекла', label: '🍠 Свекла' },
    { value: 'многолетние травы', label: '🌿 Многолетние травы' },
    { value: 'однолетние травы', label: '🌱 Однолетние травы' },
    { value: 'универсальная', label: '🔄 Универсальная' }
  ],

  // Сертификации
  certifications: [
    { value: 'CE', label: 'CE (Европейское соответствие)' },
    { value: 'ISO_9001', label: 'ISO 9001 (Качество)' },
    { value: 'GOST', label: 'ГОСТ (Российский стандарт)' },
    { value: 'EPA', label: 'EPA (Экологический стандарт США)' },
    { value: 'Stage_V', label: 'Stage V (Эмиссия ЕС)' },
    { value: 'FCC', label: 'FCC (Радиочастотная совместимость)' },
    { value: 'OECD', label: 'OECD (Тракторные испытания)' }
  ]
};

// Валидация полей
export const validation = {
  required: {
    name: 'Наименование техники обязательно',
    category: 'Выберите категорию техники'
  },
  
  patterns: {
    equipment_code: {
      pattern: /^[A-Za-z0-9\-_]+$/,
      message: 'Код может содержать только буквы, цифры, дефисы и подчеркивания'
    },
    engine_power: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Мощность двигателя должна быть числом (до 2 знаков после запятой)'
    },
    engine_volume: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Объем двигателя должен быть числом (до 2 знаков после запятой)'
    },
    fuel_consumption: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Расход топлива должен быть числом'
    },
    working_width: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Рабочая ширина должна быть числом'
    },
    working_speed_min: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Минимальная скорость должна быть числом'
    },
    working_speed_max: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Максимальная скорость должна быть числом'
    },
    capacity: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Производительность должна быть числом'
    },
    length_mm: {
      pattern: /^\d+$/,
      message: 'Длина должна быть целым числом в мм'
    },
    width_mm: {
      pattern: /^\d+$/,
      message: 'Ширина должна быть целым числом в мм'
    },
    height_mm: {
      pattern: /^\d+$/,
      message: 'Высота должна быть целым числом в мм'
    },
    weight_kg: {
      pattern: /^\d+$/,
      message: 'Вес должен быть целым числом в кг'
    },
    purchase_price: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Цена покупки должна быть числом'
    },
    depreciation_period_years: {
      pattern: /^\d+$/,
      message: 'Срок амортизации должен быть целым числом лет'
    },
    maintenance_cost_per_hour: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Стоимость обслуживания должна быть числом'
    },
    min_field_size: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Минимальный размер поля должен быть числом'
    }
  },

  ranges: {
    engine_power: { min: 0, max: 9999.99 },
    engine_volume: { min: 0, max: 9999.99 },
    fuel_consumption: { min: 0, max: 9999.99 },
    working_width: { min: 0, max: 9999.99 },
    working_speed_min: { min: 0, max: 9999.99 },
    working_speed_max: { min: 0, max: 9999.99 },
    capacity: { min: 0, max: 99999999.99 },
    length_mm: { min: 1, max: 99999999 },
    width_mm: { min: 1, max: 99999999 },
    height_mm: { min: 1, max: 99999999 },
    weight_kg: { min: 1, max: 99999999 },
    purchase_price: { min: 0, max: 999999999999.99 },
    depreciation_period_years: { min: 1, max: 50 },
    maintenance_cost_per_hour: { min: 0, max: 999999.99 },
    min_field_size: { min: 0, max: 99999999.99 }
  }
}; 
