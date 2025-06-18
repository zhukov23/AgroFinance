export const testDataConfig = {
  harvestedProduct: {
    entity: "harvestedProduct",
    count: 1,
    instruction: "СТРОГО используйте только указанные значения для полей с values. Не придумывайте свои варианты! Генерируйте реалистичные данные для урожайной продукции.",
    fields: {
      product_name: {
        type: "string", 
        description: "Наименование урожайной продукции (пшеница, ячмень, кукуруза, подсолнечник, соя и т.д.)"
      },
      field_name: {
        type: "string",
        description: "Название поля где был собран урожай (например: Поле №1, Южное поле, Центральный участок)"
      },
      harvest_conditions: {
        type: "string",
        description: "Условия уборки урожая (сухая погода, оптимальные условия, механизированная уборка и т.д.)"
      },
      storage_conditions: {
        type: "string",
        description: "Условия хранения продукции (температурный режим, влажность, вентиляция)"
      },
      processing_recommendations: {
        type: "string",
        description: "Рекомендации по переработке или использованию продукции"
      },
      lab_certificate_number: {
        type: "string",
        description: "Номер лабораторного сертификата качества (например: ЛС-2024-001234)"
      },
      notes: {
        type: "string",
        description: "Дополнительные заметки о продукции, особенностях урожая, условиях выращивания"
      }
    }
  }
}; 
