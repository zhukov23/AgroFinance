export const testDataConfig = {
  storageLocation: {
    entity: "storageLocation",
    count: 1,
    instruction: "СТРОГО используйте только указанные значения для полей с values. Не придумывайте свои варианты!",
    fields: {
      name: {
        type: "string", 
        description: "Наименование места хранения (например: Склад №1 'Центральный', Элеватор 'Агро-Альянс')"
      },
      code: {
        type: "string",
        description: "Краткий код склада (например: SKL-001, ELEV-12)"
      },
      address: {
        type: "string",
        description: "Полный адрес места хранения"
      },
      coordinates: {
        type: "string",
        description: "GPS координаты в формате 'широта,долгота' (например: 55.7558,37.6176)"
      },
      contact_person: {
        type: "string",
        description: "ФИО ответственного лица"
      },
      phone: {
        type: "string",
        description: "Контактный телефон (в формате +7 или 8)"
      },
      email: {
        type: "string",
        description: "Email адрес для связи"
      },
      storage_conditions: {
        type: "string",
        description: "Описание условий хранения (температура, влажность, особенности)"
      },
      contract_number: {
        type: "string",
        description: "Номер договора аренды (если внешний склад)"
      },
      notes: {
        type: "string",
        description: "Дополнительные заметки о складе, особенности эксплуатации"
      }
    }
  }
}; 
