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

interface BasicInfoTabProps {
  field: FieldData | null;
  updateField: (updates: Partial<FieldData>) => void;
  validationErrors: {[key: string]: string};
}

// Конфигурация для формы (соответствует FieldData)
const fieldFormConfig = {
  soilTypes: [
    { value: 'чернозем', label: 'Чернозем' },
    { value: 'суглинок', label: 'Суглинок' },
    { value: 'супесь', label: 'Супесь' },
    { value: 'песчаная', label: 'Песчаная' },
    { value: 'глинистая', label: 'Глинистая' },
    { value: 'торфяная', label: 'Торфяная' },
    { value: 'другая', label: 'Другая' }
  ],
  irrigationTypes: [
    { value: 'отсутствует', label: 'Отсутствует' },
    { value: 'капельное', label: 'Капельное орошение' },
    { value: 'дождевание', label: 'Дождевание' },
    { value: 'поверхностное', label: 'Поверхностное' },
    { value: 'подпочвенное', label: 'Подпочвенное' }
  ],
  fieldStatuses: [
    { value: 'активное', label: 'Активное' },
    { value: 'под_паром', label: 'Под паром' },
    { value: 'в_севообороте', label: 'В севообороте' },
    { value: 'временно_неиспользуемое', label: 'Временно неиспользуемое' },
    { value: 'подготовка_к_обработке', label: 'Подготовка к обработке' }
  ]
};

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  field, 
  updateField, 
  validationErrors 
}) => {
  // State для валидации
  const [validation, setValidation] = useState({
    field_name: null as boolean | null,
    field_code: null as boolean | null,
    area_hectares: null as boolean | null,
    cadastral_number: null as boolean | null,
    soil_quality_score: null as boolean | null
  });

  // Функция валидации при изменении поля
  const onChangeValidation = (fieldName: string, value: any) => {
    const modifiedV: any = { ...validation };
    
    if (fieldName === 'field_name') {
      modifiedV[fieldName] = value && value.trim().length > 0;
    } else if (fieldName === 'field_code') {
      const codePattern = /^[A-Za-z0-9\-_]*$/;
      modifiedV[fieldName] = !value || codePattern.test(value);
    } else if (fieldName === 'area_hectares') {
      const numValue = parseFloat(value);
      modifiedV[fieldName] = !value || (!isNaN(numValue) && numValue > 0);
    } else if (fieldName === 'cadastral_number') {
      const cadastralPattern = /^(\d{2}:\d{2}:\d{6,7}:\d{1,4})?$/;
      modifiedV[fieldName] = !value || cadastralPattern.test(value);
    } else if (fieldName === 'soil_quality_score') {
      const numValue = parseFloat(value);
      modifiedV[fieldName] = !value || (!isNaN(numValue) && numValue >= 0 && numValue <= 100);
    }
    
    setValidation(modifiedV);
  };

  if (!field) return null;

  const handleInputChange = (fieldName: keyof FieldData, value: string | boolean | number | undefined) => {
    updateField({ [fieldName]: value });
  };

  return (
    <Form>
      <Row>
        {/* Наименование поля */}
        <Col lg={12}>
          <div className="mb-3 position-relative">
            <Label htmlFor="fieldNameInput" className="form-label">
              Наименование поля <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id="fieldNameInput"
              placeholder="Введите наименование поля" 
              value={field.field_name || ''}
              onChange={(e) => {
                handleInputChange('field_name', e.target.value);
                onChangeValidation('field_name', e.target.value);
              }}
              valid={validation.field_name === true}
              invalid={(validation.field_name !== true && validation.field_name !== null) || !!validationErrors.field_name}
            />
            <div className={validation.field_name === true ? "valid-tooltip" : "invalid-tooltip"}>
              {validation.field_name === true 
                ? "Отлично!" 
                : validationErrors.field_name || "Пожалуйста, введите наименование поля"}
            </div>
          </div>
        </Col>

        {/* Код поля */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="fieldCodeInput" className="form-label">Код поля</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="fieldCodeInput"
              placeholder="FIELD-001, P-2024"
              value={field.field_code || ''}
              onChange={(e) => {
                handleInputChange('field_code', e.target.value);
                onChangeValidation('field_code', e.target.value);
              }}
              valid={validation.field_code === true}
              invalid={validation.field_code !== true && validation.field_code !== null}
            />
            {validation.field_code !== null && (
              <div className={validation.field_code === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.field_code === true 
                  ? "Отлично!" 
                  : "Код может содержать только буквы, цифры, дефисы и подчеркивания"}
              </div>
            )}
          </div>
        </Col>

        {/* Площадь */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="areaInput" className="form-label">
              Площадь (га) <span className="text-danger">*</span>
            </Label>
            <Input 
              type="number" 
              className="form-control" 
              id="areaInput"
              placeholder="125.5"
              step="0.01"
              min="0"
              value={field.area_hectares || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('area_hectares', value);
                onChangeValidation('area_hectares', e.target.value);
              }}
              valid={validation.area_hectares === true}
              invalid={(validation.area_hectares !== true && validation.area_hectares !== null) || !!validationErrors.area_hectares}
            />
            {(validation.area_hectares !== null || validationErrors.area_hectares) && (
              <div className={validation.area_hectares === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.area_hectares === true 
                  ? "Отлично!" 
                  : validationErrors.area_hectares || "Площадь должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Статус активности */}
        <Col lg={4}>
          <div className="mb-3">
            <div className="form-check form-switch mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={field.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="isActiveSwitch">
                <span className={`badge ${field.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                  {field.is_active ? '✓ Активное' : '✗ Неактивное'}
                </span>
                поле
              </Label>
            </div>
          </div>
        </Col>

        {/* Кадастровый номер */}
        <Col lg={12}>
          <div className="mb-3 position-relative">
            <Label htmlFor="cadastralNumberInput" className="form-label">Кадастровый номер</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="cadastralNumberInput"
              placeholder="50:01:0040101:1234"
              value={field.cadastral_number || ''}
              onChange={(e) => {
                handleInputChange('cadastral_number', e.target.value);
                onChangeValidation('cadastral_number', e.target.value);
              }}
              valid={validation.cadastral_number === true}
              invalid={validation.cadastral_number !== true && validation.cadastral_number !== null}
            />
            {validation.cadastral_number !== null && (
              <div className={validation.cadastral_number === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.cadastral_number === true 
                  ? "Отлично!" 
                  : "Введите кадастровый номер в формате XX:XX:XXXXXXX:XXXX"}
              </div>
            )}
          </div>
        </Col>

        {/* Тип почвы */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="soilTypeSelect" className="form-label">Тип почвы</Label>
            <select 
              className="form-select" 
              id="soilTypeSelect"
              value={field.soil_type || ''}
              onChange={(e) => handleInputChange('soil_type', e.target.value)}
            >
              <option value="">Выберите тип почвы</option>
              {fieldFormConfig.soilTypes.map(soil => (
                <option key={soil.value} value={soil.value}>
                  {soil.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Балл бонитета почвы */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="soilQualityInput" className="form-label">Балл бонитета почвы (0-100)</Label>
            <Input 
              type="number" 
              className="form-control" 
              id="soilQualityInput"
              placeholder="75"
              min="0"
              max="100"
              value={field.soil_quality_score || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('soil_quality_score', value);
                onChangeValidation('soil_quality_score', e.target.value);
              }}
              valid={validation.soil_quality_score === true}
              invalid={validation.soil_quality_score !== true && validation.soil_quality_score !== null}
            />
            {validation.soil_quality_score !== null && (
              <div className={validation.soil_quality_score === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.soil_quality_score === true 
                  ? "Отлично!" 
                  : "Балл бонитета должен быть от 0 до 100"}
              </div>
            )}
          </div>
        </Col>

        {/* Тип орошения */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="irrigationTypeSelect" className="form-label">Тип орошения</Label>
            <select 
              className="form-select" 
              id="irrigationTypeSelect"
              value={field.irrigation_type || ''}
              onChange={(e) => handleInputChange('irrigation_type', e.target.value)}
            >
              <option value="">Выберите тип орошения</option>
              {fieldFormConfig.irrigationTypes.map(irrigation => (
                <option key={irrigation.value} value={irrigation.value}>
                  {irrigation.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Статус поля */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="fieldStatusSelect" className="form-label">Статус поля</Label>
            <select 
              className="form-select" 
              id="fieldStatusSelect"
              value={field.field_status || ''}
              onChange={(e) => handleInputChange('field_status', e.target.value)}
            >
              <option value="">Выберите статус</option>
              {fieldFormConfig.fieldStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Примечания */}
        <Col lg={12}>
          <div className="mb-3 pb-2">
            <Label htmlFor="notesTextarea" className="form-label">Примечания</Label>
            <textarea 
              className="form-control"
              id="notesTextarea"
              rows={3} 
              placeholder="Дополнительная информация о поле..."
              value={field.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab;