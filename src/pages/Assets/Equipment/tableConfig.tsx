import React from 'react';
import { Badge } from 'reactstrap';
import { SoilType } from './types';

interface Equipment {
  id: number;
  name: string;
  equipment_code?: string;
  category: string;
  subcategory?: string;
  manufacturer?: string;
  model?: string;
  country_origin?: string;
  engine_power?: number;
  engine_volume?: number;
  fuel_type?: string;
  fuel_consumption?: number;
  working_width?: number;
  working_speed_min?: number;
  working_speed_max?: number;
  capacity?: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  weight_kg?: number;
  purchase_price?: number;
  depreciation_period_years?: number;
  maintenance_cost_per_hour?: number;
  suitable_crops?: string[];
  season_usage?: string;
  min_field_size?: number;
  description?: string;
  specifications?: any;
  attachments?: any;
  certifications?: string[];
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  equipment_type_id: number;
    // Добавляем связанные типы почв
  linkedSoilTypes?: SoilType[]; // Массив связанных типов почв
}

// Форматтеры
export const formatters = {
  price: (amount?: number) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  number: (value?: number, unit = '') => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('ru-RU').format(value) + (unit ? ` ${unit}` : '');
  },

  array: (arr?: string[]) => {
    if (!arr || arr.length === 0) return '—';
    return arr.join(', ');
  },

  fuelType: (fuel?: string) => {
    const fuelLabels: { [key: string]: string } = {
      'diesel': 'Дизель',
      'gasoline': 'Бензин',
      'electric': 'Электро',
      'hybrid': 'Гибрид',
      'gas': 'Газ'
    };
    return fuel ? (fuelLabels[fuel] || fuel) : '—';
  },

  seasonUsage: (season?: string) => {
    const seasonLabels: { [key: string]: string } = {
      'spring': 'Весна',
      'summer': 'Лето',
      'autumn': 'Осень',
      'winter': 'Зима',
      'year_round': 'Круглый год',
      'spring_summer': 'Весна-Лето',
      'autumn_winter': 'Осень-Зима'
    };
    return season ? (seasonLabels[season] || season) : '—';
  },

  categoryBadge: (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'tractor': 'primary',
      'harvester': 'success',
      'seeder': 'info',
      'cultivator': 'warning',
      'sprayer': 'secondary',
      'trailer': 'dark'
    };
    
    const categoryLabels: { [key: string]: string } = {
      'tractor': 'Трактор',
      'harvester': 'Комбайн',
      'seeder': 'Сеялка',
      'cultivator': 'Культиватор',
      'sprayer': 'Опрыскиватель',
      'trailer': 'Прицеп'
    };

    const color = categoryColors[category] || 'secondary';
    const label = categoryLabels[category] || category;
    
    return <Badge color={color}>{label}</Badge>;
  },

  statusBadge: (isActive?: boolean) => {
    return (
      <Badge color={isActive ? "success" : "danger"}>
        {isActive ? "Активное" : "Неактивное"}
      </Badge>
    );
  },

  dimensions: (length?: number, width?: number, height?: number) => {
    if (!length && !width && !height) return '—';
    const parts = [];
    if (length) parts.push(`Д: ${length}мм`);
    if (width) parts.push(`Ш: ${width}мм`);
    if (height) parts.push(`В: ${height}мм`);
    return parts.join(' × ');
  },

  powerInfo: (power?: number, volume?: number, fuelType?: string) => {
    const parts = [];
    if (power) parts.push(`${power} л.с.`);
    if (volume) parts.push(`${volume}л`);
    if (fuelType) parts.push(formatters.fuelType(fuelType));
    return parts.length > 0 ? parts.join(' / ') : '—';
  }
};

