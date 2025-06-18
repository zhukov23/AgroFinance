import React from 'react';

export const formatCategory = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const categoryConfig = {
    'почвообработка': { bg: 'bg-primary', text: '🚜 Почвообработка' },
    'посев': { bg: 'bg-success', text: '🌱 Посев' },
    'уборка': { bg: 'bg-warning', text: '🌾 Уборка' },
    'защита растений': { bg: 'bg-info', text: '🛡️ Защита растений' },
    'внесение удобрений': { bg: 'bg-secondary', text: '💧 Внесение удобрений' },
    'транспорт': { bg: 'bg-dark', text: '🚛 Транспорт' },
    'заготовка кормов': { bg: 'bg-success', text: '🌿 Заготовка кормов' },
    'другое': { bg: 'bg-secondary', text: '⚙️ Другое' }
  };
  
  const config = categoryConfig[value as keyof typeof categoryConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatFuelType = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const fuelConfig = {
    'дизель': { bg: 'bg-primary', text: '⛽ Дизель' },
    'бензин': { bg: 'bg-warning', text: '⛽ Бензин' },
    'газ': { bg: 'bg-info', text: '🔥 Газ' },
    'электричество': { bg: 'bg-success', text: '⚡ Электричество' },
    'гибрид': { bg: 'bg-secondary', text: '🔋 Гибрид' }
  };
  
  const config = fuelConfig[value as keyof typeof fuelConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatSeasonUsage = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const seasonConfig = {
    'весна': { bg: 'bg-success', text: '🌸 Весна' },
    'лето': { bg: 'bg-warning', text: '☀️ Лето' },
    'осень': { bg: 'bg-secondary', text: '🍂 Осень' },
    'зима': { bg: 'bg-info', text: '❄️ Зима' },
    'круглый год': { bg: 'bg-primary', text: '🔄 Круглый год' }
  };
  
  const config = seasonConfig[value as keyof typeof seasonConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatEnginePower = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  let badgeClass = 'bg-secondary';
  if (value >= 300) badgeClass = 'bg-danger';
  else if (value >= 150) badgeClass = 'bg-warning';
  else if (value >= 50) badgeClass = 'bg-success';
  else badgeClass = 'bg-info';
  
  return <span className={`badge ${badgeClass}`}>🔧 {formatted} л.с.</span>;
};

export const formatWorkingWidth = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-info">📏 {formatted} м</span>;
};

export const formatCapacity = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-primary">⚡ {formatted} га/ч</span>;
};

export const formatPrice = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  
  return <span className="badge bg-success">💰 {formatted} руб</span>;
};

export const formatWeight = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU').format(value);
  
  let unit = 'кг';
  let displayValue = value;
  
  if (value >= 1000) {
    displayValue = value / 1000;
    unit = 'т';
  }
  
  const finalFormatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: unit === 'т' ? 1 : 0
  }).format(displayValue);
  
  return <span className="badge bg-secondary">⚖️ {finalFormatted} {unit}</span>;
};

export const formatDimensions = (length?: number, width?: number, height?: number) => {
  if (!length && !width && !height) return <span className="text-muted">—</span>;
  
  const parts = [];
  if (length) parts.push(`Д:${length}`);
  if (width) parts.push(`Ш:${width}`);
  if (height) parts.push(`В:${height}`);
  
  return <span className="badge bg-info">📐 {parts.join(' × ')} мм</span>;
};

export const formatFuelConsumption = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-warning">⛽ {formatted} л/ч</span>;
};

export const formatWorkingSpeed = (minSpeed?: number, maxSpeed?: number) => {
  if (!minSpeed && !maxSpeed) return <span className="text-muted">—</span>;
  
  if (minSpeed && maxSpeed) {
    return <span className="badge bg-primary">🏃 {minSpeed}—{maxSpeed} км/ч</span>;
  } else if (maxSpeed) {
    return <span className="badge bg-primary">🏃 до {maxSpeed} км/ч</span>;
  } else if (minSpeed) {
    return <span className="badge bg-primary">🏃 от {minSpeed} км/ч</span>;
  }
  
  return <span className="text-muted">—</span>;
};

export const formatManufacturer = (manufacturer?: string, model?: string) => {
  if (!manufacturer && !model) return <span className="text-muted">—</span>;
  
  const text = manufacturer && model ? `${manufacturer} ${model}` : (manufacturer || model);
  return <span className="badge bg-dark">🏭 {text}</span>;
};

export const formatSuitableCrops = (value: string[]) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <span className="text-muted">—</span>;
  }
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {value.slice(0, 3).map((crop, index) => (
        <span key={index} className="badge bg-light text-dark" style={{ fontSize: '0.7em' }}>
          {crop}
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

export const formatCertifications = (value: string[]) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <span className="text-muted">—</span>;
  }
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {value.slice(0, 2).map((cert, index) => (
        <span key={index} className="badge bg-success" style={{ fontSize: '0.7em' }}>
          ✓ {cert}
        </span>
      ))}
      {value.length > 2 && (
        <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
          +{value.length - 2}
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
      Активна
    </span>
  ) : (
    <span className="badge bg-danger">
      <i className="ri-close-line me-1"></i>
      Неактивна
    </span>
  );
};

export const formatMaintenanceCost = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-warning">🔧 {formatted} руб/ч</span>;
};

export const formatDepreciationPeriod = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  let text = `${value} `;
  if (value === 1) text += 'год';
  else if (value >= 2 && value <= 4) text += 'года';
  else text += 'лет';
  
  return <span className="badge bg-info">📅 {text}</span>;
};

export const formatMinFieldSize = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-secondary">🌾 от {formatted} га</span>;
}; 
