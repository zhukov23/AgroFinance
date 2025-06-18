export const fieldFormConfig = {
  // Типы почв (соответствуют ENUM soil_type)
  soilTypes: [
    { value: 'чернозем', label: '🖤 Чернозем', color: 'dark' },
    { value: 'суглинок', label: '🟤 Суглинок', color: 'secondary' },
    { value: 'супесь', label: '🟡 Супесь', color: 'warning' },
    { value: 'песок', label: '🟨 Песок', color: 'light' },
    { value: 'глина', label: '🔴 Глина', color: 'danger' },
    { value: 'торф', label: '🟫 Торф', color: 'info' },
    { value: 'солонец', label: '⚪ Солонец', color: 'secondary' },
    { value: 'другой', label: '❓ Другой', color: 'secondary' }
  ],

  // Типы орошения (соответствуют ENUM irrigation_type)
  irrigationTypes: [
    { value: 'отсутствует', label: '❌ Отсутствует', color: 'secondary' },
    { value: 'капельное', label: '💧 Капельное', color: 'primary' },
    { value: 'дождевание', label: '🌧️ Дождевание', color: 'info' },
    { value: 'поверхностное', label: '🌊 Поверхностное', color: 'warning' },
    { value: 'подпочвенное', label: '⬇️ Подпочвенное', color: 'success' }
  ],

  // Статус поля (соответствуют ENUM field_status)
  fieldStatuses: [
    { value: 'активное', label: '✅ Активное', color: 'success' },
    { value: 'под_паром', label: '🌱 Под паром', color: 'warning' },
    { value: 'в_севообороте', label: '🔄 В севообороте', color: 'primary' },
    { value: 'на_реконструкции', label: '🚧 На реконструкции', color: 'info' },
    { value: 'неиспользуемое', label: '❌ Неиспользуемое', color: 'danger' },
    { value: 'арендованное', label: '📋 Арендованное', color: 'secondary' }
  ],

  // Диапазоны качества почвы (1-10)
  soilQualityRanges: [
    { min: 1, max: 2, label: 'Очень низкое (1-2)', color: 'danger' },
    { min: 3, max: 4, label: 'Низкое (3-4)', color: 'warning' },
    { min: 5, max: 6, label: 'Среднее (5-6)', color: 'secondary' },
    { min: 7, max: 8, label: 'Хорошее (7-8)', color: 'info' },
    { min: 9, max: 10, label: 'Отличное (9-10)', color: 'success' }
  ],

  // Типы дорог для инфраструктуры
  roadTypes: [
    'асфальтированная',
    'грунтовая',
    'щебеночная',
    'полевая',
    'бетонная'
  ],

  // Источники воды
  waterSources: [
    'скважина',
    'колодец',
    'река',
    'пруд',
    'водопровод',
    'артезианская_скважина',
    'канал'
  ],

  // Элементы рельефа
  terrainFeatures: [
    { value: 'равнинный', label: '📐 Равнинный' },
    { value: 'холмистый', label: '⛰️ Холмистый' },
    { value: 'склон', label: '📈 Склон' },
    { value: 'низина', label: '📉 Низина' },
    { value: 'возвышенность', label: '🏔️ Возвышенность' },
    { value: 'овраг', label: '🕳️ Овраг' },
    { value: 'балка', label: '🏞️ Балка' }
  ],

  // Ограничения использования
  restrictionTypes: [
    { value: 'экологические', label: '🌿 Экологические' },
    { value: 'санитарные', label: '🏥 Санитарные' },
    { value: 'охранные_зоны', label: '🛡️ Охранные зоны' },
    { value: 'водоохранные', label: '💧 Водоохранные' },
    { value: 'лесозащитные', label: '🌲 Лесозащитные' },
    { value: 'археологические', label: '🏛️ Археологические' },
    { value: 'газопровод', label: '🔧 Газопровод' },
    { value: 'линии_электропередач', label: '⚡ ЛЭП' }
  ],

  // Специальные особенности
  specialFeatures: [
    { value: 'эрозия', label: '🌊 Подвержено эрозии' },
    { value: 'заболоченность', label: '🐸 Заболоченность' },
    { value: 'засоленность', label: '🧂 Засоленность' },
    { value: 'каменистость', label: '🪨 Каменистость' },
    { value: 'уклон', label: '📐 Значительный уклон' },
    { value: 'микрорельеф', label: '🗺️ Сложный микрорельеф' },
    { value: 'близость_воды', label: '💧 Близость к воде' },
    { value: 'ветрозащита', label: '🌬️ Ветрозащитные полосы' }
  ],

  // Предыдущие культуры для истории использования
  previousCrops: [
    'пшеница',
    'ячмень',
    'овес',
    'рожь',
    'кукуруза',
    'подсолнечник',
    'соя',
    'рапс',
    'горох',
    'картофель',
    'свекла',
    'многолетние_травы',
    'однолетние_травы',
    'пар'
  ]
};

// Валидация полей
export const validation = {
  required: {
    field_name: 'Название поля обязательно',
    area_hectares: 'Площадь поля обязательна',
    soil_type: 'Выберите тип почвы'
  },
  
  patterns: {
    field_code: {
      pattern: /^[A-Za-z0-9\-_]*$/,
      message: 'Код может содержать только буквы, цифры, дефисы и подчеркивания'
    },
    area_hectares: {
      pattern: /^\d+(\.\d{1,4})?$/,
      message: 'Площадь должна быть числом (до 4 знаков после запятой)'
    },
    soil_quality_score: {
      pattern: /^([1-9]|10)$/,
      message: 'Качество почвы должно быть от 1 до 10'
    },
    cadastral_number: {
      pattern: /^\d{2}:\d{2}:\d{7}:\d{1,4}$/,
      message: 'Формат: XX:XX:XXXXXXX:XXXX (например: 50:21:0010305:44)'
    }
  },

  ranges: {
    area_hectares: { min: 0.0001, max: 99999.9999 },
    soil_quality_score: { min: 1, max: 10 }
  },

  geoValidation: {
    latitude: { min: -90, max: 90 },
    longitude: { min: -180, max: 180 }
  }
}; 
