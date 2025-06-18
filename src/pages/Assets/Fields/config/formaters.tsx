import React from 'react';

export const formatSoilType = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const soilConfig = {
    'чернозем': { bg: 'bg-dark', text: '🖤 Чернозем' },
    'суглинок': { bg: 'bg-secondary', text: '🟤 Суглинок' },
    'супесь': { bg: 'bg-warning', text: '🟡 Супесь' },
    'песок': { bg: 'bg-light text-dark', text: '🟨 Песок' },
    'глина': { bg: 'bg-danger', text: '🔴 Глина' },
    'торф': { bg: 'bg-info', text: '🟫 Торф' },
    'солонец': { bg: 'bg-secondary', text: '⚪ Солонец' },
    'другой': { bg: 'bg-secondary', text: '❓ Другой' }
  };
  
  const config = soilConfig[value as keyof typeof soilConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatIrrigationType = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const irrigationConfig = {
    'отсутствует': { bg: 'bg-secondary', text: '❌ Отсутствует' },
    'капельное': { bg: 'bg-primary', text: '💧 Капельное' },
    'дождевание': { bg: 'bg-info', text: '🌧️ Дождевание' },
    'поверхностное': { bg: 'bg-warning', text: '🌊 Поверхностное' },
    'подпочвенное': { bg: 'bg-success', text: '⬇️ Подпочвенное' }
  };
  
  const config = irrigationConfig[value as keyof typeof irrigationConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatFieldStatus = (value: string) => {
  if (!value) return <span className="badge bg-secondary">—</span>;
  
  const statusConfig = {
    'активное': { bg: 'bg-success', text: '✅ Активное' },
    'под_паром': { bg: 'bg-warning', text: '🌱 Под паром' },
    'в_севообороте': { bg: 'bg-primary', text: '🔄 В севообороте' },
    'на_реконструкции': { bg: 'bg-info', text: '🚧 На реконструкции' },
    'неиспользуемое': { bg: 'bg-danger', text: '❌ Неиспользуемое' },
    'арендованное': { bg: 'bg-secondary', text: '📋 Арендованное' }
  };
  
  const config = statusConfig[value as keyof typeof statusConfig] || { bg: 'bg-secondary', text: value };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export const formatArea = (value: number) => {
  if (!value) return <span className="text-muted">—</span>;
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  }).format(value);
  
  let badgeClass = 'bg-primary';
  if (value >= 1000) badgeClass = 'bg-danger';
  else if (value >= 500) badgeClass = 'bg-warning';
  else if (value >= 100) badgeClass = 'bg-success';
  else badgeClass = 'bg-info';
  
  return <span className={`badge ${badgeClass}`}>🌾 {formatted} га</span>;
};

export const formatSoilQuality = (value: number) => {
  if (value === null || value === undefined) return <span className="text-muted">—</span>;
  
  let badgeClass = 'bg-secondary';
  let category = '';
  
  if (value >= 9) {
    badgeClass = 'bg-success';
    category = 'Отличное';
  } else if (value >= 7) {
    badgeClass = 'bg-info';
    category = 'Хорошее';
  } else if (value >= 5) {
    badgeClass = 'bg-warning';
    category = 'Среднее';
  } else if (value >= 3) {
    badgeClass = 'bg-danger';
    category = 'Низкое';
  } else {
    badgeClass = 'bg-dark';
    category = 'Очень низкое';
  }
  
  return <span className={`badge ${badgeClass}`}>🌱 {value}/10 ({category})</span>;
};

export const formatLocation = (location: any) => {
  if (!location || typeof location !== 'object') return <span className="text-muted">—</span>;
  
  const { lat, lng, address } = location;
  
  if (lat && lng) {
    return (
      <div className="d-flex flex-column">
        <span className="badge bg-primary mb-1">📍 {lat.toFixed(6)}, {lng.toFixed(6)}</span>
        {address && <small className="text-muted">{address}</small>}
      </div>
    );
  }
  
  if (address) {
    return <span className="badge bg-info">📍 {address}</span>;
  }
  
  return <span className="text-muted">—</span>;
};

export const formatSoilAnalysis = (analysis: any) => {
  if (!analysis || typeof analysis !== 'object') return <span className="text-muted">—</span>;
  
  const { ph, humus, N, P, K } = analysis;
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {ph && <span className="badge bg-info" style={{ fontSize: '0.7em' }}>pH: {ph}</span>}
      {humus && <span className="badge bg-success" style={{ fontSize: '0.7em' }}>Гумус: {humus}%</span>}
      {N && <span className="badge bg-warning" style={{ fontSize: '0.7em' }}>N: {N}</span>}
      {P && <span className="badge bg-danger" style={{ fontSize: '0.7em' }}>P: {P}</span>}
      {K && <span className="badge bg-primary" style={{ fontSize: '0.7em' }}>K: {K}</span>}
    </div>
  );
};

