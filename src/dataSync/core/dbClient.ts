// Global state for database version management
class DatabaseVersionManager {
  private static instance: DatabaseVersionManager;
  private dbVersion: number | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;
  private dbInstance: IDBDatabase | null = null;
  private initializingTables = new Set<string>();
  private readonly dbName = 'AgroFinanceDB';

  static getInstance(): DatabaseVersionManager {
    if (!DatabaseVersionManager.instance) {
      DatabaseVersionManager.instance = new DatabaseVersionManager();
    }
    return DatabaseVersionManager.instance;
  }

  async ensureDatabase(requiredTables: string[]): Promise<IDBDatabase> {
    // Если база уже открыта, проверяем что все нужные таблицы есть
    if (this.dbInstance) {
      const missingTables = requiredTables.filter(table => 
        !this.dbInstance!.objectStoreNames.contains(table)
      );
      
      if (missingTables.length === 0) {
        console.log('✅ База данных уже открыта со всеми нужными таблицами');
        return this.dbInstance;
      }
      
      // Если не хватает таблиц, закрываем и пересоздаем
      console.log(`⚠️ Не хватает таблиц: ${missingTables.join(', ')}, пересоздаем базу`);
      this.dbInstance.close();
      this.dbInstance = null;
      this.dbPromise = null;
    }

    // Если процесс инициализации уже идет, ждем его
    if (this.dbPromise) {
      console.log('⏳ Ожидание завершения инициализации базы данных...');
      return this.dbPromise;
    }

    // Создаем новый промис инициализации
    this.dbPromise = this.initializeDatabase(requiredTables);
    return this.dbPromise;
  }

  private async initializeDatabase(requiredTables: string[]): Promise<IDBDatabase> {
    console.log('🔧 DatabaseVersionManager: Инициализация базы данных...');
    console.log('📋 Требуемые таблицы:', requiredTables);

    // Определяем версию базы данных
    if (this.dbVersion === null) {
      this.dbVersion = await this.determineDbVersion();
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion!);

      request.onupgradeneeded = (event) => {
        console.log('🔧 DatabaseVersionManager: onupgradeneeded сработал');
        const db = (event.target as IDBOpenDBRequest).result;
        console.log(`🔧 Обновление схемы базы данных до версии ${db.version}`);
        
        // Создаем только отсутствующие таблицы
        requiredTables.forEach(table => {
          if (!db.objectStoreNames.contains(table)) {
            console.log(`📋 Создаём объект-хранилище: ${table}`);
            db.createObjectStore(table, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => {
        console.log('🔧 DatabaseVersionManager: onsuccess сработал');
        this.dbInstance = request.result;
        console.log(`✅ База данных открыта, версия: ${this.dbInstance.version}`);
        
        // Проверяем что все нужные объект-хранилища существуют
        const missingTables = requiredTables.filter(table => 
          !this.dbInstance!.objectStoreNames.contains(table)
        );
        
        if (missingTables.length > 0) {
          console.warn(`⚠️ Отсутствуют объект-хранилища: ${missingTables.join(', ')}`);
          this.dbInstance.close();
          this.dbInstance = null;
          this.dbPromise = null;
          // Увеличиваем версию для пересоздания
          this.dbVersion = this.dbVersion! + 1;
          console.log('🔧 DatabaseVersionManager: Перезапускаем init с версией:', this.dbVersion);
          // Рекурсивно пытаемся снова
          this.initializeDatabase(requiredTables).then(resolve).catch(reject);
          return;
        }
        
        console.log('✅ DatabaseVersionManager: Инициализация завершена успешно');
        resolve(this.dbInstance);
      };

      request.onerror = () => {
        console.error('❌ DatabaseVersionManager: Ошибка открытия базы данных:', request.error);
        this.dbPromise = null;
        reject(request.error);
      };

      request.onblocked = () => {
        console.warn('⚠️ DatabaseVersionManager: Открытие БД заблокировано');
      };
    });
  }

  private async determineDbVersion(): Promise<number> {
    return new Promise((resolve) => {
      console.log('🔧 DatabaseVersionManager: Пытаемся определить версию БД...');
      const request = indexedDB.open(this.dbName);
      
      request.onsuccess = () => {
        const db = request.result;
        const currentVersion = db.version;
        db.close();
        
        // Используем текущую версию + 1 для создания объект-хранилищ
        const newVersion = currentVersion + 1;
        console.log(`🔢 Определена версия базы: текущая ${currentVersion}, новая ${newVersion}`);
        resolve(newVersion);
      };

      request.onerror = () => {
        // Если база не существует, используем версию 1
        console.log('🔢 База данных не существует, используем версию 1');
        resolve(1);
      };
    });
  }

  close(): void {
    if (this.dbInstance) {
      this.dbInstance.close();
      this.dbInstance = null;
    }
    this.dbPromise = null;
  }

  reset(): void {
    this.close();
    this.dbVersion = null;
  }
}

export class DbClient {
  private dbManager = DatabaseVersionManager.getInstance();
  private db: IDBDatabase | null = null;

  async init(tables: string[]): Promise<void> {
    if (this.db) {
      console.log('✅ DbClient: База данных уже инициализирована');
      return;
    }

    console.log('🔧 DbClient: Начинаем init с таблицами:', tables);
    
    try {
      this.db = await this.dbManager.ensureDatabase(tables);
      console.log('✅ DbClient: Инициализация завершена успешно');
    } catch (error) {
      console.error('❌ DbClient: Ошибка инициализации:', error);
      throw error;
    }
  }

  private ensureInitialized() {
    if (!this.db) throw new Error('Database not initialized. Please call init() first.');
  }

  async getTable(tableName: string): Promise<any[]> {
    this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([tableName], 'readonly');
      const store = transaction.objectStore(tableName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async putAll(tableName: string, records: any[]): Promise<void> {
    this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([tableName], 'readwrite');
      const store = transaction.objectStore(tableName);
      records.forEach(record => store.put(record));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async insert(tableName: string, record: any): Promise<void> {
    this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([tableName], 'readwrite');
      const store = transaction.objectStore(tableName);
      const request = store.add(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteRecord(tableName: string, key: number): Promise<void> {
    this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([tableName], 'readwrite');
      const store = transaction.objectStore(tableName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  close(): void {
    // Не закрываем базу напрямую, оставляем это менеджеру
    this.db = null;
  }
}

export const dbClient = new DbClient();

export const clearDatabase = async (dbName: string = 'AgroFinanceDB'): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log(`🗑️ Удаляем базу данных: ${dbName}`);
    
    // Сначала закрываем все соединения
    DatabaseVersionManager.getInstance().close();
    
    const deleteRequest = indexedDB.deleteDatabase(dbName);
    
    deleteRequest.onsuccess = () => {
      console.log(`✅ База данных ${dbName} успешно удалена`);
      // Сбрасываем менеджер после удаления
      DatabaseVersionManager.getInstance().reset();
      resolve();
    };
    
    deleteRequest.onerror = () => {
      console.error(`❌ Ошибка удаления базы данных ${dbName}:`, deleteRequest.error);
      reject(deleteRequest.error);
    };
    
    deleteRequest.onblocked = () => {
      console.warn(`⚠️ Удаление базы данных ${dbName} заблокировано (закройте все вкладки с приложением)`);
    };
  });
};