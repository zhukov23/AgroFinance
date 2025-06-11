export const counterpartyFormConfig = {
  // Варианты типов контрагентов
  counterpartyTypes: [
    { value: 'supplier', label: '🏭 Поставщик', color: 'primary' },
    { value: 'customer', label: '🏪 Покупатель', color: 'success' },
    { value: 'contractor', label: '🔧 Подрядчик', color: 'info' },
    { value: 'bank', label: '🏦 Банк', color: 'warning' },
    { value: 'government', label: '🏛️ Госорган', color: 'secondary' }
  ],

  // Варианты валют
  currencies: [
    { value: 'RUB', label: '₽ Российский рубль (RUB)' },
    { value: 'USD', label: '$ Доллар США (USD)' },
    { value: 'EUR', label: '€ Евро (EUR)' },
    { value: 'CNY', label: '¥ Китайский юань (CNY)' }
  ],

  // Статусы НДС
  vatStatuses: [
    { value: 'vat_payer', label: 'Плательщик НДС' },
    { value: 'vat_exempt', label: 'Освобожден от НДС' },
    { value: 'simplified', label: 'УСН' },
    { value: 'patent', label: 'Патентная система' },
    { value: 'eshn', label: 'ЕСХН' }
  ],

  // Ставки НДС
  vatRates: [
    { value: '20', label: '20%' },
    { value: '10', label: '10%' },
    { value: '0', label: '0%' },
    { value: 'without', label: 'Без НДС' }
  ],

  // Рейтинги
  ratings: [
    { value: 'excellent', label: '⭐⭐⭐⭐⭐ Отличный' },
    { value: 'good', label: '⭐⭐⭐⭐ Хороший' },
    { value: 'average', label: '⭐⭐⭐ Средний' },
    { value: 'poor', label: '⭐⭐ Низкий' },
    { value: 'bad', label: '⭐ Плохой' }
  ],

  // Системы налогообложения
  taxSystems: [
    { value: 'general', label: 'Общая система (ОСНО)' },
    { value: 'simplified_income', label: 'УСН Доходы (6%)' },
    { value: 'simplified_profit', label: 'УСН Доходы-Расходы (15%)' },
    { value: 'envd', label: 'ЕНВД' },
    { value: 'patent', label: 'Патентная система' },
    { value: 'eshn', label: 'ЕСХН' }
  ],

  // Должности руководителей
  directorPositions: [
    { value: 'president', label: 'Президент' },
    { value: 'director', label: 'Директор' },
    { value: 'general_director', label: 'Генеральный директор' },
    { value: 'manager', label: 'Управляющий' }
  ],

  // Назначения банковских счетов
  accountPurposes: [
    { value: 'main', label: 'Основной' },
    { value: 'salary', label: 'Зарплатный' },
    { value: 'currency', label: 'Валютный' },
    { value: 'special', label: 'Специальный' },
    { value: 'deposit', label: 'Депозитный' }
  ]
};

// Валидация полей
export const validation = {
  required: {
    full_name: 'Полное наименование обязательно',
    counterparty_type: 'Выберите тип контрагента',
    account_number: 'Номер счета обязателен для банковских реквизитов'
  },
  
  patterns: {
    inn: {
      pattern: /^\d{10}$|^\d{12}$/,
      message: 'ИНН должен содержать 10 цифр для юр. лиц или 12 для ИП'
    },
    kpp: {
      pattern: /^\d{9}$/,
      message: 'КПП должен содержать 9 цифр'
    },
    ogrn: {
      pattern: /^\d{13}$|^\d{15}$/,
      message: 'ОГРН должен содержать 13 или 15 цифр'
    },
    bik: {
      pattern: /^\d{9}$/,
      message: 'БИК должен содержать 9 цифр'
    },
    account_number: {
      pattern: /^\d{20}$/,
      message: 'Номер счета должен содержать 20 цифр'
    },
    phone: {
      pattern: /^(\+7|8)?[\s\-]?\(?[489]\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
      message: 'Введите корректный номер телефона'
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Введите корректный email адрес'
    }
  }
};