// contexts/SyncMonitorContext.tsx
import React, { createContext, useState, useCallback } from 'react';

interface SyncInfo {
  id: string;
  tableName: string;
  displayName?: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  lastUpdate: string;
}

interface SyncMonitorContextType {
  activeSyncs: SyncInfo[];
  hasActiveSyncs: boolean;
  overallStatus: 'idle' | 'loading' | 'success' | 'error';
  lastUpdateTime: string | null;
  registerSync: (syncInfo: SyncInfo) => void;
  updateSync: (id: string, updates: Partial<SyncInfo>) => void;
  unregisterSync: (id: string) => void;
}

export const SyncMonitorContext = createContext<SyncMonitorContextType | null>(null);

export const SyncMonitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSyncs, setActiveSyncs] = useState<SyncInfo[]>([]);

  const registerSync = useCallback((syncInfo: SyncInfo) => {
    setActiveSyncs(prev => [...prev.filter(s => s.id !== syncInfo.id), syncInfo]);
  }, []);

  const updateSync = useCallback((id: string, updates: Partial<SyncInfo>) => {
    setActiveSyncs(prev => prev.map(sync => 
      sync.id === id ? { ...sync, ...updates, lastUpdate: new Date().toISOString() } : sync
    ));
  }, []);

  const unregisterSync = useCallback((id: string) => {
    setActiveSyncs(prev => prev.filter(sync => sync.id !== id));
  }, []);

  const hasActiveSyncs = activeSyncs.length > 0;
  const overallStatus = activeSyncs.some(s => s.status === 'loading') ? 'loading' :
                       activeSyncs.some(s => s.status === 'error') ? 'error' :
                       activeSyncs.every(s => s.status === 'success') ? 'success' : 'idle';
  
  const lastUpdateTime = activeSyncs.length > 0 ? 
    Math.max(...activeSyncs.map(s => new Date(s.lastUpdate).getTime())).toString() : null;

  return (
    <SyncMonitorContext.Provider value={{
      activeSyncs,
      hasActiveSyncs,
      overallStatus,
      lastUpdateTime,
      registerSync,
      updateSync,
      unregisterSync
    }}>
      {children}
    </SyncMonitorContext.Provider>
  );
};