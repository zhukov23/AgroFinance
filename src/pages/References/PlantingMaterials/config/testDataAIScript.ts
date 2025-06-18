export const testDataConfig = {
  plantingMaterial: {
    entity: "plantingMaterial",
    count: 1,
    instruction: "СТРОГО используйте только указанные значения для полей с values. Не придумывайте свои варианты!",
    fields: {
      name: {
        type: "string", 
        description: "Наименование посевного материала"
      },
      scientific_name: {
        type: "string",
        description: "Научное название растения (латинское)"
      },
      variety: {
        type: "string",
        description: "Сорт или гибрид"
      },
      origin_country: {
        type: "string",
        description: "Страна происхождения сорта"
      },
      breeder: {
        type: "string",
        description: "Селекционер или селекционная организация"
      },
      description: {
        type: "string",
        description: "Описание характеристик сорта"
      },
      cultivation_notes: {
        type: "string",
        description: "Рекомендации по выращиванию"
      },
      storage_requirements: {
        type: "string",
        description: "Требования к хранению семян"
      },
      notes: {
        type: "string",
        description: "Дополнительные заметки о сорте"
      }
    }
  }
}; 
