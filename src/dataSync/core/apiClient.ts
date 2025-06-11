// Простой API клиент для загрузки данных по таблицам
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async getTableData(tableName: string, lastSync: string = '1970-01-01T00:00:00.000Z'): Promise<any[]> {
    const url = `${this.baseUrl}/api/sync/${tableName}?since=${lastSync}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных для ${tableName}: ${response.status}`);
    }
    const data = await response.json();
    return data.changes || [];
  }

  async getTableVersion(tableName: string): Promise<string> {
    const url = `${this.baseUrl}/api/sync/version/${tableName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка получения версии для ${tableName}: ${response.status}`);
    }
    const data = await response.json();
    return data.version || 'v0.0';
  }
}