// Конфигурация колонок
export const getEquipmentColumns = () => [
  {
    header: "ID",
    cell: (cell: any) => (
      <span className="fw-semibold">{cell.getValue()}</span>
    ),
    accessorKey: "id",
    enableColumnFilter: false,
  },
  {
    header: "Наименование",
    cell: (cell: any) => {
      const rowData: Equipment = cell.row.original;
      return (
        <div>
          <div className="fw-semibold">{rowData.name}</div>
          <div className="text-muted small">
            {rowData.manufacturer && `${rowData.manufacturer} `}
            {rowData.model && rowData.model}
          </div>
          {rowData.equipment_code && (
            <div className="text-muted small">Код: {rowData.equipment_code}</div>
          )}
        </div>
      );
    },
    accessorKey: "name",
    enableColumnFilter: false,
  },
  {
    header: "Категория",
    cell: (cell: any) => {
      const rowData: Equipment = cell.row.original;
      return (
        <div>
          {formatters.categoryBadge(cell.getValue())}
          {rowData.subcategory && (
            <div className="text-muted small mt-1">{rowData.subcategory}</div>
          )}
        </div>
      );
    },
    accessorKey: "category",
    enableColumnFilter: false,
  },
  {
    header: "Двигатель",
    cell: (cell: any) => {
      const rowData: Equipment = cell.row.original;
      return (
        <div className="small">
          {formatters.powerInfo(rowData.engine_power, rowData.engine_volume, rowData.fuel_type)}
          {rowData.fuel_consumption && (
            <div className="text-muted">Расход: {rowData.fuel_consumption} л/ч</div>
          )}
        </div>
      );
    },
    accessorKey: "engine_power",
    enableColumnFilter: false,
  },
  {
    header: "Рабочие параметры",
    cell: (cell: any) => {
      const rowData: Equipment = cell.row.original;
      return (
        <div className="small">
          {rowData.working_width && (
            <div>Ширина: {formatters.number(rowData.working_width, 'м')}</div>
          )}
          {(rowData.working_speed_min || rowData.working_speed_max) && (
            <div className="text-muted">
              Скорость: {rowData.working_speed_min || 0}—{rowData.working_speed_max || 0} км/ч
            </div>
          )}
          {rowData.capacity && (
            <div className="text-muted">Объем: {formatters.number(rowData.capacity, 'л')}</div>
          )}
        </div>
      );
    },
    accessorKey: "working_width",
    enableColumnFilter: false,
  },
  {
    header: "Габариты",
    cell: (cell: any) => {
      const rowData: Equipment = cell.row.original;
      return (
        <div className="small">
          <div>{formatters.dimensions(rowData.length_mm, rowData.width_mm, rowData.height_mm)}</div>
          {rowData.weight_kg && (
            <div className="text-muted">Вес: {formatters.number(rowData.weight_kg, 'кг')}</div>
          )}
        </div>
      );
    },
    accessorKey: "length_mm",
    enableColumnFilter: false,
  },
  {
    header: "Стоимость",
    cell: (cell: any) => {
      const rowData: Equipment = cell.row.original;
      return (
        <div className="small">
          <div>{formatters.price(rowData.purchase_price)}</div>
          {rowData.maintenance_cost_per_hour && (
            <div className="text-muted">
              Обслуживание: {formatters.price(rowData.maintenance_cost_per_hour)}/ч
            </div>
          )}
          {rowData.depreciation_period_years && (
            <div className="text-muted">
              Амортизация: {rowData.depreciation_period_years} лет
            </div>
          )}
        </div>
      );
    },
    accessorKey: "purchase_price",
    enableColumnFilter: false,
  },
  {
    header: "Применение",
    cell: (cell: any) => {
      const rowData: Equipment = cell.row.original;
      return (
        <div className="small">
          {rowData.suitable_crops && (
            <div>Культуры: {formatters.array(rowData.suitable_crops)}</div>
          )}
          {rowData.season_usage && (
            <div className="text-muted">Сезон: {formatters.seasonUsage(rowData.season_usage)}</div>
          )}
          {rowData.min_field_size && (
            <div className="text-muted">Мин. поле: {formatters.number(rowData.min_field_size, 'га')}</div>
          )}
        </div>
      );
    },
    accessorKey: "suitable_crops",
    enableColumnFilter: false,
  },
  {
    header: "Статус",
    cell: (cell: any) => formatters.statusBadge(cell.getValue()),
    accessorKey: "is_active",
    enableColumnFilter: false,
  },
];