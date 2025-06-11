import { ApiClient } from './apiClient';
import { DbClient } from './dbClient';

export class SyncManager {
  private api: ApiClient;
  public db: DbClient; // Делаем публичным для доступа из компонента
  private tables: string[];

  constructor(tables: string[], apiBaseUrl?: string) {
    this.api = new ApiClient(apiBaseUrl);
    this.db = new DbClient();
    this.tables = tables;
  }

  async init(): Promise<void> {
    console.log('🔧 Инициализация SyncManager...');
    await this.db.init(this.tables);
  }

  async sync(): Promise<void> {
    for (const table of this.tables) {
      try {
        console.log(`🔍 Проверяем версию таблицы: ${table}`);
        const serverVersion = await this.api.getTableVersion(table);
        const localVersion = await this.getLocalVersion(table);

        if (serverVersion !== localVersion) {
          console.log(`📥 Обновляем данные таблицы ${table}...`);
          const data = await this.api.getTableData(table);
          await this.db.putAll(table, data);
          await this.saveLocalVersion(table, serverVersion);
          console.log(`✅ Таблица ${table} обновлена`);
        } else {
          console.log(`✅ Таблица ${table} актуальна`);
        }
      } catch (error) {
        console.error(`❌ Ошибка обновления таблицы ${table}:`, error);
      }
    }
  }

  // Добавляем методы для работы с версиями
  async getLocalVersion(table: string): Promise<string> {
    const version = localStorage.getItem(`version_${table}`);
    return version || 'none';
  }

  async saveLocalVersion(table: string, version: string): Promise<void> {
    localStorage.setItem(`version_${table}`, version);
  }

  // Метод для получения данных таблицы
  async getTableData(tableName: string): Promise<any[]> {
    return await this.db.getTable(tableName);
  }

  // Метод для очистки версии таблицы
  async clearTableVersion(tableName: string): Promise<void> {
    localStorage.removeItem(`version_${tableName}`);
  }
}