// src/pages/References/Pesticides/config/testDataAIScript.ts

export const testDataConfig = {
  pesticide: {
    entity: "pesticide",
    count: 1,
    instruction: "СТРОГО используйте только указанные значения для полей с values. Не придумывайте свои варианты! Генерируйте реалистичные данные для пестицидов и агрохимикатов.",
    fields: {
      name: {
        type: "string", 
        description: "Название пестицида (Раундап, Арбалет, Гранстар Голд, Децис Профи и т.д.)"
      },
      trade_name: {
        type: "string",
        description: "Торговое название препарата (если отличается от основного)"
      },
      registration_number: {
        type: "string",
        description: "Номер государственной регистрации (например: 1234-12-345-678-0-0-0-1)"
      },
      application_method: {
        type: "string",
        description: "Способ применения (опрыскивание, внесение в почву, обработка семян)"
      },
      storage_conditions: {
        type: "string",
        description: "Условия хранения препарата"
      },
      safety_precautions: {
        type: "string",
        description: "Меры предосторожности при работе с препаратом"
      },
      antidote_info: {
        type: "string",
        description: "Информация об антидотах и первой помощи"
      },
      price_per_unit: {
        type: "string",
        description: "Единица измерения цены (л, кг, упаковка)"
      },
      package_unit: {
        type: "string",
        description: "Единица измерения упаковки (л, кг, мл, г)"
      },
      registration_authority: {
        type: "string",
        description: "Орган регистрации (обычно Россельхознадзор)"
      },
      notes: {
        type: "string",
        description: "Дополнительные примечания и особенности препарата"
      }
    }
  }
}; 
