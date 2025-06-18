// src/pages/References/Pesticides/config/editConfig.ts

export const pesticideFormConfig = {
  // Типы пестицидов
  pesticideTypes: [
    { value: 'herbicide', label: 'Гербицид' },
    { value: 'fungicide', label: 'Фунгицид' },
    { value: 'insecticide', label: 'Инсектицид' },
    { value: 'acaricide', label: 'Акарицид' },
    { value: 'nematicide', label: 'Нематицид' },
    { value: 'rodenticide', label: 'Родентицид' },
    { value: 'growth_regulator', label: 'Регулятор роста' },
    { value: 'adjuvant', label: 'Адъювант' },
    { value: 'biocide', label: 'Биоцид' },
    { value: 'combination', label: 'Комбинированный' }
  ],

  // Классы опасности
  hazardClasses: [
    { value: 'I', label: 'I класс (чрезвычайно опасные)' },
    { value: 'II', label: 'II класс (высокоопасные)' },
    { value: 'III', label: 'III класс (умеренно опасные)' },
    { value: 'IV', label: 'IV класс (малоопасные)' }
  ],

  // Физические формы
  physicalForms: [
    { value: 'liquid', label: 'Жидкость' },
    { value: 'powder', label: 'Порошок' },
    { value: 'granules', label: 'Гранулы' },
    { value: 'emulsion', label: 'Эмульсия' },
    { value: 'suspension', label: 'Суспензия' },
    { value: 'tablets', label: 'Таблетки' },
    { value: 'capsules', label: 'Капсулы' },
    { value: 'gel', label: 'Гель' },
    { value: 'aerosol', label: 'Аэрозоль' }
  ],

  // Статусы регистрации
  registrationStatuses: [
    { value: 'active', label: 'Активна' },
    { value: 'expired', label: 'Истекла' },
    { value: 'suspended', label: 'Приостановлена' },
    { value: 'cancelled', label: 'Отменена' }
  ],

  // Валюты
  currencies: [
    { value: 'RUB', label: 'Российский рубль (₽)' },
    { value: 'USD', label: 'Доллар США ($)' },
    { value: 'EUR', label: 'Евро (€)' }
  ],

  // Единицы измерения упаковки
  packageUnits: [
    { value: 'л', label: 'Литры' },
    { value: 'кг', label: 'Килограммы' },
    { value: 'мл', label: 'Миллилитры' },
    { value: 'г', label: 'Граммы' },
    { value: 'шт', label: 'Штуки' }
  ],

  // Единицы измерения цены
  priceUnits: [
    { value: 'л', label: 'за литр' },
    { value: 'кг', label: 'за килограмм' },
    { value: 'упаковка', label: 'за упаковку' },
    { value: 'доза', label: 'за дозу' },
    { value: 'га', label: 'за гектар' }
  ],

  // Единицы измерения дозировки
  dosageUnits: [
    { value: 'л/га', label: 'л/га' },
    { value: 'кг/га', label: 'кг/га' },
    { value: 'г/га', label: 'г/га' },
    { value: 'мл/га', label: 'мл/га' },
    { value: 'г/100кв.м', label: 'г/100кв.м' }
  ],

  // Единицы концентрации
  concentrationUnits: [
    { value: '%', label: '%' },
    { value: 'г/л', label: 'г/л' },
    { value: 'мг/л', label: 'мг/л' },
    { value: 'г/кг', label: 'г/кг' },
    { value: 'мг/кг', label: 'мг/кг' }
  ],

  // Активные вещества (популярные)
  commonActiveSubstances: [
    'глифосат',
    '2,4-Д',
    'имидаклоприд',
    'тебуконазол',
    'хлорпирифос',
    'абамектин',
    'тиаметоксам',
    'пропиконазол',
    'флуазифоп-П-бутил',
    'манкоцеб',
    'карбендазим',
    'дифлуфеникан',
    'пиразосульфурон-этил',
    'бифентрин',
    'лямбда-цигалотрин'
  ],

  // Целевые вредители
  commonPests: [
    'сорняки',
    'колорадский жук',
    'тля',
    'паутинный клещ',
    'мучнистая роса',
    'фитофтороз',
    'ржавчина',
    'серая гниль',
    'белокрылка',
    'трипсы',
    'нематоды',
    'проволочник',
    'листовертка',
    'плодожорка',
    'медведка'
  ],

  // Целевые культуры
  commonCrops: [
    'пшеница',
    'ячмень',
    'кукуруза',
    'подсолнечник',
    'соя',
    'рапс',
    'картофель',
    'томаты',
    'огурцы',
    'капуста',
    'морковь',
    'лук',
    'яблоня',
    'виноград',
    'земляника'
  ],

  // Стадии развития растений
  growthStages: [
    'посев/посадка',
    'всходы',
    'кущение',
    'стеблевание',
    'бутонизация',
    'цветение',
    'плодообразование',
    'созревание',
    'вегетация',
    'покой'
  ],

  // Уровни эффективности
  effectivenessLevels: [
    { value: 'высокая', label: 'Высокая' },
    { value: 'средняя', label: 'Средняя' },
    { value: 'низкая', label: 'Низкая' }
  ],

  // Органы регистрации
  registrationAuthorities: [
    'Россельхознадзор',
    'Минсельхоз России',
    'ФГБУ "ВНИИЗР"',
    'ФГБУ "ВНИИКР"'
  ],

  // Типы сертификатов
  certificateTypes: [
    { value: 'gmp', label: 'GMP (Надлежащая производственная практика)' },
    { value: 'iso_9001', label: 'ISO 9001 (Менеджмент качества)' },
    { value: 'iso_14001', label: 'ISO 14001 (Экологический менеджмент)' },
    { value: 'haccp', label: 'HACCP (Анализ рисков)' },
    { value: 'eac', label: 'EAC (Евразийское соответствие)' }
  ],

  // Типы документов
  documentTypes: [
    { value: 'safety_sheet', label: 'Паспорт безопасности' },
    { value: 'instruction', label: 'Инструкция по применению' },
    { value: 'certificate', label: 'Сертификат соответствия' },
    { value: 'registration', label: 'Свидетельство о регистрации' },
    { value: 'analysis', label: 'Протокол анализа' },
    { value: 'specification', label: 'Техническая спецификация' }
  ],

  // Способы применения
  applicationMethods: [
    'Опрыскивание по вегетации',
    'Обработка семян',
    'Внесение в почву',
    'Опудривание',
    'Капельный полив',
    'Фумигация',
    'Аэрозольная обработка',
    'Инъекция в ствол',
    'Протравливание',
    'Замачивание корней'
  ]
};

// Валидационные правила
export const pesticideValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 300
  },
  trade_name: {
    maxLength: 300
  },
  registration_number: {
    maxLength: 100,
    pattern: /^[A-Za-z0-9\-]+$/
  },
  pesticide_type: {
    required: true
  },
  hazard_class: {
    required: true
  },
  physical_form: {
    required: true
  },
  active_substances: {
    required: true,
    minItems: 1
  },
  base_price: {
    min: 0,
    max: 999999999.99
  },
  package_size: {
    required: true,
    min: 0.001,
    max: 999999.999
  },
  shelf_life_months: {
    min: 1,
    max: 120
  }
}; 
