import React, { useState } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { HarvestedProductData } from '../hooks/useHarvestedProductEdit';
import { harvestedProductFormConfig } from '../config/editConfig';

interface QualityTabProps {
  harvestedProduct: HarvestedProductData | null;
  updateHarvestedProduct: (updates: Partial<HarvestedProductData>) => void;
  validationErrors: {[key: string]: string};
}

const QualityTab: React.FC<QualityTabProps> = ({ 
  harvestedProduct, 
  updateHarvestedProduct, 
  validationErrors 
}) => {
  // State для валидации
  const [validation, setValidation] = useState({
    moisture_content: null as boolean | null,
    protein_content: null as boolean | null,
    oil_content: null as boolean | null,
    gluten_content: null as boolean | null,
    sugar_content: null as boolean | null,
    starch_content: null as boolean | null,
    impurities: null as boolean | null,
    damaged_grains: null as boolean | null,
    test_weight: null as boolean | null,
    quality_class: null as boolean | null,
    grade: null as boolean | null
  });

  // Функция валидации при изменении поля
  const onChangeValidation = (fieldName: string, value: any) => {
    const modifiedV: any = { ...validation };
    
    if (['moisture_content', 'protein_content', 'oil_content', 'gluten_content', 
         'sugar_content', 'starch_content', 'impurities', 'damaged_grains'].includes(fieldName)) {
      const numValue = parseFloat(value);
      modifiedV[fieldName] = !value || (!isNaN(numValue) && numValue >= 0 && numValue <= 100);
    } else if (fieldName === 'test_weight') {
      const numValue = parseFloat(value);
      modifiedV[fieldName] = !value || (!isNaN(numValue) && numValue > 0);
    } else if (fieldName === 'quality_class' || fieldName === 'grade') {
      modifiedV[fieldName] = !value || value !== '';
    }
    
    setValidation(modifiedV);
  };

  if (!harvestedProduct) return null;

  const handleInputChange = (field: keyof HarvestedProductData, value: string | number | undefined) => {
    updateHarvestedProduct({ [field]: value });
  };

  const handleAdditionalIndicatorChange = (indicator: string, value: string) => {
    const currentIndicators = harvestedProduct.additional_indicators || {};
    const numValue = parseFloat(value) || undefined;
    
    updateHarvestedProduct({ 
      additional_indicators: {
        ...currentIndicators,
        [indicator]: numValue
      }
    });
  };

  return (
    <Form>
      <Row className="g-3">
        {/* Основные показатели качества */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-star-line me-2"></i>
              Основные показатели качества
            </h6>
          </div>
        </Col>

        {/* Влажность */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="moistureContentInput" className="form-label">Влажность (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="moistureContentInput"
              placeholder="14.5"
              step="0.01"
              min="0"
              max="100"
              value={harvestedProduct.moisture_content || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('moisture_content', value);
                onChangeValidation('moisture_content', e.target.value);
              }}
              valid={validation.moisture_content === true}
              invalid={(validation.moisture_content !== true && validation.moisture_content !== null) || !!validationErrors.moisture_content}
            />
            {(validation.moisture_content !== null || validationErrors.moisture_content) && (
              <div className={validation.moisture_content === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.moisture_content === true 
                  ? "Отлично!" 
                  : validationErrors.moisture_content || "Влажность должна быть от 0 до 100%"}
              </div>
            )}
          </div>
        </Col>

        {/* Белок */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="proteinContentInput" className="form-label">Белок (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="proteinContentInput"
              placeholder="12.8"
              step="0.01"
              min="0"
              max="100"
              value={harvestedProduct.protein_content || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('protein_content', value);
                onChangeValidation('protein_content', e.target.value);
              }}
              valid={validation.protein_content === true}
              invalid={(validation.protein_content !== true && validation.protein_content !== null) || !!validationErrors.protein_content}
            />
            {(validation.protein_content !== null || validationErrors.protein_content) && (
              <div className={validation.protein_content === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.protein_content === true 
                  ? "Отлично!" 
                  : validationErrors.protein_content || "Белок должен быть от 0 до 100%"}
              </div>
            )}
          </div>
        </Col>

        {/* Масличность */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="oilContentInput" className="form-label">Масличность (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="oilContentInput"
              placeholder="48.2"
              step="0.01"
              min="0"
              max="100"
              value={harvestedProduct.oil_content || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('oil_content', value);
                onChangeValidation('oil_content', e.target.value);
              }}
              valid={validation.oil_content === true}
              invalid={(validation.oil_content !== true && validation.oil_content !== null) || !!validationErrors.oil_content}
            />
            {(validation.oil_content !== null || validationErrors.oil_content) && (
              <div className={validation.oil_content === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.oil_content === true 
                  ? "Отлично!" 
                  : validationErrors.oil_content || "Масличность должна быть от 0 до 100%"}
              </div>
            )}
          </div>
        </Col>

        {/* Клейковина */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="glutenContentInput" className="form-label">Клейковина (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="glutenContentInput"
              placeholder="28.5"
              step="0.01"
              min="0"
              max="100"
              value={harvestedProduct.gluten_content || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('gluten_content', value);
                onChangeValidation('gluten_content', e.target.value);
              }}
              valid={validation.gluten_content === true}
              invalid={validation.gluten_content !== true && validation.gluten_content !== null}
            />
            {validation.gluten_content !== null && (
              <div className={validation.gluten_content === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.gluten_content === true 
                  ? "Отлично!" 
                  : "Клейковина должна быть от 0 до 100%"}
              </div>
            )}
          </div>
        </Col>

        {/* Сахар */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="sugarContentInput" className="form-label">Сахар (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="sugarContentInput"
              placeholder="16.2"
              step="0.01"
              min="0"
              max="100"
              value={harvestedProduct.sugar_content || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('sugar_content', value);
                onChangeValidation('sugar_content', e.target.value);
              }}
              valid={validation.sugar_content === true}
              invalid={validation.sugar_content !== true && validation.sugar_content !== null}
            />
            {validation.sugar_content !== null && (
              <div className={validation.sugar_content === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.sugar_content === true 
                  ? "Отлично!" 
                  : "Сахар должен быть от 0 до 100%"}
              </div>
            )}
          </div>
        </Col>

        {/* Крахмал */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="starchContentInput" className="form-label">Крахмал (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="starchContentInput"
              placeholder="72.4"
              step="0.01"
              min="0"
              max="100"
              value={harvestedProduct.starch_content || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('starch_content', value);
                onChangeValidation('starch_content', e.target.value);
              }}
              valid={validation.starch_content === true}
              invalid={validation.starch_content !== true && validation.starch_content !== null}
            />
            {validation.starch_content !== null && (
              <div className={validation.starch_content === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.starch_content === true 
                  ? "Отлично!" 
                  : "Крахмал должен быть от 0 до 100%"}
              </div>
            )}
          </div>
        </Col>

        {/* Примеси и дефекты */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-alert-line me-2"></i>
              Примеси и дефекты
            </h6>
          </div>
        </Col>

        {/* Примеси */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="impuritiesInput" className="form-label">Примеси (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="impuritiesInput"
              placeholder="2.1"
              step="0.01"
              min="0"
              max="100"
              value={harvestedProduct.impurities || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('impurities', value);
                onChangeValidation('impurities', e.target.value);
              }}
              valid={validation.impurities === true}
              invalid={(validation.impurities !== true && validation.impurities !== null) || !!validationErrors.impurities}
            />
            {(validation.impurities !== null || validationErrors.impurities) && (
              <div className={validation.impurities === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.impurities === true 
                  ? "Отлично!" 
                  : validationErrors.impurities || "Примеси должны быть от 0 до 100%"}
              </div>
            )}
          </div>
        </Col>

        {/* Поврежденные зерна */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="damagedGrainsInput" className="form-label">Поврежденные зерна (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="damagedGrainsInput"
              placeholder="3.5"
              step="0.01"
              min="0"
              max="100"
              value={harvestedProduct.damaged_grains || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('damaged_grains', value);
                onChangeValidation('damaged_grains', e.target.value);
              }}
              valid={validation.damaged_grains === true}
              invalid={validation.damaged_grains !== true && validation.damaged_grains !== null}
            />
            {validation.damaged_grains !== null && (
              <div className={validation.damaged_grains === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.damaged_grains === true 
                  ? "Отлично!" 
                  : "Поврежденные зерна должны быть от 0 до 100%"}
              </div>
            )}
          </div>
        </Col>

        {/* Натурный вес */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="testWeightInput" className="form-label">Натурный вес (г/л)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="testWeightInput"
              placeholder="780.5"
              step="0.1"
              min="0"
              value={harvestedProduct.test_weight || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('test_weight', value);
                onChangeValidation('test_weight', e.target.value);
              }}
              valid={validation.test_weight === true}
              invalid={validation.test_weight !== true && validation.test_weight !== null}
            />
            {validation.test_weight !== null && (
              <div className={validation.test_weight === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.test_weight === true 
                  ? "Отлично!" 
                  : "Натурный вес должен быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Классификация */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-award-line me-2"></i>
              Классификация качества
            </h6>
          </div>
        </Col>

        {/* Класс качества */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="qualityClassSelect" className="form-label">Класс качества</Label>
            <select 
              className="form-select" 
              id="qualityClassSelect"
              value={harvestedProduct.quality_class || ''}
              onChange={(e) => {
                handleInputChange('quality_class', e.target.value);
                onChangeValidation('quality_class', e.target.value);
              }}
            >
              <option value="">Выберите класс качества</option>
              {harvestedProductFormConfig.qualityClasses.map(qualityClass => (
                <option key={qualityClass.value} value={qualityClass.value}>
                  {qualityClass.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Сорт/Марка */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="gradeSelect" className="form-label">Сорт/Марка</Label>
            <select 
              className="form-select" 
              id="gradeSelect"
              value={harvestedProduct.grade || ''}
              onChange={(e) => {
                handleInputChange('grade', e.target.value);
                onChangeValidation('grade', e.target.value);
              }}
            >
              <option value="">Выберите сорт/марку</option>
              {harvestedProductFormConfig.grades.map(grade => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Дополнительные показатели */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-flask-line me-2"></i>
              Дополнительные показатели
            </h6>
          </div>
        </Col>

        {/* Зольность */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="ashContentInput" className="form-label">Зольность (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="ashContentInput"
              placeholder="1.8"
              step="0.01"
              min="0"
              value={harvestedProduct.additional_indicators?.ash_content || ''}
              onChange={(e) => handleAdditionalIndicatorChange('ash_content', e.target.value)}
            />
          </div>
        </Col>

        {/* Число падения */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="fallingNumberInput" className="form-label">Число падения (сек)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="fallingNumberInput"
              placeholder="250"
              min="0"
              value={harvestedProduct.additional_indicators?.falling_number || ''}
              onChange={(e) => handleAdditionalIndicatorChange('falling_number', e.target.value)}
            />
          </div>
        </Col>

        {/* Твердость */}
        <Col lg={4}>
          <div className="mb-3 pb-2">
            <Label htmlFor="hardnessInput" className="form-label">Твердость</Label>
            <Input 
              type="number" 
              className="form-control"
              id="hardnessInput"
              placeholder="65"
              min="0"
              value={harvestedProduct.additional_indicators?.hardness || ''}
              onChange={(e) => handleAdditionalIndicatorChange('hardness', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default QualityTab; 
