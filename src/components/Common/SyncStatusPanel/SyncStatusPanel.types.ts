import { SyncStatus, SyncResult, SyncMetrics } from '../../../dataSync/utils/syncTypes';

export interface SyncStatusPanelProps {
  statuses: SyncStatus[];
  lastResult?: SyncResult | null;
  metrics?: SyncMetrics | null;
  isLoading?: boolean;
  title?: string;
  showMetrics?: boolean;
  showTimestamps?: boolean;
  compact?: boolean;
  className?: string;
}

export interface StatusItemProps {
  status: SyncStatus;
  showTimestamps: boolean;
  compact: boolean;
}

export interface MetricsPanelProps {
  metrics: SyncMetrics;
  compact: boolean;
}