import React from 'react';

export const formatStorageType = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const typeConfig = {
    'own': { bg: 'bg-success', text: '🏢 Собственное' },
    'external': { bg: 'bg-info', text: '🏭 Внешнее' }
  };
  
  const config = typeConfig[value as keyof typeof typeConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatCapacity = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-primary">📦 {formatted} т</span>;
};

export const formatRentalCost = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  
  return <span className="badge bg-warning">💰 {formatted} ₽/т</span>;
};

export const formatSecurityLevel = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const securityConfig = {
    'low': { bg: 'bg-warning', text: '🔓 Низкий' },
    'medium': { bg: 'bg-info', text: '🔐 Средний' },
    'high': { bg: 'bg-success', text: '🔒 Высокий' },
    'maximum': { bg: 'bg-primary', text: '🛡️ Максимальный' }
  };
  
  const config = securityConfig[value as keyof typeof securityConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatStatus = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const statusConfig = {
    'active': { bg: 'bg-success', text: '✅ Активный' },
    'maintenance': { bg: 'bg-warning', text: '🔧 Обслуживание' },
    'renovation': { bg: 'bg-info', text: '🏗️ Реконструкция' },
    'inactive': { bg: 'bg-danger', text: '❌ Неактивный' }
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

export const formatStorageTypesAllowed = (value: string[] | string) => {
  if (!value) return <span className="text-muted">—</span>;
  
  // Если это строка (JSON), парсим её
  let types: string[] = [];
  if (typeof value === 'string') {
    try {
      types = JSON.parse(value);
    } catch {
      return <span className="text-muted">—</span>;
    }
  } else if (Array.isArray(value)) {
    types = value;
  }
  
  if (types.length === 0) return <span className="text-muted">—</span>;
  
  const typeLabels = {
    'grain': '🌾 Зерно',
    'seeds': '🌱 Семена',
    'fertilizers': '🧪 Удобрения',
    'chemicals': '⚗️ Химикаты',
    'equipment': '🚜 Техника',
    'feed': '🐄 Корма',
    'fuel': '⛽ Топливо'
  };
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {types.slice(0, 3).map((type, index) => (
        <span key={index} className="badge bg-light text-dark" style={{ fontSize: '0.7em' }}>
          {typeLabels[type as keyof typeof typeLabels] || type}
        </span>
      ))}
      {types.length > 3 && (
        <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
          +{types.length - 3}
        </span>
      )}
    </div>
  );
};

export const formatTags = (value: string[] | string) => {
  if (!value) return <span className="text-muted">—</span>;
  
  // Если это строка (JSON), парсим её
  let tags: string[] = [];
  if (typeof value === 'string') {
    try {
      tags = JSON.parse(value);
    } catch {
      return <span className="text-muted">—</span>;
    }
  } else if (Array.isArray(value)) {
    tags = value;
  }
  
  if (tags.length === 0) return <span className="text-muted">—</span>;
  
  const tagLabels = {
    'climate_controlled': '🌡️ Климат-контроль',
    'refrigerated': '❄️ Холодильник',
    'automated': '🤖 Автоматизированный',
    'certified': '📜 Сертифицированный',
    'eco_friendly': '🌿 Экологичный',
    'fire_protected': '🔥 Пожаробезопасный',
    'pest_controlled': '🐛 Защита от вредителей',
    'modern': '🏢 Современный'
  };
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {tags.slice(0, 3).map((tag, index) => (
        <span key={index} className="badge bg-info" style={{ fontSize: '0.7em' }}>
          {tagLabels[tag as keyof typeof tagLabels] || tag}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
          +{tags.length - 3}
        </span>
      )}
    </div>
  );
};

export const formatEquipment = (
  hasGrainDryer: boolean,
  hasCleaningEquipment: boolean,
  hasScales: boolean,
  hasLoadingEquipment: boolean
) => {
  const equipment = [];
  
  if (hasGrainDryer) equipment.push('🌪️ Сушилка');
  if (hasCleaningEquipment) equipment.push('🧹 Очистка');
  if (hasScales) equipment.push('⚖️ Весы');
  if (hasLoadingEquipment) equipment.push('🚛 Погрузка');
  
  if (equipment.length === 0) return <span className="text-muted">—</span>;
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {equipment.map((item, index) => (
        <span key={index} className="badge bg-success" style={{ fontSize: '0.7em' }}>
          {item}
        </span>
      ))}
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

export const formatContact = (contactPerson: string, phone: string, email: string) => {
  if (!contactPerson && !phone && !email) {
    return <span className="text-muted">—</span>;
  }
  
  return (
    <div className="small">
      {contactPerson && <div className="fw-bold">{contactPerson}</div>}
      {phone && <div className="text-muted">📞 {phone}</div>}
      {email && <div className="text-muted">📧 {email}</div>}
    </div>
  );
};

export const formatContract = (contractNumber: string, startDate: string, endDate: string) => {
  if (!contractNumber && !startDate && !endDate) {
    return <span className="text-muted">—</span>;
  }
  
  return (
    <div className="small">
      {contractNumber && <div className="fw-bold">📋 {contractNumber}</div>}
      {(startDate || endDate) && (
        <div className="text-muted">
          📅 {startDate || '—'} / {endDate || '—'}
        </div>
      )}
    </div>
  );
}; 
