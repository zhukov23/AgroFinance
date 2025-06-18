export const storageLocationFormConfig = {
  // Типы хранилищ (соответствуют ENUM storage_type)
  storageTypes: [
    { value: 'own', label: '🏢 Собственное', color: 'success' },
    { value: 'external', label: '🏭 Внешнее', color: 'info' }
  ],

  // Типы хранения (для storage_types_allowed JSONB)
  storageTypesAllowed: [
    { value: 'grain', label: '🌾 Зерно', color: 'warning' },
    { value: 'seeds', label: '🌱 Семена', color: 'success' },
    { value: 'fertilizers', label: '🧪 Удобрения', color: 'info' },
    { value: 'chemicals', label: '⚗️ Химикаты', color: 'danger' },
    { value: 'equipment', label: '🚜 Техника', color: 'primary' },
    { value: 'feed', label: '🐄 Корма', color: 'secondary' },
    { value: 'fuel', label: '⛽ Топливо', color: 'dark' }
  ],

  // Уровни безопасности
  securityLevels: [
    { value: 'low', label: '🔓 Низкий', color: 'warning' },
    { value: 'medium', label: '🔐 Средний', color: 'info' },
    { value: 'high', label: '🔒 Высокий', color: 'success' },
    { value: 'maximum', label: '🛡️ Максимальный', color: 'primary' }
  ],

  // Статусы
  statuses: [
    { value: 'active', label: '✅ Активный', color: 'success' },
    { value: 'maintenance', label: '🔧 Обслуживание', color: 'warning' },
    { value: 'renovation', label: '🏗️ Реконструкция', color: 'info' },
    { value: 'inactive', label: '❌ Неактивный', color: 'danger' }
  ],

  // Рейтинги
  ratings: [
    { value: 5, label: '⭐⭐⭐⭐⭐ Отличный' },
    { value: 4, label: '⭐⭐⭐⭐ Хороший' },
    { value: 3, label: '⭐⭐⭐ Средний' },
    { value: 2, label: '⭐⭐ Низкий' },
    { value: 1, label: '⭐ Плохой' }
  ],

  // Теги
  commonTags: [
    { value: 'climate_controlled', label: '🌡️ Климат-контроль', color: 'info' },
    { value: 'refrigerated', label: '❄️ Холодильник', color: 'primary' },
    { value: 'automated', label: '🤖 Автоматизированный', color: 'success' },
    { value: 'certified', label: '📜 Сертифицированный', color: 'warning' },
    { value: 'eco_friendly', label: '🌿 Экологичный', color: 'success' },
    { value: 'fire_protected', label: '🔥 Пожаробезопасный', color: 'danger' },
    { value: 'pest_controlled', label: '🐛 Защита от вредителей', color: 'info' },
    { value: 'modern', label: '🏢 Современный', color: 'primary' }
  ]
};

// Валидация полей
export const validation = {
  required: {
    name: 'Наименование места хранения обязательно',
    storage_type: 'Выберите тип хранилища'
  },
  
  patterns: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Введите корректный email адрес'
    },
    phone: {
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Введите корректный номер телефона'
    },
    coordinates: {
      pattern: /^-?\d+\.?\d*,-?\d+\.?\d*$/,
      message: 'Координаты должны быть в формате: широта,долгота'
    },
    total_capacity: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Общая емкость должна быть числом (до 2 знаков после запятой)'
    },
    available_capacity: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Доступная емкость должна быть числом (до 2 знаков после запятой)'
    },
    rental_cost_per_ton: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Стоимость аренды должна быть числом (до 2 знаков после запятой)'
    },
    rating: {
      pattern: /^[1-5]$/,
      message: 'Рейтинг должен быть от 1 до 5'
    }
  }
}; 
