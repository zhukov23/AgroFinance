import React from 'react';

export const formatBankStatus = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const statusConfig = {
    'active': { bg: 'bg-success', text: 'Активный' },
    'inactive': { bg: 'bg-warning', text: 'Неактивный' },
    'liquidation': { bg: 'bg-danger', text: 'Ликвидация' },
    'reorganization': { bg: 'bg-info', text: 'Реорганизация' }
  };
  
  const config = statusConfig[value as keyof typeof statusConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatBankRating = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const ratingConfig = {
    'excellent': { icon: '⭐⭐⭐⭐⭐', text: 'Отличный' },
    'good': { icon: '⭐⭐⭐⭐', text: 'Хороший' },
    'average': { icon: '⭐⭐⭐', text: 'Средний' },
    'poor': { icon: '⭐⭐', text: 'Низкий' },
    'bad': { icon: '⭐', text: 'Плохой' }
  };
  
  const config = ratingConfig[value as keyof typeof ratingConfig] || { icon: '', text: value };
  return (
    <span title={config.text}>
      {config.icon}
    </span>
  );
};

export const formatBankTags = (value: string[] | string) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const tags = Array.isArray(value) ? value : [value];
  
  const tagConfig = {
    'системно_значимый': { bg: 'bg-danger', text: 'Системно значимый' },
    'региональный': { bg: 'bg-info', text: 'Региональный' },
    'частный': { bg: 'bg-primary', text: 'Частный' },
    'государственный': { bg: 'bg-success', text: 'Государственный' },
    'иностранный': { bg: 'bg-warning', text: 'Иностранный' },
    'инвестиционный': { bg: 'bg-dark', text: 'Инвестиционный' },
    'корпоративный': { bg: 'bg-secondary', text: 'Корпоративный' },
    'розничный': { bg: 'bg-light text-dark', text: 'Розничный' }
  };
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {tags.slice(0, 2).map((tag, index) => {
        const config = tagConfig[tag as keyof typeof tagConfig] || { bg: 'bg-secondary', text: tag };
        return (
          <span key={index} className={`badge ${config.bg}`} style={{ fontSize: '0.7em' }}>
            {config.text}
          </span>
        );
      })}
      {tags.length > 2 && (
        <span className="badge bg-light text-dark" style={{ fontSize: '0.7em' }}>
          +{tags.length - 2}
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
