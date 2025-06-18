 import React, { useState } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { EquipmentData } from '../hooks/useEquipmentEdit';
import { equipmentFormConfig } from '../config/editConfig';

interface BasicInfoTabProps {
  equipment: EquipmentData | null;
  updateEquipment: (updates: Partial<EquipmentData>) => void;
  validationErrors: {[key: string]: string};
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  equipment, 
  updateEquipment, 
  validationErrors 
}) => {
  // State для валидации
  const [validation, setValidation] = useState({
    name: null as boolean | null,
    category: null as boolean | null,
    equipment_code: null as boolean | null,
    manufacturer: null as boolean | null,
    model: null as boolean | null
  });

  // Функция валидации при изменении поля
  const onChangeValidation = (fieldName: string, value: any) => {
    const modifiedV: any = { ...validation };
    
    if (fieldName === 'name') {
      modifiedV[fieldName] = value && value.trim().length > 0;
    } else if (fieldName === 'category') {
      modifiedV[fieldName] = value && value !== '';
    } else if (fieldName === 'equipment_code') {
      const codePattern = /^[A-Za-z0-9\-_]*$/;
      modifiedV[fieldName] = !value || codePattern.test(value);
    } else if (fieldName === 'manufacturer' || fieldName === 'model') {
      modifiedV[fieldName] = !value || value.trim().length > 0;
    }
    
    setValidation(modifiedV);
  };

  if (!equipment) return null;

  const handleInputChange = (field: keyof EquipmentData, value: string | boolean | undefined) => {
    updateEquipment({ [field]: value });
  };

  // Получаем подкатегории для выбранной категории
  const getSubcategoriesForCategory = (category: string) => {
    return equipmentFormConfig.subcategories[category] || [];
  };

  return (
    <Form>
      <Row>
        {/* Наименование */}
        <Col lg={12}>
          <div className="mb-3 position-relative">
            <Label htmlFor="nameInput" className="form-label">
              Наименование техники <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id="nameInput"
              placeholder="Введите наименование техники" 
              value={equipment.name || ''}
              onChange={(e) => {
                handleInputChange('name', e.target.value);
                onChangeValidation('name', e.target.value);
              }}
              valid={validation.name === true}
              invalid={(validation.name !== true && validation.name !== null) || !!validationErrors.name}
            />
            <div className={validation.name === true ? "valid-tooltip" : "invalid-tooltip"}>
              {validation.name === true 
                ? "Отлично!" 
                : validationErrors.name || "Пожалуйста, введите наименование техники"}
            </div>
          </div>
        </Col>

        {/* Код техники */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="equipmentCodeInput" className="form-label">Код техники</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="equipmentCodeInput"
              placeholder="TR-001, KB-2023"
              value={equipment.equipment_code || ''}
              onChange={(e) => {
                handleInputChange('equipment_code', e.target.value);
                onChangeValidation('equipment_code', e.target.value);
              }}
              valid={validation.equipment_code === true}
              invalid={validation.equipment_code !== true && validation.equipment_code !== null}
            />
            {validation.equipment_code !== null && (
              <div className={validation.equipment_code === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.equipment_code === true 
                  ? "Отлично!" 
                  : "Код может содержать только буквы, цифры, дефисы и подчеркивания"}
              </div>
            )}
          </div>
        </Col>

        {/* Категория */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="categorySelect" className="form-label">
              Категория техники <span className="text-danger">*</span>
            </Label>
            <select 
              className="form-select" 
              id="categorySelect"
              value={equipment.category || ''}
              onChange={(e) => {
                handleInputChange('category', e.target.value);
                // Сбрасываем подкатегорию при смене категории
                handleInputChange('subcategory', '');
                onChangeValidation('category', e.target.value);
              }}
            >
              <option value="">Выберите категорию</option>
              {equipmentFormConfig.categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {(validation.category !== null || validationErrors.category) && (
              <div className={validation.category === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.category === true 
                  ? "Отлично!" 
                  : validationErrors.category || "Пожалуйста, выберите категорию техники"}
              </div>
            )}
          </div>
        </Col>

        {/* Подкатегория */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="subcategorySelect" className="form-label">Подкатегория</Label>
            <select 
              className="form-select" 
              id="subcategorySelect"
              value={equipment.subcategory || ''}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
              disabled={!equipment.category}
            >
              <option value="">Выберите подкатегорию</option>
              {equipment.category && getSubcategoriesForCategory(equipment.category).map(subcategory => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
            {!equipment.category && (
              <div className="form-text text-muted">Сначала выберите категорию</div>
            )}
          </div>
        </Col>

        {/* Производитель */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="manufacturerInput" className="form-label">Производитель</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="manufacturerInput"
              placeholder="John Deere, Claas, Ростсельмаш"
              list="manufacturersList"
              value={equipment.manufacturer || ''}
              onChange={(e) => {
                handleInputChange('manufacturer', e.target.value);
                onChangeValidation('manufacturer', e.target.value);
              }}
              valid={validation.manufacturer === true}
              invalid={validation.manufacturer !== true && validation.manufacturer !== null}
            />
            <datalist id="manufacturersList">
              {equipmentFormConfig.manufacturers.map(manufacturer => (
                <option key={manufacturer.value} value={manufacturer.value}>
                  {manufacturer.label}
                </option>
              ))}
            </datalist>
            {validation.manufacturer !== null && (
              <div className={validation.manufacturer === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.manufacturer === true 
                  ? "Отлично!" 
                  : "Введите корректное название производителя"}
              </div>
            )}
          </div>
        </Col>

        {/* Модель */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="modelInput" className="form-label">Модель</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="modelInput"
              placeholder="8R 410, LEXION 780, ACROS 595"
              value={equipment.model || ''}
              onChange={(e) => {
                handleInputChange('model', e.target.value);
                onChangeValidation('model', e.target.value);
              }}
              valid={validation.model === true}
              invalid={validation.model !== true && validation.model !== null}
            />
            {validation.model !== null && (
              <div className={validation.model === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.model === true 
                  ? "Отлично!" 
                  : "Введите корректную модель техники"}
              </div>
            )}
          </div>
        </Col>

        {/* Страна происхождения */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="countryOriginSelect" className="form-label">Страна происхождения</Label>
            <select 
              className="form-select" 
              id="countryOriginSelect"
              value={equipment.country_origin || ''}
              onChange={(e) => handleInputChange('country_origin', e.target.value)}
            >
              <option value="">Выберите страну</option>
              {equipmentFormConfig.originCountries.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Статус активности */}
        <Col lg={6}>
          <div className="mb-3">
            <div className="form-check form-switch mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={equipment.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="isActiveSwitch">
                <span className={`badge ${equipment.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                  {equipment.is_active ? '✓ Активная' : '✗ Неактивная'}
                </span>
                техника
              </Label>
            </div>
          </div>
        </Col>

        {/* Описание */}
        <Col lg={12}>
          <div className="mb-3 pb-2">
            <Label htmlFor="descriptionTextarea" className="form-label">Описание</Label>
            <textarea 
              className="form-control"
              id="descriptionTextarea"
              rows={3} 
              placeholder="Описание назначения и особенностей техники..."
              value={equipment.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab;
