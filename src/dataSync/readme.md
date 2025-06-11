# 🔄 Система синхронизации IndexedDB

Универсальная система синхронизации данных между сервером и локальной базой данных IndexedDB для React приложений.

## 📋 Содержание

- [Обзор системы](#обзор-системы)
- [Архитектура](#архитектура)
- [Структура файлов](#структура-файлов)
- [Основные компоненты](#основные-компоненты)
- [Установка и настройка](#установка-и-настройка)
- [Использование](#использование)
- [API документация](#api-документация)
- [Примеры](#примеры)
- [Бизнес-логика](#бизнес-логика)

## 🎯 Обзор системы

Система обеспечивает автоматическую синхронизацию данных между REST API сервером и локальной базой данных IndexedDB. Поддерживает инкрементальную синхронизацию, обработку конфликтов и offline-режим работы.

### ✨ Основные возможности

- 🔄 **Инкрементальная синхронизация** - загрузка только изменённых данных
- 📊 **Версионирование** - отслеживание версий таблиц и времени синхронизации
- 🎯 **Универсальность** - работа с любыми таблицами через конфигурацию
- ⚡ **Производительность** - эффективная работа с большими объёмами данных
- 🛡️ **Типобезопасность** - полная поддержка TypeScript
- 🎨 **UI компоненты** - готовые компоненты для отображения статуса синхронизации
- 📱 **Responsive** - адаптивные компоненты для любых устройств

## 🏗️ Архитектура

Система построена по принципу **Layered Architecture** с чёткым разделением ответственности:

```
┌─────────────────────────────────────────┐
│           UI Components Layer           │ ← React компоненты
├─────────────────────────────────────────┤
│              Hooks Layer                │ ← useSyncData
├─────────────────────────────────────────┤
│           Business Logic Layer          │ ← SyncUtils
├─────────────────────────────────────────┤
│             Core Layer                  │ ← SyncManager, DbClient, ApiClient
├─────────────────────────────────────────┤
│            Storage Layer                │ ← IndexedDB, localStorage
└─────────────────────────────────────────┘
```

### 🔗 Принципы дизайна

- **Single Responsibility** - каждый класс имеет одну зону ответственности
- **Dependency Injection** - зависимости передаются через конструктор
- **Configuration-driven** - поведение контролируется конфигурацией
- **Event-driven** - уведомления о состоянии через callback'и
- **Promise-based** - асинхронная работа через Promise/async-await

## 📁 Структура файлов

```
src/
├── dataSync/                           # 🔄 Ядро системы синхронизации
│   ├── core/                          # Основные классы
│   │   ├── apiClient.ts               # Клиент для работы с API
│   │   ├── dbClient.ts                # Клиент для работы с IndexedDB
│   │   └── syncManager.ts             # Менеджер синхронизации
│   ├── utils/                         # Утилиты и типы
│   │   ├── syncUtils.ts               # Универсальные методы синхронизации
│   │   └── syncTypes.ts               # TypeScript типы и интерфейсы
│   └── index.ts                       # Главный экспорт API
├── hooks/                             # React хуки
│   └── useSyncData.ts                 # Основной хук для синхронизации
├── components/                        # UI компоненты
│   ├── common/                        # Общие компоненты
│   │   └── SyncStatusPanel/           # Панель статуса синхронизации
│   │       ├── SyncStatusPanel.tsx
│   │       ├── SyncStatusPanel.types.ts
│   │       └── index.ts
│   └── Equipment/                     # Компоненты для работы с техникой
│       └── EquipmentTable/            # Таблица техники
│           ├── EquipmentTable.tsx
│           ├── EquipmentTable.types.ts
│           └── index.ts
└── pages/                             # Страницы приложения
    └── SyncTest/                      # Тестовая страница
        ├── SyncTest.tsx               # Главный компонент
        └── config/                    # Конфигурации
            ├── syncConfig.ts          # Настройки синхронизации
            ├── tableConfig.ts         # Настройки таблицы
            └── index.ts               # Экспорт конфигураций
```

## 🧩 Основные компоненты

### 1. 🔧 Core Layer

#### `ApiClient`
Отвечает за взаимодействие с REST API сервером.

```typescript
class ApiClient {
  async getTableData(tableName: string, lastSync: string): Promise<any[]>
  async getTableVersion(tableName: string): Promise<string>
}
```

#### `DbClient`
Управляет работой с локальной базой данных IndexedDB.

```typescript
class DbClient {
  async init(tables: string[]): Promise<void>
  async getTable(tableName: string): Promise<any[]>
  async putAll(tableName: string, records: any[]): Promise<void>
  async deleteRecord(tableName: string, key: number): Promise<void>
}
```

#### `SyncManager`
Координирует процесс синхронизации между API и локальной БД.

```typescript
class SyncManager {
  async init(): Promise<void>
  async sync(): Promise<void>
  async getTableData(tableName: string): Promise<any[]>
}
```

### 2. 🛠️ Utils Layer

#### `SyncUtils`
Универсальный класс для выполнения синхронизации с событийной моделью.

```typescript
class SyncUtils {
  async initialize(): Promise<boolean>
  async sync(): Promise<SyncResult>
  async resetDatabase(): Promise<void>
  setEventCallback(callback: SyncEventCallback): void
}
```

### 3. ⚛️ Hooks Layer

#### `useSyncData`
React хук, предоставляющий полный API для работы с синхронизацией.

```typescript
const {
  isInitialized,
  isLoading,
  syncStatuses,
  lastSyncResult,
  sync,
  loadTableData,
  resetDatabase
} = useSyncData(config, options);
```

### 4. 🎨 UI Layer

#### `SyncStatusPanel`
Универсальная панель для отображения статуса синхронизации.

#### `EquipmentTable`
Настраиваемая таблица с сортировкой, пагинацией и автоформатированием.

## ⚙️ Установка и настройка

### 1. Требования

- React 16.8+ (для хуков)
- TypeScript 4.0+
- Современный браузер с поддержкой IndexedDB

### 2. Настройка API сервера

Сервер должен предоставлять следующие endpoints:

```
GET /api/sync/table-versions        # Получение версий всех таблиц
GET /api/sync?tables=X&since=Y      # Получение изменений с определённого времени
```

#### Формат ответа `/api/sync/table-versions`:
```json
{
  "success": true,
  "versions": {
    "table1": "v1.0",
    "table2": "v1.1"
  }
}
```

#### Формат ответа `/api/sync`:
```json
{
  "success": true,
  "timestamp": "2025-06-02T12:00:00.000Z",
  "changes": {
    "table1": {
      "inserted": [...],
      "updated": [...],
      "deleted": [...]
    }
  }
}
```

## 🚀 Использование

### Базовый пример

```typescript
import { useSyncData, createSyncConfig } from '../dataSync';

// 1. Создаём конфигурацию
const syncConfig = createSyncConfig(
  ['users', 'orders', 'products'],
  {
    apiBaseUrl: 'https://api.example.com',
    displayName: 'Данные интернет-магазина'
  }
);

// 2. Используем в компоненте
const MyComponent: React.FC = () => {
  const {
    isInitialized,
    isLoading,
    sync,
    loadTableData
  } = useSyncData(syncConfig);

  const handleSync = async () => {
    await sync();
    const users = await loadTableData('users');
    console.log('Пользователи:', users);
  };

  return (
    <button onClick={handleSync} disabled={!isInitialized || isLoading}>
      {isLoading ? 'Синхронизация...' : 'Синхронизировать'}
    </button>
  );
};
```

### Продвинутый пример с UI компонентами

```typescript
import { 
  useSyncData, 
  SyncStatusPanel 
} from '../dataSync';

const AdvancedExample: React.FC = () => {
  const {
    syncStatuses,
    lastSyncResult,
    getSyncMetrics,
    sync,
    isLoading
  } = useSyncData(syncConfig, {
    autoInitialize: true,
    autoSync: true,
    syncInterval: 15 // минут
  });

  return (
    <div>
      <button onClick={sync}>Синхронизировать</button>
      
      <SyncStatusPanel
        statuses={syncStatuses}
        lastResult={lastSyncResult}
        metrics={getSyncMetrics()}
        isLoading={isLoading}
        title="Статус синхронизации"
        compact={false}
      />
    </div>
  );
};
```

## 📚 API документация

### Типы данных

#### `SyncConfig`
```typescript
interface SyncConfig {
  tables: string[];              // Список таблиц для синхронизации
  apiBaseUrl?: string;           // URL API сервера
  displayName?: string;          // Отображаемое имя
  description?: string;          // Описание
}
```

#### `SyncStatus`
```typescript
interface SyncStatus {
  table: string;                 // Имя таблицы
  status: 'idle' | 'checking' | 'syncing' | 'success' | 'error';
  message: string;               // Сообщение о состоянии
  localVersion?: string;         // Локальная версия
  serverVersion?: string;        // Серверная версия
}
```

#### `SyncResult`
```typescript
interface SyncResult {
  success: boolean;              // Успешность операции
  results: TableSyncResult[];    // Результаты по таблицам
  totalTime: number;             // Время выполнения (мс)
  timestamp: string;             // Время завершения
}
```

### Методы хука `useSyncData`

#### Состояние
- `isInitialized: boolean` - инициализирована ли система
- `isLoading: boolean` - идёт ли процесс синхронизации
- `syncStatuses: SyncStatus[]` - статусы всех таблиц
- `lastSyncResult: SyncResult | null` - результат последней синхронизации
- `error: string | null` - текущая ошибка

#### Методы управления
- `initialize(): Promise<boolean>` - ручная инициализация
- `sync(): Promise<SyncResult>` - запуск синхронизации
- `resetDatabase(): Promise<void>` - полный сброс локальной БД

#### Методы работы с данными
- `loadTableData(tableName): Promise<any[]>` - загрузка данных таблицы
- `loadAllData(): Promise<Record<string, any[]>>` - загрузка всех данных
- `getTableDataFromState(tableName): any[]` - получение данных из state

#### Методы проверки статуса
- `getSyncStatus(tableName): TableVersionInfo` - статус таблицы
- `isDataFresh(tableName, maxAge): boolean` - актуальность данных
- `needsSync(maxAge): boolean` - нужна ли синхронизация
- `getSyncMetrics(): SyncMetrics` - метрики синхронизации

## 🔄 Бизнес-логика

### Алгоритм синхронизации

1. **Инициализация**
   - Создание/открытие IndexedDB
   - Создание объект-хранилищ для таблиц
   - Установка event callback'ов

2. **Проверка версий**
   - Запрос актуальных версий с сервера
   - Сравнение с локальными версиями

3. **Определение стратегии синхронизации**
   - **Таблица отсутствует** → полная загрузка
   - **Версии совпадают** → инкрементальная проверка
   - **Версии не совпадают** → полная синхронизация

4. **Применение изменений**
   - **Inserted** → добавление в IndexedDB
   - **Updated** → обновление существующих записей
   - **Deleted** → удаление из IndexedDB

5. **Обновление метаданных**
   - Сохранение новых версий в localStorage
   - Обновление времени последней синхронизации

### Стратегии обработки конфликтов

#### Server Wins (по умолчанию)
Серверные данные всегда перезаписывают локальные.

#### Timestamp-based
Побеждает запись с более поздним `updated_at`.

#### Manual Resolution
Пользователь выбирает какую версию сохранить.

### Обработка ошибок

#### Сетевые ошибки
- Автоматические повторы с экспоненциальной задержкой
- Graceful degradation при отсутствии интернета
- Сохранение операций для последующего выполнения

#### Ошибки IndexedDB
- Обработка блокировки базы данных
- Восстановление после повреждения схемы
- Миграции при изменении структуры

#### Ошибки данных
- Валидация перед сохранением
- Откат транзакций при ошибках
- Логирование проблемных записей

## 📖 Примеры использования

### 1. Простая страница со списком

```typescript
// pages/UserList/config/syncConfig.ts
export const userSyncConfig = createSyncConfig(['users'], {
  displayName: 'Пользователи'
});

// pages/UserList/UserList.tsx
const UserList: React.FC = () => {
  const { 
    tableData, 
    sync, 
    isLoading 
  } = useSyncData(userSyncConfig);

  useEffect(() => {
    sync(); // Синхронизация при загрузке
  }, []);

  return (
    <div>
      <button onClick={sync} disabled={isLoading}>
        Обновить
      </button>
      <ul>
        {tableData.users?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

### 2. Страница с автосинхронизацией

```typescript
const Dashboard: React.FC = () => {
  const {
    syncStatuses,
    lastSyncResult,
    needsSync
  } = useSyncData(dashboardConfig, {
    autoSync: true,
    syncInterval: 5 // минут
  });

  return (
    <div>
      {needsSync(10) && (
        <div className="warning">
          Данные устарели, требуется синхронизация
        </div>
      )}
      
      <SyncStatusPanel
        statuses={syncStatuses}
        lastResult={lastSyncResult}
        compact={true}
      />
    </div>
  );
};
```

### 3. Мастер-детальная страница

```typescript
const EquipmentMaster: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  const {
    tableData,
    sync,
    loadTableData
  } = useSyncData(equipmentSyncConfig);

  const handleRowClick = async (equipment) => {
    setSelectedEquipment(equipment);
    // Загружаем связанные данные
    const soilTypes = await loadTableData('reference_soil_types');
    // ... логика обработки
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <EquipmentTable
          data={tableData.assets_equipment || []}
          columns={equipmentColumns}
          onRowClick={handleRowClick}
        />
      </div>
      
      {selectedEquipment && (
        <div style={{ flex: 1 }}>
          <EquipmentDetails equipment={selectedEquipment} />
        </div>
      )}
    </div>
  );
};
```

### 4. Offline-first приложение

```typescript
const OfflineApp: React.FC = () => {
  const {
    isOnline,
    hasUnsyncedChanges,
    sync,
    queueOperation
  } = useSyncData(appConfig, {
    offlineMode: true
  });

  const handleCreateUser = async (userData) => {
    if (isOnline) {
      await createUserOnServer(userData);
      await sync();
    } else {
      // Сохраняем операцию для последующей синхронизации
      await queueOperation('users', 'create', userData);
    }
  };

  return (
    <div>
      <div className={`status ${isOnline ? 'online' : 'offline'}`}>
        {isOnline ? '🌐 Онлайн' : '📱 Офлайн'}
      </div>
      
      {hasUnsyncedChanges && (
        <button onClick={sync}>
          Синхронизировать изменения
        </button>
      )}
    </div>
  );
};
```

## 🎛️ Конфигурация компонентов

### Настройка таблиц

```typescript
// config/tableConfig.ts
export const productColumns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Название',
    width: 200,
    sortable: true,
    formatter: (value, record) => (
      <strong>{value}</strong>
    )
  },
  {
    key: 'price',
    label: 'Цена',
    align: 'right',
    formatter: (value) => formatCurrency(value)
  }
];

export const tableSettings = {
  pageSize: 25,
  sortable: true,
  showPagination: true
};
```

### Кастомизация статус-панели

```typescript
// config/uiConfig.ts
export const statusPanelTheme = {
  colors: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  },
  animations: true,
  compact: false
};
```

## 🔧 Продвинутые возможности

### Кастомные форматтеры

```typescript
const currencyFormatter = (value: string) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(parseFloat(value));
};

const dateFormatter = (value: string) => {
  return new Date(value).toLocaleDateString('ru-RU');
};
```

### Валидация данных

```typescript
const equipmentValidator = (record: EquipmentRecord) => {
  const errors = [];
  
  if (!record.name) errors.push('Название обязательно');
  if (record.engine_power < 0) errors.push('Мощность не может быть отрицательной');
  
  return errors;
};
```

### Миграции схемы

```typescript
const migrations = {
  v2: (db: IDBDatabase) => {
    // Добавляем новый индекс
    const store = db.transaction('equipment').objectStore('equipment');
    store.createIndex('manufacturer', 'manufacturer', { unique: false });
  },
  v3: (db: IDBDatabase) => {
    // Создаём новую таблицу
    db.createObjectStore('categories', { keyPath: 'id' });
  }
};
```

## 🐛 Отладка и мониторинг

### Включение отладки

```typescript
// Включить детальное логирование
localStorage.setItem('sync_debug', 'true');

// Отслеживать производительность
const { getSyncMetrics } = useSyncData(config);
console.log('Метрики синхронизации:', getSyncMetrics());
```

### Мониторинг ошибок

```typescript
const errorHandler = (error: Error, context: string) => {
  console.error(`Ошибка синхронизации [${context}]:`, error);
  
  // Отправка в систему мониторинга
  sendToMonitoring({
    type: 'sync_error',
    message: error.message,
    context,
    timestamp: new Date().toISOString()
  });
};
```

## 📈 Производительность

### Оптимизация больших объёмов данных

```typescript
// Пакетная обработка
const BATCH_SIZE = 1000;

const processBatches = async (records: any[]) => {
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await dbClient.putAll(tableName, batch);
    
    // Даём браузеру передохнуть
    await new Promise(resolve => setTimeout(resolve, 0));
  }
};
```

### Индексация для быстрого поиска

```typescript
// Создание составных индексов
const createIndexes = (store: IDBObjectStore) => {
  store.createIndex('name_manufacturer', ['name', 'manufacturer']);
  store.createIndex('active_category', ['is_active', 'category']);
};
```

## 🔒 Безопасность

### Валидация API ответов

```typescript
const validateApiResponse = (response: any): boolean => {
  return (
    response &&
    typeof response.success === 'boolean' &&
    typeof response.timestamp === 'string' &&
    response.changes &&
    typeof response.changes === 'object'
  );
};
```

### Санитизация данных

```typescript
const sanitizeRecord = (record: any): any => {
  return {
    ...record,
    name: DOMPurify.sanitize(record.name),
    description: DOMPurify.sanitize(record.description)
  };
};
```

## 📱 Мобильная оптимизация

### Адаптивные колонки

```typescript
const useResponsiveColumns = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile ? mobileColumns : desktopColumns;
};
```

### Touch-friendly интерфейс

```typescript
const MobileTable = () => (
  <EquipmentTable
    columns={mobileColumns}
    pageSize={5} // Меньше записей на мобильном
    compact={true}
    touchOptimized={true}
  />
);
```

## 🚀 Развёртывание

### Production настройки

```typescript
const productionConfig = {
  apiBaseUrl: process.env.REACT_APP_API_URL,
  retryAttempts: 3,
  batchSize: 500,
  debugMode: false
};
```

### Service Worker интеграция

```typescript
// Кеширование API запросов
const cacheStrategy = {
  '/api/sync/table-versions': 'cache-first',
  '/api/sync': 'network-first'
};
```

## 🧪 Тестирование

### Unit тесты

```typescript
describe('SyncUtils', () => {
  it('должен корректно синхронизировать данные', async () => {
    const mockApi = new MockApiClient();
    const syncUtils = new SyncUtils(['users'], mockApi);
    
    const result = await syncUtils.sync();
    
    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
  });
});
```

### Integration тесты

```typescript
describe('Интеграционные тесты синхронизации', () => {
  it('должен обрабатывать полный цикл синхронизации', async () => {
    // Настройка тестовой среды
    const testConfig = createTestSyncConfig();
    
    // Выполнение теста
    const { result } = renderHook(() => useSyncData(testConfig));
    
    await act(async () => {
      await result.current.sync();
    });
    
    // Проверка результатов
    expect(result.current.isInitialized).toBe(true);
  });
});
```

## 📞 Поддержка

### Часто задаваемые вопросы

**Q: Можно ли использовать с Redux?**
A: Да, данные из `tableData` можно легко интегрировать в Redux store.

**Q: Поддерживается ли работа с вложенными объектами?**
A: Да, система работает с любыми JSON-сериализуемыми данными.

**Q: Можно ли настроить кастомную логику разрешения конфликтов?**
A: Да, через параметр `conflictResolver` в конфигурации.

### Известные ограничения

- IndexedDB не поддерживается в приватном режиме Safari
- Максимальный размер базы данных зависит от браузера (обычно ~1GB)
- Требуется HTTPS для Service Worker в production

---

## 🎉 Заключение

Система синхронизации предоставляет мощный и гибкий инструмент для создания offline-first приложений с автоматической синхронизацией данных. Благодаря модульной архитектуре и TypeScript типизации, система легко расширяется и поддерживается.

