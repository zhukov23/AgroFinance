import React from 'react';

export const formatCounterpartyType = (value: string[] | string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const type = Array.isArray(value) ? value[0] : value;
  const typeConfig = {
    'supplier': { bg: 'bg-primary', text: 'Поставщик' },
    'customer': { bg: 'bg-success', text: 'Покупатель' },
    'contractor': { bg: 'bg-info', text: 'Подрядчик' },
    'suppliercontractor': { bg: 'bg-warning', text: 'Поставщик/Подрядчик' }
  };
  
  const config = typeConfig[type as keyof typeof typeConfig] || { bg: 'bg-secondary', text: type };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatCreditLimit = (value: string | number) => {
  if (!value || value === '0' || value === 0) {
    return <span className="text-muted">—</span>;
  }
  
  const amount = typeof value === 'string' ? parseFloat(value) : value;
  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
  
  // Цветовая схема по размеру лимита
  let badgeClass = 'bg-success'; // зеленый для больших лимитов
  if (amount < 500000) badgeClass = 'bg-warning'; // желтый для средних
  if (amount < 100000) badgeClass = 'bg-danger'; // красный для малых
  
  return <span className={`badge ${badgeClass}`}>{formatted}</span>;
};

export const formatRating = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const ratingConfig = {
    'excellent': { icon: '⭐⭐⭐' },
    'good': { bg: 'bg-primary', text: 'Хорошо', icon: '⭐⭐' },
    'average': { bg: 'bg-warning', text: 'Средне', icon: '⭐' },
    'poor': { bg: 'bg-danger', text: 'Плохо', icon: '⚠️' }
  };
  
  const config = ratingConfig[value as keyof typeof ratingConfig] || { icon: '' };
  return (
    <span>
      {config.icon}
    </span>
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