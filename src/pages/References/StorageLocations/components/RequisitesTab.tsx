import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { StorageLocationData } from '../hooks/useStorageLocationEdit';
import { storageLocationFormConfig } from '../config/editConfig';

interface RequisitesTabProps {
  storageLocation: StorageLocationData | null;
  updateStorageLocation: (updates: Partial<StorageLocationData>) => void;
}

const RequisitesTab: React.FC<RequisitesTabProps> = ({ storageLocation, updateStorageLocation }) => {
  if (!storageLocation) return null;

  const handleInputChange = (field: keyof StorageLocationData, value: string | number | string[] | boolean | undefined) => {
    updateStorageLocation({ [field]: value });
  };

  const handleStorageTypesAllowedChange = (storageType: string) => {
    const currentTypes = Array.isArray(storageLocation.storage_types_allowed) 
      ? storageLocation.storage_types_allowed 
      : [];
    let newTypes: string[];
    
    if (currentTypes.includes(storageType)) {
      newTypes = currentTypes.filter(type => type !== storageType);
    } else {
      newTypes = [...currentTypes, storageType];
    }
    
    updateStorageLocation({ storage_types_allowed: newTypes });
  };

  return (
    <Form>
      <Row className="g-2">
        {/* Емкости */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-stack-line me-2"></i>
              Емкости и характеристики
            </h6>
          </div>
        </Col>

        {/* Общая емкость */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="totalCapacityInput" className="form-label">Общая емкость (тонн)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="totalCapacityInput"
              placeholder="1000.50"
              step="0.01"
              min="0"
              value={storageLocation.total_capacity || ''}
              onChange={(e) => handleInputChange('total_capacity', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Доступная емкость */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="availableCapacityInput" className="form-label">Доступная емкость (тонн)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="availableCapacityInput"
              placeholder="750.25"
              step="0.01"
              min="0"
              value={storageLocation.available_capacity || ''}
              onChange={(e) => handleInputChange('available_capacity', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Типы хранения */}
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">Разрешенные типы хранения</Label>
            <div className="d-flex flex-wrap gap-2">
              {storageLocationFormConfig.storageTypesAllowed.map(type => (
                <div key={type.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`storage_type_${type.value}`}
                    checked={Array.isArray(storageLocation.storage_types_allowed) 
                      ? storageLocation.storage_types_allowed.includes(type.value) 
                      : false}
                    onChange={() => handleStorageTypesAllowedChange(type.value)}
                  />
                  <Label className="form-check-label" htmlFor={`storage_type_${type.value}`}>
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Оборудование */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-tools-line me-2"></i>
              Оборудование
            </h6>
          </div>
        </Col>

        {/* Зерносушилка */}
        <Col lg={6}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="hasGrainDryerSwitch"
                checked={storageLocation.has_grain_dryer || false}
                onChange={(e) => handleInputChange('has_grain_dryer', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="hasGrainDryerSwitch">
                🌪️ Зерносушилка
              </Label>
            </div>
          </div>
        </Col>

        {/* Очистительное оборудование */}
        <Col lg={6}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="hasCleaningEquipmentSwitch"
                checked={storageLocation.has_cleaning_equipment || false}
                onChange={(e) => handleInputChange('has_cleaning_equipment', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="hasCleaningEquipmentSwitch">
                🧹 Очистительное оборудование
              </Label>
            </div>
          </div>
        </Col>

        {/* Весы */}
        <Col lg={6}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="hasScalesSwitch"
                checked={storageLocation.has_scales || false}
                onChange={(e) => handleInputChange('has_scales', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="hasScalesSwitch">
                ⚖️ Весы
              </Label>
            </div>
          </div>
        </Col>

        {/* Погрузочное оборудование */}
        <Col lg={6}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="hasLoadingEquipmentSwitch"
                checked={storageLocation.has_loading_equipment || false}
                onChange={(e) => handleInputChange('has_loading_equipment', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="hasLoadingEquipmentSwitch">
                🚛 Погрузочное оборудование
              </Label>
            </div>
          </div>
        </Col>

        {/* Безопасность */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-shield-line me-2"></i>
              Безопасность
            </h6>
          </div>
        </Col>

        {/* Уровень безопасности */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="securityLevelSelect" className="form-label">Уровень безопасности</Label>
            <select 
              className="form-select" 
              id="securityLevelSelect"
              value={storageLocation.security_level || ''}
              onChange={(e) => handleInputChange('security_level', e.target.value)}
            >
              <option value="">Выберите уровень безопасности</option>
              {storageLocationFormConfig.securityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Договор аренды (для внешних складов) */}
        {storageLocation.storage_type === 'external' && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-file-text-line me-2"></i>
                  Договор аренды
                </h6>
              </div>
            </Col>

            {/* Номер договора */}
            <Col lg={6}>
              <div className="mb-3">
                <Label htmlFor="contractNumberInput" className="form-label">Номер договора</Label>
                <Input 
                  type="text" 
                  className="form-control"
                  id="contractNumberInput"
                  placeholder="Д-2024-001"
                  value={storageLocation.contract_number || ''}
                  onChange={(e) => handleInputChange('contract_number', e.target.value)}
                />
              </div>
            </Col>

            {/* Стоимость аренды */}
            <Col lg={6}>
              <div className="mb-3">
                <Label htmlFor="rentalCostInput" className="form-label">Стоимость аренды (₽/тонна)</Label>
                <Input 
                  type="number" 
                  className="form-control"
                  id="rentalCostInput"
                  placeholder="150.50"
                  step="0.01"
                  min="0"
                  value={storageLocation.rental_cost_per_ton || ''}
                  onChange={(e) => handleInputChange('rental_cost_per_ton', parseFloat(e.target.value) || undefined)}
                />
              </div>
            </Col>

            {/* Дата начала договора */}
            <Col lg={6}>
              <div className="mb-3">
                <Label htmlFor="contractStartDateInput" className="form-label">Дата начала договора</Label>
                <Input 
                  type="date" 
                  className="form-control" 
                  id="contractStartDateInput"
                  value={storageLocation.contract_start_date || ''}
                  onChange={(e) => handleInputChange('contract_start_date', e.target.value)}
                />
              </div>
            </Col>

            {/* Дата окончания договора */}
            <Col lg={6}>
              <div className="mb-3">
                <Label htmlFor="contractEndDateInput" className="form-label">Дата окончания договора</Label>
                <Input 
                  type="date" 
                  className="form-control" 
                  id="contractEndDateInput"
                  value={storageLocation.contract_end_date || ''}
                  onChange={(e) => handleInputChange('contract_end_date', e.target.value)}
                />
              </div>
            </Col>
          </>
        )}
      </Row>
    </Form>
  );
};

export default RequisitesTab; 
