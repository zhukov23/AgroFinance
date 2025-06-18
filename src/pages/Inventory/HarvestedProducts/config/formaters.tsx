import React from 'react';

export const formatQuantity = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(value);
  
  return <span className="badge bg-primary">📦 {formatted} т</span>;
};

export const formatHarvestArea = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-success">🌾 {formatted} га</span>;
};

export const formatMoistureContent = (value: number) => {
  if (value === null || value === undefined) return <span className="text-muted">—</span>;
  
  let badgeClass = 'bg-secondary';
  let icon = '💧';
  
  if (value <= 10) {
    badgeClass = 'bg-danger';
    icon = '🔥';
  } else if (value <= 14) {
    badgeClass = 'bg-warning';
    icon = '⚠️';
  } else if (value <= 18) {
    badgeClass = 'bg-success';
    icon = '✅';
  } else if (value <= 25) {
    badgeClass = 'bg-info';
    icon = '💧';
  } else {
    badgeClass = 'bg-danger';
    icon = '🌊';
  }
  
  return <span className={`badge ${badgeClass}`}>{icon} {value}%</span>;
};

export const formatProteinContent = (value: number) => {
  if (value === null || value === undefined) return <span className="text-muted">—</span>;
  
  let badgeClass = 'bg-secondary';
  let category = '';
  
  if (value <= 8) {
    badgeClass = 'bg-danger';
    category = 'Низкий';
  } else if (value <= 12) {
    badgeClass = 'bg-warning';
    category = 'Средний';
  } else if (value <= 16) {
    badgeClass = 'bg-success';
    category = 'Хороший';
  } else if (value <= 20) {
    badgeClass = 'bg-info';
    category = 'Высокий';
  } else {
    badgeClass = 'bg-primary';
    category = 'Очень высокий';
  }
  
  return <span className={`badge ${badgeClass}`}>💪 {value}% ({category})</span>;
};

export const formatQualityClass = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const classConfig = {
    '1': { bg: 'bg-success', text: '🥇 1 класс' },
    '2': { bg: 'bg-info', text: '🥈 2 класс' },
    '3': { bg: 'bg-warning', text: '🥉 3 класс' },
    '4': { bg: 'bg-secondary', text: '4 класс' },
    'extra': { bg: 'bg-primary', text: '👑 Экстра' },
    'feed': { bg: 'bg-dark', text: '🐄 Кормовой' }
  };
  
  const config = classConfig[value as keyof typeof classConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatGrade = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const gradeConfig = {
    'A': { bg: 'bg-success', text: '🅰️ Сорт A' },
    'B': { bg: 'bg-info', text: '🅱️ Сорт B' },
    'C': { bg: 'bg-warning', text: '🆎 Сорт C' },
    'D': { bg: 'bg-secondary', text: '🅾️ Сорт D' },
    'premium': { bg: 'bg-primary', text: '💎 Премиум' },
    'standard': { bg: 'bg-info', text: '📋 Стандарт' },
    'commercial': { bg: 'bg-secondary', text: '🏪 Коммерческий' }
  };
  
  const config = gradeConfig[value as keyof typeof gradeConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatStatus = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const statusConfig = {
    'stored': { bg: 'bg-success', text: '📦 На складе' },
    'processing': { bg: 'bg-warning', text: '⚙️ В переработке' },
    'sold': { bg: 'bg-info', text: '💰 Продано' },
    'reserved': { bg: 'bg-primary', text: '🔒 Зарезервировано' },
    'damaged': { bg: 'bg-danger', text: '❌ Испорчено' },
    'expired': { bg: 'bg-dark', text: '⏰ Просрочено' }
  };
  
  const config = statusConfig[value as keyof typeof statusConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatRating = (value: number) => {
  if (value === null || value === undefined) return <span className="text-muted">—</span>;
  
  const stars = '⭐'.repeat(Math.min(value, 5));
  let badgeClass = 'bg-secondary';
  
  if (value >= 4) badgeClass = 'bg-success';
  else if (value >= 3) badgeClass = 'bg-warning';
  else if (value >= 2) badgeClass = 'bg-danger';
  
  return <span className={`badge ${badgeClass}`}>{stars} ({value})</span>;
};

export const formatPrice = (value: number, label: string = 'руб/т') => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-success">💰 {formatted} {label}</span>;
};

export const formatDate = (value: string) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const date = new Date(value);
  const formatted = date.toLocaleDateString('ru-RU');
  
  return <span className="badge bg-info">📅 {formatted}</span>;
};

export const formatPercentage = (value: number, label: string = '') => {
  if (value === null || value === undefined) return <span className="text-muted">—</span>;
  
  let badgeClass = 'bg-info';
  if (value > 50) badgeClass = 'bg-warning';
  if (value > 80) badgeClass = 'bg-danger';
  
  return <span className={`badge ${badgeClass}`}>{label} {value}%</span>;
};

export const formatTestWeight = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  return <span className="badge bg-secondary">⚖️ {value} г/л</span>;
};

export const formatTags = (value: string[]) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <span className="text-muted">—</span>;
  }
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {value.slice(0, 3).map((tag, index) => (
        <span key={index} className="badge bg-light text-dark" style={{ fontSize: '0.7em' }}>
          {tag}
        </span>
      ))}
      {value.length > 3 && (
        <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
          +{value.length - 3}
        </span>
      )}
    </div>
  );
};

export const formatActiveStatus = (value: boolean | null) => {
  // Если null или undefined - считаем активным
  const isActive = value !== false;
  
  return isActive ? (
    <span className="badge bg-success">
      <i className="ri-check-line me-1"></i>
      Активно
    </span>
  ) : (
    <span className="badge bg-danger">
      <i className="ri-close-line me-1"></i>
      Неактивно
    </span>
  );
};

export const formatQuantityAvailable = (total: number, sold: number = 0, processed: number = 0, reserved: number = 0, damaged: number = 0) => {
  if (!total) return <span className="text-muted">—</span>;
  
  const available = total - (sold + processed + reserved + damaged);
  let badgeClass = 'bg-success';
  
  if (available <= 0) badgeClass = 'bg-danger';
  else if (available < total * 0.3) badgeClass = 'bg-warning';
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(available);
  
  return <span className={`badge ${badgeClass}`}>📦 {formatted} т</span>;
};

export const formatStorageLocation = (locationName: string, locationId?: number) => {
  if (!locationName) return <span className="text-muted">—</span>;
  
  return (
    <span className="badge bg-primary">
      <i className="ri-building-line me-1"></i>
      {locationName}
      {locationId && <small className="ms-1">#{locationId}</small>}
    </span>
  );
}; 
