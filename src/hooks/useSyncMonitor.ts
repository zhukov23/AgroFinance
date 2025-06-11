import { useContext } from 'react';
import { SyncMonitorContext } from '../contexts/SyncMonitorContext';

interface SyncInfo {
  id: string;
  tableName: string;
  displayName?: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  lastUpdate: string;
}

export const useSyncMonitor = () => {
  const context = useContext(SyncMonitorContext);
  
  if (!context) {
    return {
      activeSyncs: [],
      hasActiveSyncs: false,
      overallStatus: 'idle' as const,
      lastUpdateTime: null,
      registerSync: (syncInfo: SyncInfo) => {
        // Пустая функция для fallback
      },
      updateSync: (id: string, updates: Partial<SyncInfo>) => {
        // Пустая функция для fallback
      },
      unregisterSync: (id: string) => {
        // Пустая функция для fallback
      }
    };
  }
  
  return context;
};