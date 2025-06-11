# README: Быстрое добавление страницы с таблицей данных

## Самый простой способ (с помощью чата)

### Шаг 1: Подготовьте файлы-образцы
Отдайте чату эти 4 файла в качестве образца:
- `src\pages\References\Banks\BanksList.tsx`
- `src\pages\References\Banks\config\index.ts`
- `src\pages\References\Banks\config\syncConfig.ts`
- `src\pages\References\Banks\config\tableConfig.ts`

### Шаг 2: Получите структуру таблицы
Выполните SQL-скрипт на сервере (замените `reference_counterparties` на нужную таблицу):

```sql
WITH table_columns AS (
    SELECT 
        c.column_name,
        c.data_type,
        CASE 
            WHEN c.character_maximum_length IS NOT NULL 
            THEN c.data_type || '(' || c.character_maximum_length || ')'
            ELSE c.data_type 
        END as full_type,
        c.is_nullable,
        c.column_default,
        c.ordinal_position
    FROM information_schema.columns c
    WHERE c.table_name = 'reference_counterparties'
      AND c.table_schema = 'public'
),
foreign_keys AS (
    SELECT 
        kcu.column_name,
        ccu.table_name as reference_table,
        ccu.column_name as reference_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'reference_counterparties'
      AND tc.constraint_type = 'FOREIGN KEY'
)
SELECT 
    tc.column_name as "field_name",
    tc.full_type as "field_type", 
    tc.is_nullable as "nullable",
    tc.column_default as "default_value",
    fk.reference_table as "reference_table",
    fk.reference_column as "reference_column",
    CASE 
        WHEN fk.reference_table IS NOT NULL THEN 'FK'
        WHEN tc.column_name = 'id' THEN 'PK'
        ELSE 'FIELD'
    END as "field_category"
FROM table_columns tc
LEFT JOIN foreign_keys fk ON tc.column_name = fk.column_name
ORDER BY tc.ordinal_position;
```

### Шаг 3: Дайте задание чату
```
Измени эти 4 файла чтобы получить src\pages\References\Counterparties\CounterpartiesList.tsx на основании src\pages\References\Banks\BanksList.tsx используя структуру таблицы:

"field_name"	"field_type"	"nullable"	"default_value"	"reference_table"	"reference_column"	"field_category"
"id"	"integer"	"NO"	"nextval('counterparties_id_seq'::regclass)"			"PK"
"full_name"	"character varying(500)"	"NO"				"FIELD"
...
```

**ВСЕ!** Чат создаст все необходимые файлы.

---

## Ручной способ

### 1. Создайте структуру папок
```
src\pages\References\НоваяСущность\
├── НоваяСущностьList.tsx
└── config\
    ├── index.ts
    ├── syncConfig.ts
    └── tableConfig.ts
```

### 2. Скопируйте базовые файлы
Скопируйте из `src\pages\References\Banks\` в новую папку:
- `BanksList.tsx` → `НоваяСущностьList.tsx`
- `config\` (всю папку)

### 3. Настройте syncConfig.ts

#### 3.1 Укажите нужные таблицы
```typescript
export const banksSyncConfig: SyncConfig = {
  tables: [
    'таблица1',
    'таблица2'  // Замените на реальные имена таблиц
  ],
  displayName: 'Новое название',
  description: 'Новое описание',
  // ...
};
```

#### 3.2 Переименуйте переменную
```typescript
// Было: banksSyncConfig
// Стало: новаяСущностьSyncConfig
export const новаяСущностьSyncConfig: SyncConfig = {
```

### 4. Получите структуру таблицы
Выполните SQL-скрипт из шага 2 (измените имя таблицы).

### 5. Настройте tableConfig.ts
Дайте чату файл `tableConfig.ts` и структуру таблицы:

```
Сделай tableConfig.ts на основании структуры таблицы из БД:

"field_name"	"field_type"	"nullable"	"default_value"	"reference_table"	"reference_column"	"field_category"
"id"	"integer"	"NO"	"nextval('counterparties_id_seq'::regclass)"			"PK"
"full_name"	"character varying(500)"	"NO"				"FIELD"
...
```

### 6. Обновите index.ts
Замените имена переменных на созданные в шагах 3.2 и 5:
```typescript
export { 
  новаяСущностьSyncConfig,  // Из шага 3.2
  // ...
} from './syncConfig';

export {
  новаяСущностьColumns,     // Из шага 5
  // ...
} from './tableConfig';
```

### 7. Создайте основную страницу
Дайте чату:
```
Создай НоваяСущностьList.tsx на основании BanksList.tsx
```

---

## Результат

После выполнения любого из способов у вас будет готовая страница с:
- ✅ Таблицей данных
- ✅ Синхронизацией с сервером
- ✅ Поиском и фильтрацией
- ✅ Пагинацией
- ✅ Обработкой ошибок
- ✅ Кнопками обновления и синхронизации

Просто добавьте роутинг в приложение, и страница готова к использованию!