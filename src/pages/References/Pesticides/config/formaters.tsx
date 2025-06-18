// src/pages/References/Pesticides/config/formaters.tsx

import React from 'react';

/**
 * Форматтеры для отображения данных пестицидов в таблице
 */

// Форматтер для типа пестицида
export const formatPesticideType = (type: string) => {
  const types: Record<string, string> = {
    herbicide: 'Гербицид',
    fungicide: 'Фунгицид', 
    insecticide: 'Инсектицид',
    acaricide: 'Акарицид',
    nematicide: 'Нематицид',
    rodenticide: 'Родентицид',
    growth_regulator: 'Регулятор роста',
    adjuvant: 'Адъювант',
    biocide: 'Биоцид',
    combination: 'Комбинированный'
  };
  return types[type] || type;
};

// Форматтер для класса опасности
export const formatHazardClass = (hazardClass: string) => {
  const classes: Record<string, { label: string; color: string }> = {
    'I': { label: 'I класс (чрезвычайно опасные)', color: 'danger' },
    'II': { label: 'II класс (высокоопасные)', color: 'warning' },
    'III': { label: 'III класс (умеренно опасные)', color: 'info' },
    'IV': { label: 'IV класс (малоопасные)', color: 'success' }
  };
  
  const classInfo = classes[hazardClass];
  if (!classInfo) return hazardClass;
  
  return (
    <span className={`badge bg-${classInfo.color}`}>
      {classInfo.label}
    </span>
  );
};

// Форматтер для физической формы
export const formatPhysicalForm = (form: string) => {
  const forms: Record<string, string> = {
    liquid: 'Жидкость',
    powder: 'Порошок',
    granules: 'Гранулы',
    emulsion: 'Эмульсия',
    suspension: 'Суспензия',
    tablets: 'Таблетки',
    capsules: 'Капсулы',
    gel: 'Гель',
    aerosol: 'Аэрозоль'
  };
  return forms[form] || form;
};

// Форматтер для статуса регистрации
export const formatRegistrationStatus = (status: string) => {
  const statuses: Record<string, { label: string; color: string }> = {
    active: { label: 'Активна', color: 'success' },
    expired: { label: 'Истекла', color: 'danger' },
    suspended: { label: 'Приостановлена', color: 'warning' },
    cancelled: { label: 'Отменена', color: 'secondary' }
  };
  
  const statusInfo = statuses[status];
  if (!statusInfo) return status;
  
  return (
    <span className={`badge bg-${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
};

// Форматтер для активных веществ
export const formatActiveSubstances = (substances: any[]) => {
  if (!Array.isArray(substances) || substances.length === 0) {
    return <span className="text-muted">Не указано</span>;
  }
  
  return (
    <div>
      {substances.slice(0, 2).map((substance, index) => (
        <div key={index} className="small">
          <strong>{substance.substance}</strong> - {substance.concentration}{substance.unit}
        </div>
      ))}
      {substances.length > 2 && (
        <div className="small text-muted">
          +{substances.length - 2} веществ
        </div>
      )}
    </div>
  );
};

// Форматтер для цены
export const formatPrice = (price: number, currency: string = 'RUB', unit?: string) => {
  if (!price) return <span className="text-muted">Не указана</span>;
  
  const currencySymbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€'
  };
  
  const symbol = currencySymbols[currency] || currency;
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(price);
  
  return (
    <span>
      {formattedPrice} {symbol}
      {unit && <span className="text-muted">/{unit}</span>}
    </span>
  );
};

// Форматтер для размера упаковки
export const formatPackageSize = (size: number, unit: string) => {
  if (!size || !unit) return <span className="text-muted">Не указано</span>;
  
  return `${size} ${unit}`;
};

// Форматтер для срока годности
export const formatShelfLife = (months: number) => {
  if (!months) return <span className="text-muted">Не указан</span>;
  
  if (months < 12) {
    return `${months} мес.`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} г.`;
    } else {
      return `${years} г. ${remainingMonths} мес.`;
    }
  }
};

// Форматтер для статуса активности
export const formatActiveStatus = (isActive: boolean) => {
  return isActive ? (
    <span className="badge bg-success">Активный</span>
  ) : (
    <span className="badge bg-secondary">Неактивный</span>
  );
};

// Форматтер для производителя/поставщика
export const formatCounterparty = (counterparty: any) => {
  if (!counterparty) return <span className="text-muted">Не указан</span>;
  
  return (
    <div>
      <div>{counterparty.full_name}</div>
      {counterparty.short_name && (
        <div className="small text-muted">{counterparty.short_name}</div>
      )}
    </div>
  );
}; 
