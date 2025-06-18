import React from 'react';

export const formatMaterialType = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const typeConfig = {
    'seeds': { bg: 'bg-success', text: '🌱 Семена' },
    'seedlings': { bg: 'bg-info', text: '🌿 Рассада' },
    'bulbs': { bg: 'bg-warning', text: '🧅 Луковицы' },
    'tubers': { bg: 'bg-primary', text: '🥔 Клубни' },
    'cuttings': { bg: 'bg-dark', text: '🌿 Черенки' }
  };
  
  const config = typeConfig[value as keyof typeof typeConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatCropCategory = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const categoryConfig = {
    'cereals': { bg: 'bg-warning', text: '🌾 Зерновые' },
    'legumes': { bg: 'bg-success', text: '🫘 Бобовые' },
    'vegetables': { bg: 'bg-info', text: '🥕 Овощи' },
    'fruits': { bg: 'bg-danger', text: '🍎 Фрукты' },
    'herbs': { bg: 'bg-primary', text: '🌿 Травы' },
    'industrial': { bg: 'bg-dark', text: '🏭 Технические' },
    'fodder': { bg: 'bg-secondary', text: '🐄 Кормовые' }
  };
  
  const config = categoryConfig[value as keyof typeof categoryConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatSeasonType = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const seasonConfig = {
    'spring': { bg: 'bg-success', text: '🌸 Яровые' },
    'winter': { bg: 'bg-info', text: '❄️ Озимые' },
    'perennial': { bg: 'bg-warning', text: '🌳 Многолетние' },
    'annual': { bg: 'bg-primary', text: '📅 Однолетние' }
  };
  
  const config = seasonConfig[value as keyof typeof seasonConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatWaterRequirement = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const waterConfig = {
    'low': { bg: 'bg-warning', text: '💧 Низкая' },
    'medium': { bg: 'bg-info', text: '💧💧 Средняя' },
    'high': { bg: 'bg-primary', text: '💧💧💧 Высокая' }
  };
  
  const config = waterConfig[value as keyof typeof waterConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatResistanceLevel = (value: number) => {
  if (value === null || value === undefined) return <span className="text-muted">—</span>;
  
  if (value >= 8) return <span className="badge bg-success">🛡️ Высокая ({value})</span>;
  if (value >= 5) return <span className="badge bg-warning">🛡️ Средняя ({value})</span>;
  if (value >= 3) return <span className="badge bg-danger">🛡️ Низкая ({value})</span>;
  return <span className="badge bg-dark">🛡️ Очень низкая ({value})</span>;
};

export const formatMaturityDays = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  let category = '';
  let badgeClass = 'bg-secondary';
  
  if (value <= 90) {
    category = 'Скороспелый';
    badgeClass = 'bg-success';
  } else if (value <= 120) {
    category = 'Среднеспелый';
    badgeClass = 'bg-warning';
  } else {
    category = 'Позднеспелый';
    badgeClass = 'bg-info';
  }
  
  return (
    <span className={`badge ${badgeClass}`}>
      ⏱️ {value} дней ({category})
    </span>
  );
};

export const formatPlantingRate = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-primary">🌱 {formatted} кг/га</span>;
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

export const formatStatus = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const statusConfig = {
    'active': { bg: 'bg-success', text: '✅ Активный' },
    'discontinued': { bg: 'bg-danger', text: '❌ Снят с производства' },
    'seasonal': { bg: 'bg-warning', text: '⏰ Сезонный' },
    'trial': { bg: 'bg-info', text: '🧪 Испытания' }
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
