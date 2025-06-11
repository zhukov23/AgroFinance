import React, { useEffect, useState } from 'react';
// import { useSyncData } from '../../hooks/useSyncData';
import { useSyncData } from '../../dataSync';
import { SyncStatusPanel } from '../../components/Common/SyncStatusPanel';
import { EquipmentTable } from '../../components/Equipment/EquipmentTable';
import { 
  equipmentSyncConfig, 
  syncOptions, 
  statusPanelConfig,
  equipmentColumns,
  tableConfig
} from './config';

const SyncTest: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState<any[]>([]);
  
  const {
    isInitialized,
    isLoading,
    syncStatuses,
    lastSyncResult,
    error,
    sync,
    resetDatabase,
    loadTableData,
    getSyncMetrics,
    clearError
  } = useSyncData(equipmentSyncConfig, syncOptions);
  
  console.log('🔍 SyncTest Debug:', {
    isInitialized,
    isLoading,
    error,
    syncStatuses: syncStatuses.length,
    equipmentSyncConfig
  });

  // Загружаем данные техники после инициализации или успешной синхронизации
  useEffect(() => {
    if (isInitialized && lastSyncResult?.success) {
      loadEquipmentData();
    }
  }, [isInitialized, lastSyncResult]);

  const loadEquipmentData = async () => {
    try {
      const data = await loadTableData('assets_equipment');
      setEquipmentData(data);
    } catch (err) {
      console.error('Ошибка загрузки данных техники:', err);
    }
  };

  const handleSync = async () => {
    try {
      clearError();
      const result = await sync();
      if (result?.success) {
        await loadEquipmentData();
      }
    } catch (err) {
      console.error('Ошибка синхронизации:', err);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('⚠️ Это полностью удалит базу данных IndexedDB. Продолжить?')) {
      return;
    }

    try {
      clearError();
      await resetDatabase();
      setEquipmentData([]);
    } catch (err) {
      console.error('Ошибка сброса базы данных:', err);
    }
  };

  const handleRowClick = (record: any) => {
    console.log('📋 Выбрана техника:', record);
    // Здесь можно добавить логику открытия модального окна или навигации
  };

  const syncMetrics = getSyncMetrics();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', color: '#374151' }}>
        🔄 Тест синхронизации - Справочник техники
      </h1>

      {/* Панель управления */}
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        gap: '12px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={handleSync}
          disabled={isLoading || !isInitialized}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isLoading ? '⏳ Синхронизация...' : '🔄 Синхронизировать'}
        </button>
        
        <button
          onClick={handleResetDatabase}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#9ca3af' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          💥 Сбросить базу данных
        </button>

        <button
          onClick={loadEquipmentData}
          disabled={isLoading || !isInitialized}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          📥 Загрузить данные
        </button>

        {equipmentData.length > 0 && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#6b7280'
          }}>
            📊 Загружено: {equipmentData.length} единиц техники
          </div>
        )}
      </div>

      {/* Отображение ошибок */}
      {error && (
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#fef2f2',
          borderRadius: '6px',
          border: '1px solid #fecaca',
          color: '#dc2626'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>❌</span>
            <span style={{ fontWeight: 'bold' }}>Ошибка:</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '14px' }}>{error}</div>
          <button
            onClick={clearError}
            style={{
              marginTop: '8px',
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: '1px solid #dc2626',
              borderRadius: '4px',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Закрыть
          </button>
        </div>
      )}

      {/* Статус инициализации */}
      {!isInitialized && !isLoading && (
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#fef3c7',
          borderRadius: '6px',
          border: '1px solid #f59e0b',
          color: '#92400e'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span>
            <span style={{ fontWeight: 'bold' }}>Система синхронизации не инициализирована</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '14px' }}>
            Проверьте подключение к серверу и попробуйте обновить страницу
          </div>
        </div>
      )}

      {/* Панель статуса синхронизации */}
      <SyncStatusPanel
        statuses={syncStatuses}
        lastResult={lastSyncResult}
        metrics={syncMetrics}
        isLoading={isLoading}
        {...statusPanelConfig}
      />

      {/* Таблица техники */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '16px', color: '#374151' }}>
          🚜 Справочник техники
        </h2>
        
        <EquipmentTable
          data={equipmentData}
          columns={equipmentColumns}
          isLoading={isLoading && equipmentData.length === 0}
          onRowClick={handleRowClick}
          {...tableConfig}
        />
      </div>

      {/* Информационная панель */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '6px' 
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#374151' }}>ℹ️ Информация:</h3>
        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#6b7280' }}>
          <li>Синхронизация проверяет версии таблиц на сервере</li>
          <li>Если таблица не найдена - загружает все данные</li>
          <li>Если версии не совпадают - загружает только изменения</li>
          <li>Кнопка "Сбросить базу данных" полностью очищает локальные данные</li>
          <li>Клик по строке в таблице выводит информацию в консоль</li>
        </ul>
        
        {isInitialized && (
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#9ca3af' }}>
            <strong>Таблицы для синхронизации:</strong> {equipmentSyncConfig.tables.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncTest;