// src/pages/References/Pesticides/components/RequisitesTab.tsx

import React, { useState } from 'react';
import { Form, Row, Col, Label, Input, Button } from 'reactstrap';
import { PesticideData } from '../hooks/usePesticideEdit';
import { pesticideFormConfig } from '../config/editConfig';

interface RequisitesTabProps {
  pesticide: PesticideData | null;
  updatePesticide: (updates: Partial<PesticideData>) => void;
  validationErrors: {[key: string]: string};
}

const RequisitesTab: React.FC<RequisitesTabProps> = ({ 
  pesticide, 
  updatePesticide, 
  validationErrors 
}) => {
  if (!pesticide) return null;

  const handleInputChange = (fieldName: keyof PesticideData, value: any) => {
    updatePesticide({ [fieldName]: value });
  };

  // Вспомогательные функции для работы с JSONB полями
  const getTargetPests = () => {
    if (!pesticide.target_pests) return [];
    if (typeof pesticide.target_pests === 'string') {
      try {
        return JSON.parse(pesticide.target_pests);
      } catch {
        return [];
      }
    }
    return pesticide.target_pests;
  };

  const updateTargetPests = (pests: any[]) => {
    updatePesticide({ target_pests: pests });
  };

  const addTargetPest = () => {
    const pests = getTargetPests();
    const newPest = {
      pest: '',
      effectiveness: 'средняя'
    };
    updateTargetPests([...pests, newPest]);
  };

  const updateTargetPest = (index: number, field: string, value: any) => {
    const pests = getTargetPests();
    pests[index] = { ...pests[index], [field]: value };
    updateTargetPests(pests);
  };

  const removeTargetPest = (index: number) => {
    const pests = getTargetPests();
    pests.splice(index, 1);
    updateTargetPests(pests);
  };

  const getTargetCrops = () => {
    if (!pesticide.target_crops) return [];
    if (typeof pesticide.target_crops === 'string') {
      try {
        return JSON.parse(pesticide.target_crops);
      } catch {
        return [];
      }
    }
    return pesticide.target_crops;
  };

  const updateTargetCrops = (crops: any[]) => {
    updatePesticide({ target_crops: crops });
  };

  const addTargetCrop = () => {
    const crops = getTargetCrops();
    const newCrop = {
      crop: '',
      growth_stage: 'вегетация'
    };
    updateTargetCrops([...crops, newCrop]);
  };

  const updateTargetCrop = (index: number, field: string, value: any) => {
    const crops = getTargetCrops();
    crops[index] = { ...crops[index], [field]: value };
    updateTargetCrops(crops);
  };

  const removeTargetCrop = (index: number) => {
    const crops = getTargetCrops();
    crops.splice(index, 1);
    updateTargetCrops(crops);
  };

  const getDosageInfo = () => {
    if (!pesticide.dosage_info) return { min_dose: '', max_dose: '', unit: 'л/га' };
    if (typeof pesticide.dosage_info === 'string') {
      try {
        return JSON.parse(pesticide.dosage_info);
      } catch {
        return { min_dose: '', max_dose: '', unit: 'л/га' };
      }
    }
    return pesticide.dosage_info;
  };

  const updateDosageField = (field: string, value: any) => {
    const currentDosage = getDosageInfo();
    const updatedDosage = {
      ...currentDosage,
      [field]: value
    };
    handleInputChange('dosage_info', updatedDosage);
  };

  const getConcentrationInfo = () => {
    if (!pesticide.concentration_info) return { total_concentration: '', unit: '%', formulation_type: '' };
    if (typeof pesticide.concentration_info === 'string') {
      try {
        return JSON.parse(pesticide.concentration_info);
      } catch {
        return { total_concentration: '', unit: '%', formulation_type: '' };
      }
    }
    return pesticide.concentration_info;
  };

  const updateConcentrationField = (field: string, value: any) => {
    const currentConcentration = getConcentrationInfo();
    const updatedConcentration = {
      ...currentConcentration,
      [field]: value
    };
    handleInputChange('concentration_info', updatedConcentration);
  };

  return (
    <Form>
      <Row className="g-3">
        {/* Целевые вредители */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-bug-line me-2"></i>
              Целевые вредители
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            {getTargetPests().map((pest: any, index: number) => (
              <div key={index} className="border rounded p-3 mb-3">
                <Row>
                  <Col lg={6}>
                    <Label className="form-label">Вредитель</Label>
                    <Input 
                      type="text" 
                      className="form-control"
                      placeholder="Название вредителя"
                      list="pestsList"
                      value={pest.pest || ''}
                      onChange={(e) => updateTargetPest(index, 'pest', e.target.value)}
                    />
                    <datalist id="pestsList">
                      {pesticideFormConfig.commonPests.map(p => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </Col>
                  <Col lg={4}>
                    <Label className="form-label">Эффективность</Label>
                    <select 
                      className="form-select"
                      value={pest.effectiveness || 'средняя'}
                      onChange={(e) => updateTargetPest(index, 'effectiveness', e.target.value)}
                    >
                      {pesticideFormConfig.effectivenessLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col lg={2} className="d-flex align-items-end">
                    <Button 
                      color="danger" 
                      size="sm" 
                      outline
                      onClick={() => removeTargetPest(index)}
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
              onClick={addTargetPest}
            >
              <i className="ri-add-line me-1"></i>
              Добавить вредителя
            </Button>
          </div>
        </Col>

        {/* Целевые культуры */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-plant-line me-2"></i>
              Целевые культуры
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            {getTargetCrops().map((crop: any, index: number) => (
              <div key={index} className="border rounded p-3 mb-3">
                <Row>
                  <Col lg={6}>
                    <Label className="form-label">Культура</Label>
                    <Input 
                      type="text" 
                      className="form-control"
                      placeholder="Название культуры"
                      list="cropsList"
                      value={crop.crop || ''}
                      onChange={(e) => updateTargetCrop(index, 'crop', e.target.value)}
                    />
                    <datalist id="cropsList">
                      {pesticideFormConfig.commonCrops.map(c => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </Col>
                  <Col lg={4}>
                    <Label className="form-label">Стадия развития</Label>
                    <select 
                      className="form-select"
                      value={crop.growth_stage || 'вегетация'}
                      onChange={(e) => updateTargetCrop(index, 'growth_stage', e.target.value)}
                    >
                      {pesticideFormConfig.growthStages.map(stage => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col lg={2} className="d-flex align-items-end">
                    <Button 
                      color="danger" 
                      size="sm" 
                      outline
                      onClick={() => removeTargetCrop(index)}
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
              onClick={addTargetCrop}
            >
              <i className="ri-add-line me-1"></i>
              Добавить культуру
            </Button>
          </div>
        </Col>

        {/* Способ применения */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-settings-line me-2"></i>
              Применение
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="applicationMethodInput" className="form-label">Способ применения</Label>
            <Input 
              type="text" 
              className="form-control"
              id="applicationMethodInput"
              placeholder="Опрыскивание по вегетации"
              list="applicationMethodsList"
              value={pesticide.application_method || ''}
              onChange={(e) => handleInputChange('application_method', e.target.value)}
            />
            <datalist id="applicationMethodsList">
              {pesticideFormConfig.applicationMethods.map(method => (
                <option key={method} value={method} />
              ))}
            </datalist>
          </div>
        </Col>

        {/* Дозировка */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="minDoseInput" className="form-label">Минимальная доза</Label>
            <Input 
              type="number" 
              className="form-control"
              id="minDoseInput"
              placeholder="0.5"
              step="0.01"
              min="0"
              value={getDosageInfo().min_dose || ''}
              onChange={(e) => updateDosageField('min_dose', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="maxDoseInput" className="form-label">Максимальная доза</Label>
            <Input 
              type="number" 
              className="form-control"
              id="maxDoseInput"
              placeholder="2.0"
              step="0.01"
              min="0"
              value={getDosageInfo().max_dose || ''}
              onChange={(e) => updateDosageField('max_dose', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="dosageUnitSelect" className="form-label">Единица измерения</Label>
            <select 
              className="form-select"
              id="dosageUnitSelect"
              value={getDosageInfo().unit || 'л/га'}
              onChange={(e) => updateDosageField('unit', e.target.value)}
            >
              {pesticideFormConfig.dosageUnits.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Информация о концентрации */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-flask-line me-2"></i>
              Концентрация
            </h6>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="totalConcentrationInput" className="form-label">Общая концентрация</Label>
            <Input 
              type="number" 
              className="form-control"
              id="totalConcentrationInput"
              placeholder="48"
              step="0.01"
              min="0"
              max="100"
              value={getConcentrationInfo().total_concentration || ''}
              onChange={(e) => updateConcentrationField('total_concentration', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="concentrationUnitSelect" className="form-label">Единица</Label>
            <select 
              className="form-select"
              id="concentrationUnitSelect"
              value={getConcentrationInfo().unit || '%'}
              onChange={(e) => updateConcentrationField('unit', e.target.value)}
            >
              {pesticideFormConfig.concentrationUnits.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="formulationTypeInput" className="form-label">Тип препаративной формы</Label>
            <Input 
              type="text" 
              className="form-control"
              id="formulationTypeInput"
              placeholder="концентрат эмульсии"
              value={getConcentrationInfo().formulation_type || ''}
              onChange={(e) => updateConcentrationField('formulation_type', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default RequisitesTab; 
