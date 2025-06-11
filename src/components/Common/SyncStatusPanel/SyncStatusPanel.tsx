import React from 'react';
import { SyncStatusPanelProps, StatusItemProps, MetricsPanelProps } from './SyncStatusPanel.types';
import { SyncStatusEnum } from '../../../dataSync/utils/syncTypes';

// Утилитарные функции
const getStatusColor = (status: string): string => {
  switch (status) {
    case SyncStatusEnum.SUCCESS:
      return '#4ade80';
    case SyncStatusEnum.ERROR:
      return '#f87171';
    case SyncStatusEnum.CHECKING:
    case SyncStatusEnum.SYNCING:
    case SyncStatusEnum.CREATING:
      return '#fbbf24';
    default:
      return '#9ca3af';
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case SyncStatusEnum.SUCCESS:
      return '✅';
    case SyncStatusEnum.ERROR:
      return '❌';
    case SyncStatusEnum.CHECKING:
      return '🔍';
    case SyncStatusEnum.SYNCING:
      return '🔄';
    case SyncStatusEnum.CREATING:
      return '🏗️';
    default:
      return '⏸️';
  }
};

const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 1000) return `${milliseconds}мс`;
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}с`;
  return `${(milliseconds / 60000).toFixed(1)}мин`;
};

const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Компонент для отображения метрик
const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, compact }) => {
  if (compact) {
    return (
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        <span>✅ {metrics.successfulTables}/{metrics.totalTables} таблиц</span>
        <span style={{ marginLeft: '12px' }}>📊 {metrics.totalRecordsProcessed} записей</span>
        <span style={{ marginLeft: '12px' }}>⏱️ {formatDuration(metrics.syncDuration)}</span>
      </div>
    );
  }

  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '6px',
      border: '1px solid #e5e7eb'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>
        📈 Метрики синхронизации
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', fontSize: '13px' }}>
        <div>
          <span style={{ color: '#6b7280' }}>Успешно: </span>
          <span style={{ fontWeight: 'bold', color: '#059669' }}>{metrics.successfulTables}/{metrics.totalTables}</span>
        </div>
        <div>
          <span style={{ color: '#6b7280' }}>Обработано записей: </span>
          <span style={{ fontWeight: 'bold' }}>{metrics.totalRecordsProcessed}</span>
        </div>
        <div>
          <span style={{ color: '#6b7280' }}>Время выполнения: </span>
          <span style={{ fontWeight: 'bold' }}>{formatDuration(metrics.syncDuration)}</span>
        </div>
        <div>
          <span style={{ color: '#6b7280' }}>Последняя синхронизация: </span>
          <span style={{ fontWeight: 'bold' }}>{formatTimestamp(metrics.lastSyncTime)}</span>
        </div>
      </div>
    </div>
  );
};

// Компонент для отображения статуса одной таблицы
const StatusItem: React.FC<StatusItemProps> = ({ status, showTimestamps, compact }) => {
  const statusColor = getStatusColor(status.status);
  const statusIcon = getStatusIcon(status.status);

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 8px',
        backgroundColor: '#f9fafb',
        borderRadius: '4px',
        border: `1px solid ${statusColor}40`
      }}>
        <span>{statusIcon}</span>
        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{status.table}</span>
        <span style={{ fontSize: '11px', color: statusColor, textTransform: 'uppercase' }}>
          {status.status}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      padding: '12px',
      border: `2px solid ${statusColor}`,
      borderRadius: '6px',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span>{statusIcon}</span>
        <strong style={{ fontSize: '14px' }}>{status.table}</strong>
        <span style={{ 
          color: statusColor, 
          fontSize: '12px', 
          textTransform: 'uppercase',
          fontWeight: 'bold'
        }}>
          {status.status}
        </span>
      </div>
      
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
        {status.message}
      </div>
      
      {showTimestamps && status.localVersion && status.serverVersion && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          Локальная версия: {status.localVersion} | Серверная версия: {status.serverVersion}
        </div>
      )}
    </div>
  );
};

// Основной компонент панели статуса
export const SyncStatusPanel: React.FC<SyncStatusPanelProps> = ({
  statuses,
  lastResult,
  metrics,
  isLoading = false,
  title = 'Статус синхронизации',
  showMetrics = true,
  showTimestamps = true,
  compact = false,
  className = ''
}) => {
  if (statuses.length === 0 && !isLoading) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    marginTop: compact ? '12px' : '20px',
    ...(className && {})
  };

  return (
    <div style={containerStyle} className={className}>
      <h2 style={{ 
        fontSize: compact ? '16px' : '18px', 
        marginBottom: compact ? '8px' : '12px',
        color: '#374151',
        fontWeight: 'bold'
      }}>
        📊 {title}
      </h2>
      
      {isLoading && statuses.length === 0 && (
        <div style={{
          padding: '16px',
          textAlign: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          color: '#6b7280'
        }}>
          🔄 Инициализация синхронизации...
        </div>
      )}

      {statuses.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: compact ? '6px' : '10px' 
        }}>
          {statuses.map((status) => (
            <StatusItem
              key={status.table}
              status={status}
              showTimestamps={showTimestamps}
              compact={compact}
            />
          ))}
        </div>
      )}

      {showMetrics && metrics && (
        <div style={{ marginTop: compact ? '8px' : '16px' }}>
          <MetricsPanel metrics={metrics} compact={compact} />
        </div>
      )}

      {lastResult && !lastResult.success && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#fef2f2',
          borderRadius: '6px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
            <span>⚠️</span>
            <span style={{ fontWeight: 'bold' }}>Синхронизация завершилась с ошибками</span>
          </div>
          <div style={{ fontSize: '12px', color: '#7f1d1d', marginTop: '4px' }}>
            Проверьте детали выше или обратитесь к администратору
          </div>
        </div>
      )}
    </div>
  );
};