export const formatInfrastructure = (infrastructure: any) => {
  if (!infrastructure || typeof infrastructure !== 'object') return <span className="text-muted">—</span>;
  
  const { roads, water_sources, power_lines } = infrastructure;
  const elements = [];
  
  if (roads && Array.isArray(roads) && roads.length > 0) {
    elements.push(`🛣️ ${roads.join(', ')}`);
  }
  
  if (water_sources && Array.isArray(water_sources) && water_sources.length > 0) {
    elements.push(`💧 ${water_sources.join(', ')}`);
  }
  
  if (power_lines === true) {
    elements.push('⚡ ЛЭП');
  }
  
  if (elements.length === 0) return <span className="text-muted">—</span>;
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {elements.map((element, index) => (
        <span key={index} className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
          {element}
        </span>
      ))}
    </div>
  );
};

export const formatTerrainFeatures = (terrain: any) => {
  if (!terrain || typeof terrain !== 'object') return <span className="text-muted">—</span>;
  
  const { relief, slope, drainage } = terrain;
  const features = [];
  
  if (relief) features.push(`⛰️ ${relief}`);
  if (slope) features.push(`📐 Уклон: ${slope}°`);
  if (drainage) features.push(`💧 ${drainage}`);
  
  if (features.length === 0) return <span className="text-muted">—</span>;
  
  return (
    <div className="d-flex flex-wrap gap-1">
      {features.map((feature, index) => (
        <span key={index} className="badge bg-info" style={{ fontSize: '0.7em' }}>
          {feature}
        </span>
      ))}
    </div>
  );
};

export const formatRestrictions = (restrictions: any) => {
  if (!restrictions || typeof restrictions !== 'object') return <span className="text-muted">—</span>;
  
  const { types, description } = restrictions;
  
  if (types && Array.isArray(types) && types.length > 0) {
    return (
      <div className="d-flex flex-wrap gap-1">
        {types.slice(0, 3).map((type: string, index: number) => (
          <span key={index} className="badge bg-warning" style={{ fontSize: '0.7em' }}>
            ⚠️ {type}
          </span>
        ))}
        {types.length > 3 && (
          <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
            +{types.length - 3}
          </span>
        )}
      </div>
    );
  }
  
  if (description) {
    return <span className="badge bg-warning">⚠️ {description}</span>;
  }
  
  return <span className="text-muted">—</span>;
};

export const formatUsageHistory = (history: any) => {
  if (!history || typeof history !== 'object') return <span className="text-muted">—</span>;
  
  const { recent_crops, years } = history;
  
  if (recent_crops && Array.isArray(recent_crops) && recent_crops.length > 0) {
    return (
      <div className="d-flex flex-wrap gap-1">
        {recent_crops.slice(0, 3).map((crop: string, index: number) => (
          <span key={index} className="badge bg-success" style={{ fontSize: '0.7em' }}>
            🌱 {crop}
          </span>
        ))}
        {recent_crops.length > 3 && (
          <span className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
            +{recent_crops.length - 3}
          </span>
        )}
      </div>
    );
  }
  
  return <span className="text-muted">—</span>;
};

export const formatActiveStatus = (value: boolean | null) => {
  // Если null или undefined - считаем активным
  const isActive = value !== false;
  
  return isActive ? (
    <span className="badge bg-success">
      <i className="ri-check-line me-1"></i>
      Активное
    </span>
  ) : (
    <span className="badge bg-danger">
      <i className="ri-close-line me-1"></i>
      Неактивное
    </span>
  );
};

export const formatCadastralNumber = (value: string) => {
  if (!value) return <span className="text-muted">—</span>;
  
  return <span className="badge bg-dark">📋 {value}</span>;
};

export const formatBoundaries = (boundaries: any) => {
  if (!boundaries || typeof boundaries !== 'object') return <span className="text-muted">—</span>;
  
  const { type, coordinates } = boundaries;
  
  if (type === 'Polygon' && coordinates && Array.isArray(coordinates)) {
    const pointsCount = coordinates[0] ? coordinates[0].length : 0;
    return <span className="badge bg-primary">🗺️ Полигон ({pointsCount} точек)</span>;
  }
  
  return <span className="badge bg-info">🗺️ Границы определены</span>;
}; 
