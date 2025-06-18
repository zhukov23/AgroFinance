export const testDataConfig = {
  field: {
    entity: "field",
    count: 1,
    instruction: "СТРОГО используйте только указанные значения для полей с values. Не придумывайте свои варианты! Генерируйте реалистичные данные для сельскохозяйственных полей.",
    fields: {
      field_name: {
        type: "string", 
        description: "Название поля (Поле №1, Южное поле, Центральный участок, Дальняя делянка и т.д.)"
      },
      field_code: {
        type: "string",
        description: "Код поля (например: F-001, SOUTH-12, FIELD-A1)"
      },
      cadastral_number: {
        type: "string",
        description: "Кадастровый номер поля (например: 50:21:0010305:44)"
      },
      notes: {
        type: "string",
        description: "Примечания и особенности поля (рельеф, особенности почвы, проблемные зоны)"
      }
    }
  }
}; 
