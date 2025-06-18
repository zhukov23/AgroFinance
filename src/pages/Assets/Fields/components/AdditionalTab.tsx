import React, { useState } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';

// Интерфейс для данных поля (соответствует useFieldEdit.ts)
interface FieldData {
  id?: number;
  field_name: string;
  field_code?: string;
  area_hectares: number;
  soil_type: string;
  soil_quality_score?: number;
  irrigation_type?: string;
  field_status?: string;
  location?: any;
  boundaries?: any;
  soil_analysis?: any;
  terrain_features?: any;
  infrastructure?: any;
  cadastral_number?: string;
  ownership_documents?: any;
  restrictions?: any;
  special_features?: any;
  usage_history?: any;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

interface AdditionalTabProps {
  field: FieldData | null;
  updateField: (updates: Partial<FieldData>) => void;
  validationErrors: {[key: string]: string};
}

const AdditionalTab: React.FC<AdditionalTabProps> = ({ 
  field, 
  updateField, 
  validationErrors 
}) => {
  if (!field) return null;

  const handleInputChange = (fieldName: keyof FieldData, value: any) => {
    updateField({ [fieldName]: value });
  };

  // Вспомогательные функции для работы с JSONB полями
  const getBoundariesValue = (key: string) => {
    if (!field.boundaries) return '';
    if (typeof field.boundaries === 'string') {
      try {
        const parsed = JSON.parse(field.boundaries);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.boundaries[key] || '';
  };

  const updateBoundariesField = (key: string, value: any) => {
    let currentBoundaries = {};
    
    if (field.boundaries) {
      if (typeof field.boundaries === 'string') {
        try {
          currentBoundaries = JSON.parse(field.boundaries);
        } catch {
          currentBoundaries = {};
        }
      } else {
        currentBoundaries = { ...field.boundaries };
      }
    }
    
    const updatedBoundaries = {
      ...currentBoundaries,
      [key]: value
    };
    
    handleInputChange('boundaries', updatedBoundaries);
  };

  const getTerrainValue = (key: string) => {
    if (!field.terrain_features) return '';
    if (typeof field.terrain_features === 'string') {
      try {
        const parsed = JSON.parse(field.terrain_features);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.terrain_features[key] || '';
  };

  const updateTerrainField = (key: string, value: any) => {
    let currentTerrain = {};
    
    if (field.terrain_features) {
      if (typeof field.terrain_features === 'string') {
        try {
          currentTerrain = JSON.parse(field.terrain_features);
        } catch {
          currentTerrain = {};
        }
      } else {
        currentTerrain = { ...field.terrain_features };
      }
    }
    
    const updatedTerrain = {
      ...currentTerrain,
      [key]: value
    };
    
    handleInputChange('terrain_features', updatedTerrain);
  };

  const getInfrastructureValue = (key: string) => {
    if (!field.infrastructure) return '';
    if (typeof field.infrastructure === 'string') {
      try {
        const parsed = JSON.parse(field.infrastructure);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.infrastructure[key] || '';
  };

  const updateInfrastructureField = (key: string, value: any) => {
    let currentInfrastructure = {};
    
    if (field.infrastructure) {
      if (typeof field.infrastructure === 'string') {
        try {
          currentInfrastructure = JSON.parse(field.infrastructure);
        } catch {
          currentInfrastructure = {};
        }
      } else {
        currentInfrastructure = { ...field.infrastructure };
      }
    }
    
    const updatedInfrastructure = {
      ...currentInfrastructure,
      [key]: value
    };
    
    handleInputChange('infrastructure', updatedInfrastructure);
  };

  const getRestrictionsValue = (key: string) => {
    if (!field.restrictions) return '';
    if (typeof field.restrictions === 'string') {
      try {
        const parsed = JSON.parse(field.restrictions);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.restrictions[key] || '';
  };

  const updateRestrictionsField = (key: string, value: any) => {
    let currentRestrictions = {};
    
    if (field.restrictions) {
      if (typeof field.restrictions === 'string') {
        try {
          currentRestrictions = JSON.parse(field.restrictions);
        } catch {
          currentRestrictions = {};
        }
      } else {
        currentRestrictions = { ...field.restrictions };
      }
    }
    
    const updatedRestrictions = {
      ...currentRestrictions,
      [key]: value
    };
    
    handleInputChange('restrictions', updatedRestrictions);
  };

  const getSpecialFeaturesValue = (key: string) => {
    if (!field.special_features) return '';
    if (typeof field.special_features === 'string') {
      try {
        const parsed = JSON.parse(field.special_features);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.special_features[key] || '';
  };

  const updateSpecialFeaturesField = (key: string, value: any) => {
    let currentFeatures = {};
    
    if (field.special_features) {
      if (typeof field.special_features === 'string') {
        try {
          currentFeatures = JSON.parse(field.special_features);
        } catch {
          currentFeatures = {};
        }
      } else {
        currentFeatures = { ...field.special_features };
      }
    }
    
    const updatedFeatures = {
      ...currentFeatures,
      [key]: value
    };
    
    handleInputChange('special_features', updatedFeatures);
  };

  const getUsageHistoryValue = (key: string) => {
    if (!field.usage_history) return '';
    if (typeof field.usage_history === 'string') {
      try {
        const parsed = JSON.parse(field.usage_history);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.usage_history[key] || '';
  };

  const updateUsageHistoryField = (key: string, value: any) => {
    let currentHistory = {};
    
    if (field.usage_history) {
      if (typeof field.usage_history === 'string') {
        try {
          currentHistory = JSON.parse(field.usage_history);
        } catch {
          currentHistory = {};
        }
      } else {
        currentHistory = { ...field.usage_history };
      }
    }
    
    const updatedHistory = {
      ...currentHistory,
      [key]: value
    };
    
    handleInputChange('usage_history', updatedHistory);
  };

  return (
    <Form>
      <Row className="g-2">
        {/* Границы поля */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-map-2-line me-2"></i>
              Границы поля
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="boundariesTypeInput" className="form-label">Тип границ</Label>
            <select 
              className="form-select"
              id="boundariesTypeInput"
              value={getBoundariesValue('type')}
              onChange={(e) => updateBoundariesField('type', e.target.value)}
            >
              <option value="">Выберите тип</option>
              <option value="Polygon">Полигон</option>
              <option value="MultiPolygon">Мультиполигон</option>
              <option value="Point">Точка</option>
            </select>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="boundariesDescInput" className="form-label">Описание границ</Label>
            <Input 
              type="text" 
              className="form-control"
              id="boundariesDescInput"
              placeholder="Описание границ поля"
              value={getBoundariesValue('description')}
              onChange={(e) => updateBoundariesField('description', e.target.value)}
            />
          </div>
        </Col>

        {/* Особенности рельефа */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-mountain-line me-2"></i>
              Особенности рельефа
            </h6>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="terrainReliefInput" className="form-label">Тип рельефа</Label>
            <select 
              className="form-select"
              id="terrainReliefInput"
              value={getTerrainValue('relief')}
              onChange={(e) => updateTerrainField('relief', e.target.value)}
            >
              <option value="">Выберите тип</option>
              <option value="равнинный">Равнинный</option>
              <option value="холмистый">Холмистый</option>
              <option value="склон">Склон</option>
              <option value="низина">Низина</option>
              <option value="возвышенность">Возвышенность</option>
            </select>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="terrainSlopeInput" className="form-label">Уклон (градусы)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="terrainSlopeInput"
              placeholder="2.5"
              step="0.1"
              min="0"
              max="90"
              value={getTerrainValue('slope')}
              onChange={(e) => updateTerrainField('slope', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="terrainDrainageInput" className="form-label">Дренаж</Label>
            <select 
              className="form-select"
              id="terrainDrainageInput"
              value={getTerrainValue('drainage')}
              onChange={(e) => updateTerrainField('drainage', e.target.value)}
            >
              <option value="">Выберите тип</option>
              <option value="хороший">Хороший</option>
              <option value="удовлетворительный">Удовлетворительный</option>
              <option value="плохой">Плохой</option>
              <option value="заболоченный">Заболоченный</option>
            </select>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="terrainElevationInput" className="form-label">Высота над уровнем моря (м)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="terrainElevationInput"
              placeholder="150"
              min="0"
              value={getTerrainValue('elevation')}
              onChange={(e) => updateTerrainField('elevation', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Инфраструктура */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-road-map-line me-2"></i>
              Инфраструктура
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="infraRoadsInput" className="form-label">Дороги</Label>
            <Input 
              type="text" 
              className="form-control"
              id="infraRoadsInput"
              placeholder="асфальтированная, грунтовая (через запятую)"
              value={Array.isArray(getInfrastructureValue('roads')) 
                ? getInfrastructureValue('roads').join(', ') 
                : getInfrastructureValue('roads')}
              onChange={(e) => {
                const roads = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                updateInfrastructureField('roads', roads);
              }}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="infraWaterInput" className="form-label">Источники воды</Label>
            <Input 
              type="text" 
              className="form-control"
              id="infraWaterInput"
              placeholder="скважина, колодец, река (через запятую)"
              value={Array.isArray(getInfrastructureValue('water_sources')) 
                ? getInfrastructureValue('water_sources').join(', ') 
                : getInfrastructureValue('water_sources')}
              onChange={(e) => {
                const sources = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                updateInfrastructureField('water_sources', sources);
              }}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <div className="form-check form-switch mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="powerLinesSwitch"
                checked={getInfrastructureValue('power_lines') || false}
                onChange={(e) => updateInfrastructureField('power_lines', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="powerLinesSwitch">
                <span className={`badge ${getInfrastructureValue('power_lines') ? 'bg-warning' : 'bg-secondary'} me-2`}>
                  {getInfrastructureValue('power_lines') ? '⚡ Линии электропередач' : '🚫 Нет ЛЭП'}
                </span>
              </Label>
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <div className="form-check form-switch mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="storageBuildingsSwitch"
                checked={getInfrastructureValue('storage_buildings') || false}
                onChange={(e) => updateInfrastructureField('storage_buildings', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="storageBuildingsSwitch">
                <span className={`badge ${getInfrastructureValue('storage_buildings') ? 'bg-success' : 'bg-secondary'} me-2`}>
                  {getInfrastructureValue('storage_buildings') ? '🏗️ Хранилища' : '🚫 Нет хранилищ'}
                </span>
              </Label>
            </div>
          </div>
        </Col>

        {/* Ограничения */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-forbid-line me-2"></i>
              Ограничения использования
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="restrictionsTypesInput" className="form-label">Типы ограничений</Label>
            <Input 
              type="text" 
              className="form-control"
              id="restrictionsTypesInput"
              placeholder="экологические, санитарные (через запятую)"
              value={Array.isArray(getRestrictionsValue('types')) 
                ? getRestrictionsValue('types').join(', ') 
                : getRestrictionsValue('types')}
              onChange={(e) => {
                const types = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                updateRestrictionsField('types', types);
              }}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="restrictionsDescInput" className="form-label">Описание ограничений</Label>
            <Input 
              type="text" 
              className="form-control"
              id="restrictionsDescInput"
              placeholder="Описание ограничений использования"
              value={getRestrictionsValue('description')}
              onChange={(e) => updateRestrictionsField('description', e.target.value)}
            />
          </div>
        </Col>

        {/* Особые характеристики */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-star-line me-2"></i>
              Особые характеристики
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="specialFeaturesListInput" className="form-label">Особенности</Label>
            <Input 
              type="text" 
              className="form-control"
              id="specialFeaturesListInput"
              placeholder="эрозия, заболоченность, каменистость (через запятую)"
              value={Array.isArray(getSpecialFeaturesValue('features')) 
                ? getSpecialFeaturesValue('features').join(', ') 
                : getSpecialFeaturesValue('features')}
              onChange={(e) => {
                const features = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                updateSpecialFeaturesField('features', features);
              }}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="specialSeverityInput" className="form-label">Степень выраженности</Label>
            <select 
              className="form-select"
              id="specialSeverityInput"
              value={getSpecialFeaturesValue('severity')}
              onChange={(e) => updateSpecialFeaturesField('severity', e.target.value)}
            >
              <option value="">Выберите степень</option>
              <option value="низкая">Низкая</option>
              <option value="средняя">Средняя</option>
              <option value="высокая">Высокая</option>
            </select>
          </div>
        </Col>

        {/* История использования */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-time-line me-2"></i>
              История использования
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="usageRecentCropsInput" className="form-label">Недавние культуры</Label>
            <Input 
              type="text" 
              className="form-control"
              id="usageRecentCropsInput"
              placeholder="пшеница, кукуруза, соя (через запятую)"
              value={Array.isArray(getUsageHistoryValue('recent_crops')) 
                ? getUsageHistoryValue('recent_crops').join(', ') 
                : getUsageHistoryValue('recent_crops')}
              onChange={(e) => {
                const crops = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                updateUsageHistoryField('recent_crops', crops);
              }}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="usageYearsInput" className="form-label">Годы (через запятую)</Label>
            <Input 
              type="text" 
              className="form-control"
              id="usageYearsInput"
              placeholder="2024, 2023, 2022"
              value={Array.isArray(getUsageHistoryValue('years')) 
                ? getUsageHistoryValue('years').join(', ') 
                : getUsageHistoryValue('years')}
              onChange={(e) => {
                const years = e.target.value.split(',').map(item => parseInt(item.trim())).filter(year => !isNaN(year));
                updateUsageHistoryField('years', years);
              }}
            />
          </div>
        </Col>

        {/* Служебная информация */}
        {(field.created_at || field.updated_at) && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-time-line me-2"></i>
                  Служебная информация
                </h6>
              </div>
            </Col>

            {field.created_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Дата создания</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(field.created_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}

            {field.updated_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Последнее обновление</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(field.updated_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}
          </>
        )}
      </Row>
    </Form>
  );
};

export default AdditionalTab;