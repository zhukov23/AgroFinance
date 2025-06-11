
export const testDataConfig = {
  counterparty: {
          entity: "counterparty",
          count: 1,
          instruction: "СТРОГО используйте только указанные значения для полей с values. Не придумывайте свои варианты!",
          fields: {
            full_name: {
              type: "string", 
              description: "Полное наименование организации (ООО, ИП, АО)"
            },
            short_name: {
              type: "string",
              description: "Краткое название без организационно-правовой формы"
            },

            address: {
              type: "string",
              description: "Юридический адрес организации"
            },
            postal_address: {
              type: "string",
              description: "Почтовый адрес (может отличаться от юридического)"
            },
            director_name: {
              type: "string",
              description: "ФИО генерального директора"
            },
            contact_person: {
              type: "string",
              description: "ФИО контактного лица"
            },
            registration_authority: {
              type: "string",
              description: "Орган регистрации: ИФНС России по г.Москва №1"
            },

            notes: {
              type: "string",
              description: "Дополнительные заметки о контрагенте"
            }
          }
        }
      }      