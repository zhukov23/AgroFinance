export const testDataConfig = {
  equipment: {
    entity: "equipment",
    count: 1,
    instruction: "СТРОГО используйте только указанные значения для полей с values. Не придумывайте свои варианты! Генерируйте реалистичные данные для сельскохозяйственной техники.",
    fields: {
      name: {
        type: "string", 
        description: "Наименование сельскохозяйственной техники (трактор, комбайн, культиватор, сеялка и т.д.)"
      },
      equipment_code: {
        type: "string",
        description: "Код техники (например: TR-001, KB-2023-15, CT-M450)"
      },
      subcategory: {
        type: "string",
        description: "Подкатегория техники (плуги, бороны, жатки, опрыскиватели и т.д.)"
      },
      manufacturer: {
        type: "string",
        description: "Производитель техники (John Deere, Claas, New Holland, Case IH, Ростсельмаш и т.д.)"
      },
      model: {
        type: "string",
        description: "Модель техники (конкретное обозначение модели)"
      },
      country_origin: {
        type: "string",
        description: "Страна происхождения техники"
      },
      description: {
        type: "string",
        description: "Описание назначения и особенностей техники"
      }
    }
  }
}; 
