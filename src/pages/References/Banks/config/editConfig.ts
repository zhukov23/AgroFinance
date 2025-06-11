export const bankFormConfig = {
  // Статусы банков
  bankStatuses: [
    { value: 'active', label: '✅ Активный', color: 'success' },
    { value: 'inactive', label: '⏸️ Неактивный', color: 'warning' },
    { value: 'liquidation', label: '❌ Ликвидация', color: 'danger' },
    { value: 'reorganization', label: '🔄 Реорганизация', color: 'info' }
  ],

  // Рейтинги банков
  ratings: [
    { value: 'excellent', label: '⭐⭐⭐⭐⭐ Отличный' },
    { value: 'good', label: '⭐⭐⭐⭐ Хороший' },
    { value: 'average', label: '⭐⭐⭐ Средний' },
    { value: 'poor', label: '⭐⭐ Низкий' },
    { value: 'bad', label: '⭐ Плохой' }
  ],

  // Теги банков
  bankTags: [
    { value: 'системно_значимый', label: '🏛️ Системно значимый', color: 'danger' },
    { value: 'региональный', label: '🏘️ Региональный', color: 'info' },
    { value: 'частный', label: '🏢 Частный', color: 'primary' },
    { value: 'государственный', label: '🏛️ Государственный', color: 'success' },
    { value: 'иностранный', label: '🌍 Иностранный', color: 'warning' },
    { value: 'инвестиционный', label: '📈 Инвестиционный', color: 'dark' },
    { value: 'корпоративный', label: '🏭 Корпоративный', color: 'secondary' },
    { value: 'розничный', label: '🛍️ Розничный', color: 'light' }
  ],

  // Регионы России (основные)
  regions: [
    { value: 'москва', label: 'г. Москва' },
    { value: 'санкт_петербург', label: 'г. Санкт-Петербург' },
    { value: 'московская_область', label: 'Московская область' },
    { value: 'ленинградская_область', label: 'Ленинградская область' },
    { value: 'краснодарский_край', label: 'Краснодарский край' },
    { value: 'свердловская_область', label: 'Свердловская область' },
    { value: 'новосибирская_область', label: 'Новосибирская область' },
    { value: 'татарстан', label: 'Республика Татарстан' },
    { value: 'башкортостан', label: 'Республика Башкортостан' },
    { value: 'другой', label: 'Другой регион' }
  ]
};

// Валидация полей
export const validation = {
  required: {
    name: 'Наименование банка обязательно',
    bik: 'БИК банка обязателен'
  },
  
  patterns: {
    bik: {
      pattern: /^\d{9}$/,
      message: 'БИК должен содержать 9 цифр'
    },
    correspondent_account: {
      pattern: /^\d{20}$/,
      message: 'Корреспондентский счет должен содержать 20 цифр'
    },
    swift_code: {
      pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
      message: 'SWIFT код должен содержать 8 или 11 символов (например: SABRRUMM)'
    },
    phone: {
      pattern: /^(\+7|8)?[\s\-]?\(?[489]\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
      message: 'Введите корректный номер телефона'
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Введите корректный email адрес'
    },
    website: {
      pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: 'Введите корректный адрес сайта'
    }
  }
}; 
