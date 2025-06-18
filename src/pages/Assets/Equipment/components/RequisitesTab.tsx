import React, { useState } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { EquipmentData } from '../hooks/useEquipmentEdit';
import { equipmentFormConfig } from '../config/editConfig';

interface RequisitesTabProps {
  equipment: EquipmentData | null;
  updateEquipment: (updates: Partial<EquipmentData>) => void;
  validationErrors: {[key: string]: string};
}

const RequisitesTab: React.FC<RequisitesTabProps> = ({ 
  equipment, 
  updateEquipment, 
  validationErrors 
}) => {
  // State для валидации
  const [validation, setValidation] = useState({
    engine_power: null as boolean | null,
    engine_volume: null as boolean | null,
    fuel_consumption: null as boolean | null,
    working_width: null as boolean | null,
    working_speed_min: null as boolean | null,
    working_speed_max: null as boolean | null,
    capacity: null as boolean | null,
    length_mm: null as boolean | null,
    width_mm: null as boolean | null,
    height_mm: null as boolean | null,
    weight_kg: null as boolean | null,
    purchase_price: null as boolean | null,
    depreciation_period_years: null as boolean | null,
    maintenance_cost_per_hour: null as boolean | null,
    min_field_size: null as boolean | null
  });

  // Функция валидации при изменении поля
  const onChangeValidation = (fieldName: string, value: any) => {
    const modifiedV: any = { ...validation };
    const numValue = parseFloat(value);
    
    if (['engine_power', 'engine_volume', 'fuel_consumption', 'working_width', 
         'working_speed_min', 'working_speed_max', 'capacity', 'purchase_price',
         'maintenance_cost_per_hour', 'min_field_size'].includes(fieldName)) {
      modifiedV[fieldName] = !value || (!isNaN(numValue) && numValue >= 0);
    } else if (['length_mm', 'width_mm', 'height_mm', 'weight_kg'].includes(fieldName)) {
      const intValue = parseInt(value);
      modifiedV[fieldName] = !value || (!isNaN(intValue) && intValue > 0);
    } else if (fieldName === 'depreciation_period_years') {
      const intValue = parseInt(value);
      modifiedV[fieldName] = !value || (!isNaN(intValue) && intValue >= 1 && intValue <= 50);
    }
    
    // Дополнительная проверка диапазона скоростей
    if (fieldName === 'working_speed_min' || fieldName === 'working_speed_max') {
      const minSpeed = fieldName === 'working_speed_min' ? numValue : equipment?.working_speed_min;
      const maxSpeed = fieldName === 'working_speed_max' ? numValue : equipment?.working_speed_max;
      
      if (minSpeed && maxSpeed && minSpeed > maxSpeed) {
        modifiedV['working_speed_min'] = false;
        modifiedV['working_speed_max'] = false;
      }
    }
    
    setValidation(modifiedV);
  };

  if (!equipment) return null;

  const handleInputChange = (field: keyof EquipmentData, value: string | number | undefined) => {
    updateEquipment({ [field]: value });
  };

  const handleSuitableCropsChange = (cropValue: string) => {
    const currentCrops = Array.isArray(equipment.suitable_crops) 
      ? equipment.suitable_crops 
      : [];
    let newCrops: string[];
    
    if (currentCrops.includes(cropValue)) {
      newCrops = currentCrops.filter(crop => crop !== cropValue);
    } else {
      newCrops = [...currentCrops, cropValue];
    }
    
    updateEquipment({ suitable_crops: newCrops });
  };

  return (
    <Form>
      <Row className="g-3">
        {/* Характеристики двигателя */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-settings-line me-2"></i>
              Характеристики двигателя
            </h6>
          </div>
        </Col>

        {/* Мощность двигателя */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="enginePowerInput" className="form-label">Мощность двигателя (л.с.)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="enginePowerInput"
              placeholder="300"
              step="0.01"
              min="0"
              value={equipment.engine_power || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('engine_power', value);
                onChangeValidation('engine_power', e.target.value);
              }}
              valid={validation.engine_power === true}
              invalid={(validation.engine_power !== true && validation.engine_power !== null) || !!validationErrors.engine_power}
            />
            {(validation.engine_power !== null || validationErrors.engine_power) && (
              <div className={validation.engine_power === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.engine_power === true 
                  ? "Отлично!" 
                  : validationErrors.engine_power || "Мощность должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Объем двигателя */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="engineVolumeInput" className="form-label">Объем двигателя (л)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="engineVolumeInput"
              placeholder="12.5"
              step="0.01"
              min="0"
              value={equipment.engine_volume || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('engine_volume', value);
                onChangeValidation('engine_volume', e.target.value);
              }}
              valid={validation.engine_volume === true}
              invalid={validation.engine_volume !== true && validation.engine_volume !== null}
            />
            {validation.engine_volume !== null && (
              <div className={validation.engine_volume === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.engine_volume === true 
                  ? "Отлично!" 
                  : "Объем должен быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Тип топлива */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="fuelTypeSelect" className="form-label">Тип топлива</Label>
            <select 
              className="form-select" 
              id="fuelTypeSelect"
              value={equipment.fuel_type || ''}
              onChange={(e) => handleInputChange('fuel_type', e.target.value)}
            >
              <option value="">Выберите тип топлива</option>
              {equipmentFormConfig.fuelTypes.map(fuel => (
                <option key={fuel.value} value={fuel.value}>
                  {fuel.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Расход топлива */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="fuelConsumptionInput" className="form-label">Расход топлива (л/ч)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="fuelConsumptionInput"
              placeholder="25.5"
              step="0.01"
              min="0"
              value={equipment.fuel_consumption || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('fuel_consumption', value);
                onChangeValidation('fuel_consumption', e.target.value);
              }}
              valid={validation.fuel_consumption === true}
              invalid={(validation.fuel_consumption !== true && validation.fuel_consumption !== null) || !!validationErrors.fuel_consumption}
            />
            {(validation.fuel_consumption !== null || validationErrors.fuel_consumption) && (
              <div className={validation.fuel_consumption === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.fuel_consumption === true 
                  ? "Отлично!" 
                  : validationErrors.fuel_consumption || "Расход должен быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Рабочие характеристики */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-tools-line me-2"></i>
              Рабочие характеристики
            </h6>
          </div>
        </Col>

        {/* Рабочая ширина */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="workingWidthInput" className="form-label">Рабочая ширина (м)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="workingWidthInput"
              placeholder="6.5"
              step="0.01"
              min="0"
              value={equipment.working_width || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('working_width', value);
                onChangeValidation('working_width', e.target.value);
              }}
              valid={validation.working_width === true}
              invalid={(validation.working_width !== true && validation.working_width !== null) || !!validationErrors.working_width}
            />
            {(validation.working_width !== null || validationErrors.working_width) && (
              <div className={validation.working_width === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.working_width === true 
                  ? "Отлично!" 
                  : validationErrors.working_width || "Ширина должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Скорость работы минимальная */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="workingSpeedMinInput" className="form-label">Мин. скорость (км/ч)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="workingSpeedMinInput"
              placeholder="5.0"
              step="0.01"
              min="0"
              value={equipment.working_speed_min || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('working_speed_min', value);
                onChangeValidation('working_speed_min', e.target.value);
              }}
              valid={validation.working_speed_min === true}
              invalid={(validation.working_speed_min !== true && validation.working_speed_min !== null) || !!validationErrors.working_speed}
            />
            {(validation.working_speed_min !== null || validationErrors.working_speed) && (
              <div className={validation.working_speed_min === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.working_speed_min === true 
                  ? "Отлично!" 
                  : validationErrors.working_speed || "Скорость должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Скорость работы максимальная */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="workingSpeedMaxInput" className="form-label">Макс. скорость (км/ч)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="workingSpeedMaxInput"
              placeholder="15.0"
              step="0.01"
              min="0"
              value={equipment.working_speed_max || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('working_speed_max', value);
                onChangeValidation('working_speed_max', e.target.value);
              }}
              valid={validation.working_speed_max === true}
              invalid={(validation.working_speed_max !== true && validation.working_speed_max !== null) || !!validationErrors.working_speed}
            />
            {(validation.working_speed_max !== null || validationErrors.working_speed) && (
              <div className={validation.working_speed_max === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.working_speed_max === true 
                  ? "Отлично!" 
                  : validationErrors.working_speed || "Макс. скорость должна быть больше минимальной"}
              </div>
            )}
          </div>
        </Col>

        {/* Производительность */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="capacityInput" className="form-label">Производительность (га/ч)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="capacityInput"
              placeholder="12.5"
              step="0.01"
              min="0"
              value={equipment.capacity || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('capacity', value);
                onChangeValidation('capacity', e.target.value);
              }}
              valid={validation.capacity === true}
              invalid={(validation.capacity !== true && validation.capacity !== null) || !!validationErrors.capacity}
            />
            {(validation.capacity !== null || validationErrors.capacity) && (
              <div className={validation.capacity === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.capacity === true 
                  ? "Отлично!" 
                  : validationErrors.capacity || "Производительность должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Габариты */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-ruler-line me-2"></i>
              Габариты и вес
            </h6>
          </div>
        </Col>

        {/* Длина */}
        <Col lg={3}>
          <div className="mb-3 position-relative">
            <Label htmlFor="lengthInput" className="form-label">Длина (мм)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="lengthInput"
              placeholder="8500"
              min="1"
              value={equipment.length_mm || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('length_mm', value);
                onChangeValidation('length_mm', e.target.value);
              }}
              valid={validation.length_mm === true}
              invalid={(validation.length_mm !== true && validation.length_mm !== null) || !!validationErrors.length_mm}
            />
            {(validation.length_mm !== null || validationErrors.length_mm) && (
              <div className={validation.length_mm === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.length_mm === true 
                  ? "Отлично!" 
                  : validationErrors.length_mm || "Длина должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Ширина */}
        <Col lg={3}>
          <div className="mb-3 position-relative">
            <Label htmlFor="widthInput" className="form-label">Ширина (мм)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="widthInput"
              placeholder="3200"
              min="1"
              value={equipment.width_mm || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('width_mm', value);
                onChangeValidation('width_mm', e.target.value);
              }}
              valid={validation.width_mm === true}
              invalid={validation.width_mm !== true && validation.width_mm !== null}
            />
            {validation.width_mm !== null && (
              <div className={validation.width_mm === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.width_mm === true 
                  ? "Отлично!" 
                  : "Ширина должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Высота */}
        <Col lg={3}>
          <div className="mb-3 position-relative">
            <Label htmlFor="heightInput" className="form-label">Высота (мм)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="heightInput"
              placeholder="3800"
              min="1"
              value={equipment.height_mm || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('height_mm', value);
                onChangeValidation('height_mm', e.target.value);
              }}
              valid={validation.height_mm === true}
              invalid={validation.height_mm !== true && validation.height_mm !== null}
            />
            {validation.height_mm !== null && (
              <div className={validation.height_mm === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.height_mm === true 
                  ? "Отлично!" 
                  : "Высота должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Вес */}
        <Col lg={3}>
          <div className="mb-3 position-relative">
            <Label htmlFor="weightInput" className="form-label">Вес (кг)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="weightInput"
              placeholder="12500"
              min="1"
              value={equipment.weight_kg || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('weight_kg', value);
                onChangeValidation('weight_kg', e.target.value);
              }}
              valid={validation.weight_kg === true}
              invalid={(validation.weight_kg !== true && validation.weight_kg !== null) || !!validationErrors.weight_kg}
            />
            {(validation.weight_kg !== null || validationErrors.weight_kg) && (
              <div className={validation.weight_kg === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.weight_kg === true 
                  ? "Отлично!" 
                  : validationErrors.weight_kg || "Вес должен быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Экономические показатели */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-money-dollar-circle-line me-2"></i>
              Экономические показатели
            </h6>
          </div>
        </Col>

        {/* Цена покупки */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="purchasePriceInput" className="form-label">Цена покупки (руб)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="purchasePriceInput"
              placeholder="5500000"
              step="0.01"
              min="0"
              value={equipment.purchase_price || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('purchase_price', value);
                onChangeValidation('purchase_price', e.target.value);
              }}
              valid={validation.purchase_price === true}
              invalid={(validation.purchase_price !== true && validation.purchase_price !== null) || !!validationErrors.purchase_price}
            />
            {(validation.purchase_price !== null || validationErrors.purchase_price) && (
              <div className={validation.purchase_price === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.purchase_price === true 
                  ? "Отлично!" 
                  : validationErrors.purchase_price || "Цена должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Срок амортизации */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="depreciationPeriodInput" className="form-label">Срок амортизации (лет)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="depreciationPeriodInput"
              placeholder="10"
              min="1"
              max="50"
              value={equipment.depreciation_period_years || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('depreciation_period_years', value);
                onChangeValidation('depreciation_period_years', e.target.value);
              }}
              valid={validation.depreciation_period_years === true}
              invalid={(validation.depreciation_period_years !== true && validation.depreciation_period_years !== null) || !!validationErrors.depreciation_period_years}
            />
            {(validation.depreciation_period_years !== null || validationErrors.depreciation_period_years) && (
              <div className={validation.depreciation_period_years === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.depreciation_period_years === true 
                  ? "Отлично!" 
                  : validationErrors.depreciation_period_years || "Срок амортизации должен быть от 1 до 50 лет"}
              </div>
            )}
          </div>
        </Col>

        {/* Стоимость обслуживания */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="maintenanceCostInput" className="form-label">Стоимость обслуживания (руб/ч)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="maintenanceCostInput"
              placeholder="1200"
              step="0.01"
              min="0"
              value={equipment.maintenance_cost_per_hour || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('maintenance_cost_per_hour', value);
                onChangeValidation('maintenance_cost_per_hour', e.target.value);
              }}
              valid={validation.maintenance_cost_per_hour === true}
              invalid={validation.maintenance_cost_per_hour !== true && validation.maintenance_cost_per_hour !== null}
            />
            {validation.maintenance_cost_per_hour !== null && (
              <div className={validation.maintenance_cost_per_hour === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.maintenance_cost_per_hour === true 
                  ? "Отлично!" 
                  : "Стоимость должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Применение */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-plant-line me-2"></i>
              Область применения
            </h6>
          </div>
        </Col>

        {/* Сезон использования */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="seasonUsageSelect" className="form-label">Сезон использования</Label>
            <select 
              className="form-select" 
              id="seasonUsageSelect"
              value={equipment.season_usage || ''}
              onChange={(e) => handleInputChange('season_usage', e.target.value)}
            >
              <option value="">Выберите сезон</option>
              {equipmentFormConfig.seasonUsage.map(season => (
                <option key={season.value} value={season.value}>
                  {season.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Минимальный размер поля */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="minFieldSizeInput" className="form-label">Мин. размер поля (га)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="minFieldSizeInput"
              placeholder="10"
              step="0.01"
              min="0"
              value={equipment.min_field_size || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('min_field_size', value);
                onChangeValidation('min_field_size', e.target.value);
              }}
              valid={validation.min_field_size === true}
              invalid={validation.min_field_size !== true && validation.min_field_size !== null}
            />
            {validation.min_field_size !== null && (
              <div className={validation.min_field_size === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.min_field_size === true 
                  ? "Отлично!" 
                  : "Размер поля должен быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Подходящие культуры */}
        <Col lg={12}>
          <div className="mb-3 pb-2">
            <Label className="form-label">Подходящие культуры</Label>
            <div className="d-flex flex-wrap gap-2">
              {equipmentFormConfig.suitableCrops.map(crop => (
                <div key={crop.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`crop_${crop.value}`}
                    checked={Array.isArray(equipment.suitable_crops) 
                      ? equipment.suitable_crops.includes(crop.value) 
                      : false}
                    onChange={() => handleSuitableCropsChange(crop.value)}
                  />
                  <Label className="form-check-label" htmlFor={`crop_${crop.value}`}>
                    {crop.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default RequisitesTab; 
