export const testDataConfig = {
  bank: {
    entity: "bank",
    count: 1,
    instruction: "СТРОГО используйте только указанные значения для полей с values. Не придумывайте свои варианты!",
    fields: {
      name: {
        type: "string", 
        description: "Полное наименование банка (ПАО, АО, ООО с 'БАНК' в названии)"
      },
      short_name: {
        type: "string",
        description: "Краткое название банка без организационно-правовой формы"
      },
      region: {
        type: "string",
        description: "Регион расположения банка (область, край, республика)"
      },
      address: {
        type: "string",
        description: "Юридический адрес банка"
      },
      notes: {
        type: "string",
        description: "Дополнительные заметки о банке"
      }
    }
  }
}; 
