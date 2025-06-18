// src/pages/References/Pesticides/components/BasicInfoTab.tsx

import React, { useState } from 'react';
import { Form, Row, Col, Label, Input, Button } from 'reactstrap';
import { PesticideData } from '../hooks/usePesticideEdit';
import { pesticideFormConfig } from '../config/editConfig';

interface BasicInfoTabProps {
  pesticide: PesticideData | null;
  updatePesticide: (updates: Partial<PesticideData>) => void;
  validationErrors: {[key: string]: string};
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  pesticide, 
  updatePesticide, 
  validationErrors 
}) => {
  // State для валидации
  const [validation, setValidation] = useState({
    name: null as boolean | null,
    pesticide_type: null as boolean | null,
    hazard_class: null as boolean | null,
    physical_form: null as boolean | null,
    active_substances: null as boolean | null,
    registration_number: null as boolean | null
  });

  // Функция валидации при изменении поля
  const onChangeValidation = (fieldName: string, value: any) => {
    const modifiedV: any = { ...validation };
    
    if (fieldName === 'name') {
      modifiedV[fieldName] = value && value.trim().length >= 2;
    } else if (fieldName === 'pesticide_type') {
      modifiedV[fieldName] = value && value !== '';
    } else if (fieldName === 'hazard_class') {
      modifiedV[fieldName] = value && value !== '';
    } else if (fieldName === 'physical_form') {
      modifiedV[fieldName] = value && value !== '';
    } else if (fieldName === 'registration_number') {
      const pattern = /^[A-Za-z0-9\-]*$/;
      modifiedV[fieldName] = !value || pattern.test(value);
    } else if (fieldName === 'active_substances') {
      modifiedV[fieldName] = value && Array.isArray(value) && value.length > 0;
    }
    
    setValidation(modifiedV);
  };

  if (!pesticide) return null;

  const handleInputChange = (fieldName: keyof PesticideData, value: string | number | boolean | undefined) => {
    updatePesticide({ [fieldName]: value });
  };

  // Обработка активных веществ
  const getActiveSubstances = () => {
    if (!pesticide.active_substances) return [];
    if (typeof pesticide.active_substances === 'string') {
      try {
        return JSON.parse(pesticide.active_substances);
      } catch {
        return [];
      }
    }
    return pesticide.active_substances;
  };

  const updateActiveSubstances = (substances: any[]) => {
    updatePesticide({ active_substances: substances });
    onChangeValidation('active_substances', substances);
  };

  const addActiveSubstance = () => {
    const substances = getActiveSubstances();
    const newSubstance = {
      substance: '',
      concentration: 0,
      unit: '%'
    };
    updateActiveSubstances([...substances, newSubstance]);
  };

  const updateActiveSubstance = (index: number, field: string, value: any) => {
    const substances = getActiveSubstances();
    substances[index] = { ...substances[index], [field]: value };
    updateActiveSubstances(substances);
  };

  const removeActiveSubstance = (index: number) => {
    const substances = getActiveSubstances();
    substances.splice(index, 1);
    updateActiveSubstances(substances);
  };

  return (
    <Form>
      <Row>
        {/* Название препарата */}
        <Col lg={12}>
          <div className="mb-3 position-relative">
            <Label htmlFor="nameInput" className="form-label">
              Название препарата <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id="nameInput"
              placeholder="Введите название препарата" 
              value={pesticide.name || ''}
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
                : validationErrors.name || "Пожалуйста, введите название препарата (минимум 2 символа)"}
            </div>
          </div>
        </Col>

        {/* Торговое название */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="tradeNameInput" className="form-label">Торговое название</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="tradeNameInput"
              placeholder="Торговое название (если отличается)"
              value={pesticide.trade_name || ''}
              onChange={(e) => handleInputChange('trade_name', e.target.value)}
            />
          </div>
        </Col>

        {/* Номер регистрации */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="registrationNumberInput" className="form-label">Номер регистрации</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="registrationNumberInput"
              placeholder="1234-12-345-678-0-0-0-1"
              value={pesticide.registration_number || ''}
              onChange={(e) => {
                handleInputChange('registration_number', e.target.value);
                onChangeValidation('registration_number', e.target.value);
              }}
              valid={validation.registration_number === true}
              invalid={validation.registration_number !== true && validation.registration_number !== null}
            />
            {validation.registration_number !== null && (
              <div className={validation.registration_number === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.registration_number === true 
                  ? "Отлично!" 
                  : "Номер может содержать только буквы, цифры и дефисы"}
              </div>
            )}
          </div>
        </Col>

        {/* Тип пестицида */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="pesticideTypeSelect" className="form-label">
              Тип пестицида <span className="text-danger">*</span>
            </Label>
            <select 
              className="form-select" 
              id="pesticideTypeSelect"
              value={pesticide.pesticide_type || ''}
              onChange={(e) => {
                handleInputChange('pesticide_type', e.target.value);
                onChangeValidation('pesticide_type', e.target.value);
              }}
            >
              <option value="">Выберите тип</option>
              {pesticideFormConfig.pesticideTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {(validation.pesticide_type !== null || validationErrors.pesticide_type) && (
              <div className={validation.pesticide_type === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.pesticide_type === true 
                  ? "Отлично!" 
                  : validationErrors.pesticide_type || "Пожалуйста, выберите тип пестицида"}
              </div>
            )}
          </div>
        </Col>

        {/* Класс опасности */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="hazardClassSelect" className="form-label">
              Класс опасности <span className="text-danger">*</span>
            </Label>
            <select 
              className="form-select" 
              id="hazardClassSelect"
              value={pesticide.hazard_class || ''}
              onChange={(e) => {
                handleInputChange('hazard_class', e.target.value);
                onChangeValidation('hazard_class', e.target.value);
              }}
            >
              <option value="">Выберите класс</option>
              {pesticideFormConfig.hazardClasses.map(hazardClass => (
                <option key={hazardClass.value} value={hazardClass.value}>
                  {hazardClass.label}
                </option>
              ))}
            </select>
            {(validation.hazard_class !== null || validationErrors.hazard_class) && (
              <div className={validation.hazard_class === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.hazard_class === true 
                  ? "Отлично!" 
                  : validationErrors.hazard_class || "Пожалуйста, выберите класс опасности"}
              </div>
            )}
          </div>
        </Col>

        {/* Физическая форма */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="physicalFormSelect" className="form-label">
              Физическая форма <span className="text-danger">*</span>
            </Label>
            <select 
              className="form-select" 
              id="physicalFormSelect"
              value={pesticide.physical_form || ''}
              onChange={(e) => {
                handleInputChange('physical_form', e.target.value);
                onChangeValidation('physical_form', e.target.value);
              }}
            >
              <option value="">Выберите форму</option>
              {pesticideFormConfig.physicalForms.map(form => (
                <option key={form.value} value={form.value}>
                  {form.label}
                </option>
              ))}
            </select>
            {(validation.physical_form !== null || validationErrors.physical_form) && (
              <div className={validation.physical_form === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.physical_form === true 
                  ? "Отлично!" 
                  : validationErrors.physical_form || "Пожалуйста, выберите физическую форму"}
              </div>
            )}
          </div>
        </Col>

        {/* Статус активности */}
        <Col lg={12}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={pesticide.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="isActiveSwitch">
                <span className={`badge ${pesticide.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                  {pesticide.is_active ? '✓ Активный' : '✗ Неактивный'}
                </span>
                препарат
              </Label>
            </div>
          </div>
        </Col>

        {/* Активные вещества */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-flask-line me-2"></i>
              Активные вещества <span className="text-danger">*</span>
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            {getActiveSubstances().map((substance: any, index: number) => (
              <div key={index} className="border rounded p-3 mb-3">
                <Row>
                  <Col lg={5}>
                    <Label className="form-label">Активное вещество</Label>
                    <Input 
                      type="text" 
                      className="form-control"
                      placeholder="Название вещества"
                      list="substancesList"
                      value={substance.substance || ''}
                      onChange={(e) => updateActiveSubstance(index, 'substance', e.target.value)}
                    />
                    <datalist id="substancesList">
                      {pesticideFormConfig.commonActiveSubstances.map(sub => (
                        <option key={sub} value={sub} />
                      ))}
                    </datalist>
                  </Col>
                  <Col lg={3}>
                    <Label className="form-label">Концентрация</Label>
                    <Input 
                      type="number" 
                      className="form-control"
                      placeholder="0"
                      step="0.01"
                      min="0"
                      max="100"
                      value={substance.concentration || ''}
                      onChange={(e) => updateActiveSubstance(index, 'concentration', parseFloat(e.target.value) || 0)}
                    />
                  </Col>
                  <Col lg={2}>
                    <Label className="form-label">Единица</Label>
                    <select 
                      className="form-select"
                      value={substance.unit || '%'}
                      onChange={(e) => updateActiveSubstance(index, 'unit', e.target.value)}
                    >
                      {pesticideFormConfig.concentrationUnits.map(unit => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col lg={2} className="d-flex align-items-end">
                    <Button 
                      color="danger" 
                      size="sm" 
                      outline
                      onClick={() => removeActiveSubstance(index)}
                      disabled={getActiveSubstances().length <= 1}
                    >
                      <i className="ri-delete-bin-line"></i>
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
            
            <Button 
              color="primary" 
              size="sm" 
              outline 
              onClick={addActiveSubstance}
            >
              <i className="ri-add-line me-1"></i>
              Добавить активное вещество
            </Button>
            
            {(validation.active_substances !== null || validationErrors.active_substances) && (
              <div className={`mt-2 ${validation.active_substances === true ? 'text-success' : 'text-danger'}`}>
                {validation.active_substances === true 
                  ? "✓ Активные вещества указаны" 
                  : validationErrors.active_substances || "Необходимо указать хотя бы одно активное вещество"}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab; 
