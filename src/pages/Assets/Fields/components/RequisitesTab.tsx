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

interface RequisitesTabProps {
  field: FieldData | null;
  updateField: (updates: Partial<FieldData>) => void;
  validationErrors: {[key: string]: string};
}

const RequisitesTab: React.FC<RequisitesTabProps> = ({ 
  field, 
  updateField, 
  validationErrors 
}) => {
  if (!field) return null;

  const handleInputChange = (fieldName: keyof FieldData, value: any) => {
    updateField({ [fieldName]: value });
  };

  // Вспомогательные функции для работы с JSONB полями
  const getLocationValue = (key: string) => {
    if (!field.location) return '';
    if (typeof field.location === 'string') {
      try {
        const parsed = JSON.parse(field.location);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.location[key] || '';
  };

  const updateLocationField = (key: string, value: any) => {
    let currentLocation = {};
    
    if (field.location) {
      if (typeof field.location === 'string') {
        try {
          currentLocation = JSON.parse(field.location);
        } catch {
          currentLocation = {};
        }
      } else {
        currentLocation = { ...field.location };
      }
    }
    
    const updatedLocation = {
      ...currentLocation,
      [key]: value
    };
    
    handleInputChange('location', updatedLocation);
  };

  const getSoilAnalysisValue = (key: string) => {
    if (!field.soil_analysis) return '';
    if (typeof field.soil_analysis === 'string') {
      try {
        const parsed = JSON.parse(field.soil_analysis);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.soil_analysis[key] || '';
  };

  const updateSoilAnalysisField = (key: string, value: any) => {
    let currentAnalysis = {};
    
    if (field.soil_analysis) {
      if (typeof field.soil_analysis === 'string') {
        try {
          currentAnalysis = JSON.parse(field.soil_analysis);
        } catch {
          currentAnalysis = {};
        }
      } else {
        currentAnalysis = { ...field.soil_analysis };
      }
    }
    
    const updatedAnalysis = {
      ...currentAnalysis,
      [key]: value
    };
    
    handleInputChange('soil_analysis', updatedAnalysis);
  };

  const getOwnershipValue = (key: string) => {
    if (!field.ownership_documents) return '';
    if (typeof field.ownership_documents === 'string') {
      try {
        const parsed = JSON.parse(field.ownership_documents);
        return parsed[key] || '';
      } catch {
        return '';
      }
    }
    return field.ownership_documents[key] || '';
  };

  const updateOwnershipField = (key: string, value: any) => {
    let currentDocs = {};
    
    if (field.ownership_documents) {
      if (typeof field.ownership_documents === 'string') {
        try {
          currentDocs = JSON.parse(field.ownership_documents);
        } catch {
          currentDocs = {};
        }
      } else {
        currentDocs = { ...field.ownership_documents };
      }
    }
    
    const updatedDocs = {
      ...currentDocs,
      [key]: value
    };
    
    handleInputChange('ownership_documents', updatedDocs);
  };

  return (
    <Form>
      <Row className="g-3">
        {/* Местоположение */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-map-pin-line me-2"></i>
              Местоположение
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="locationAddressInput" className="form-label">Адрес</Label>
            <Input 
              type="text" 
              className="form-control"
              id="locationAddressInput"
              placeholder="Московская область, Истринский район"
              value={getLocationValue('address')}
              onChange={(e) => updateLocationField('address', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="locationLatInput" className="form-label">Широта</Label>
            <Input 
              type="number" 
              className="form-control"
              id="locationLatInput"
              placeholder="55.7558"
              step="0.000001"
              value={getLocationValue('lat')}
              onChange={(e) => updateLocationField('lat', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="locationLngInput" className="form-label">Долгота</Label>
            <Input 
              type="number" 
              className="form-control"
              id="locationLngInput"
              placeholder="37.6176"
              step="0.000001"
              value={getLocationValue('lng')}
              onChange={(e) => updateLocationField('lng', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Анализ почвы */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-test-tube-line me-2"></i>
              Анализ почвы
            </h6>
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="soilPhInput" className="form-label">pH уровень</Label>
            <Input 
              type="number" 
              className="form-control"
              id="soilPhInput"
              placeholder="6.5"
              step="0.01"
              min="0"
              max="14"
              value={getSoilAnalysisValue('ph')}
              onChange={(e) => updateSoilAnalysisField('ph', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="soilHumusInput" className="form-label">Гумус (%)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="soilHumusInput"
              placeholder="3.5"
              step="0.01"
              min="0"
              value={getSoilAnalysisValue('humus')}
              onChange={(e) => updateSoilAnalysisField('humus', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="soilNitrogenInput" className="form-label">Азот (мг/кг)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="soilNitrogenInput"
              placeholder="120"
              min="0"
              value={getSoilAnalysisValue('N')}
              onChange={(e) => updateSoilAnalysisField('N', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="soilPhosphorusInput" className="form-label">Фосфор (мг/кг)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="soilPhosphorusInput"
              placeholder="80"
              min="0"
              value={getSoilAnalysisValue('P')}
              onChange={(e) => updateSoilAnalysisField('P', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="soilPotassiumInput" className="form-label">Калий (мг/кг)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="soilPotassiumInput"
              placeholder="150"
              min="0"
              value={getSoilAnalysisValue('K')}
              onChange={(e) => updateSoilAnalysisField('K', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="soilAnalysisDateInput" className="form-label">Дата анализа</Label>
            <Input 
              type="date" 
              className="form-control"
              id="soilAnalysisDateInput"
              value={getSoilAnalysisValue('analysis_date')}
              onChange={(e) => updateSoilAnalysisField('analysis_date', e.target.value)}
            />
          </div>
        </Col>

        {/* Правоустанавливающие документы */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-file-text-line me-2"></i>
              Правоустанавливающие документы
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="ownershipTypeSelect" className="form-label">Тип владения</Label>
            <select 
              className="form-select"
              id="ownershipTypeSelect"
              value={getOwnershipValue('ownership_type')}
              onChange={(e) => updateOwnershipField('ownership_type', e.target.value)}
            >
              <option value="">Выберите тип</option>
              <option value="собственность">Собственность</option>
              <option value="аренда">Аренда</option>
              <option value="субаренда">Субаренда</option>
            </select>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="documentNumberInput" className="form-label">Номер документа</Label>
            <Input 
              type="text" 
              className="form-control"
              id="documentNumberInput"
              placeholder="Номер свидетельства/договора"
              value={getOwnershipValue('document_number')}
              onChange={(e) => updateOwnershipField('document_number', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="registrationDateInput" className="form-label">Дата регистрации</Label>
            <Input 
              type="date" 
              className="form-control"
              id="registrationDateInput"
              value={getOwnershipValue('registration_date')}
              onChange={(e) => updateOwnershipField('registration_date', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="validUntilInput" className="form-label">Действует до</Label>
            <Input 
              type="date" 
              className="form-control"
              id="validUntilInput"
              value={getOwnershipValue('valid_until')}
              onChange={(e) => updateOwnershipField('valid_until', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default RequisitesTab;