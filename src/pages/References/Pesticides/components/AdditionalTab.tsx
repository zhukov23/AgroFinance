// src/pages/References/Pesticides/components/AdditionalTab.tsx

import React, { useState } from 'react';
import { Form, Row, Col, Label, Input, Button } from 'reactstrap';
import { PesticideData } from '../hooks/usePesticideEdit';
import { pesticideFormConfig } from '../config/editConfig';

interface AdditionalTabProps {
  pesticide: PesticideData | null;
  updatePesticide: (updates: Partial<PesticideData>) => void;
  validationErrors: {[key: string]: string};
}

const AdditionalTab: React.FC<AdditionalTabProps> = ({ 
  pesticide, 
  updatePesticide, 
  validationErrors 
}) => {
  if (!pesticide) return null;

  const handleInputChange = (fieldName: keyof PesticideData, value: any) => {
    updatePesticide({ [fieldName]: value });
  };

  // Вспомогательные функции для работы с JSONB полями
  const getPhRange = () => {
    if (!pesticide.ph_range) return { min: '', max: '' };
    if (typeof pesticide.ph_range === 'string') {
      try {
        return JSON.parse(pesticide.ph_range);
      } catch {
        return { min: '', max: '' };
      }
    }
    return pesticide.ph_range;
  };

  const updatePhRangeField = (field: string, value: any) => {
    const currentPhRange = getPhRange();
    const updatedPhRange = {
      ...currentPhRange,
      [field]: value
    };
    handleInputChange('ph_range', updatedPhRange);
  };

  const getTemperatureRange = () => {
    if (!pesticide.temperature_range) return { min: '', max: '', unit: '°C' };
    if (typeof pesticide.temperature_range === 'string') {
      try {
        return JSON.parse(pesticide.temperature_range);
      } catch {
        return { min: '', max: '', unit: '°C' };
      }
    }
    return pesticide.temperature_range;
  };

  const updateTemperatureField = (field: string, value: any) => {
    const currentTemp = getTemperatureRange();
    const updatedTemp = {
      ...currentTemp,
      [field]: value
    };
    handleInputChange('temperature_range', updatedTemp);
  };

  const getCompatibilityInfo = () => {
    if (!pesticide.compatibility_info) return { compatible_with: [], incompatible_with: [] };
    if (typeof pesticide.compatibility_info === 'string') {
      try {
        return JSON.parse(pesticide.compatibility_info);
      } catch {
        return { compatible_with: [], incompatible_with: [] };
      }
    }
    return pesticide.compatibility_info;
  };

  const updateCompatibilityField = (field: string, value: any) => {
    const currentCompatibility = getCompatibilityInfo();
    const updatedCompatibility = {
      ...currentCompatibility,
      [field]: value
    };
    handleInputChange('compatibility_info', updatedCompatibility);
  };

  const getCertificates = () => {
    if (!pesticide.certificates) return [];
    if (typeof pesticide.certificates === 'string') {
      try {
        return JSON.parse(pesticide.certificates);
      } catch {
        return [];
      }
    }
    return pesticide.certificates;
  };

  const updateCertificates = (certificates: any[]) => {
    updatePesticide({ certificates: certificates });
  };

  const addCertificate = () => {
    const certs = getCertificates();
    const newCert = {
      type: '',
      number: '',
      valid_until: ''
    };
    updateCertificates([...certs, newCert]);
  };

  const updateCertificate = (index: number, field: string, value: any) => {
    const certs = getCertificates();
    certs[index] = { ...certs[index], [field]: value };
    updateCertificates(certs);
  };

  const removeCertificate = (index: number) => {
    const certs = getCertificates();
    certs.splice(index, 1);
    updateCertificates(certs);
  };

  const getDocuments = () => {
    if (!pesticide.documents) return {};
    if (typeof pesticide.documents === 'string') {
      try {
        return JSON.parse(pesticide.documents);
      } catch {
        return {};
      }
    }
    return pesticide.documents;
  };

  const updateDocumentField = (field: string, value: any) => {
    const currentDocs = getDocuments();
    const updatedDocs = {
      ...currentDocs,
      [field]: value
    };
    handleInputChange('documents', updatedDocs);
  };

  return (
    <Form>
      <Row className="g-3">
        {/* Регистрация и статус */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-shield-check-line me-2"></i>
              Регистрация
            </h6>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="registrationStatusSelect" className="form-label">Статус регистрации</Label>
            <select 
              className="form-select"
              id="registrationStatusSelect"
              value={pesticide.registration_status || 'active'}
              onChange={(e) => handleInputChange('registration_status', e.target.value)}
            >
              {pesticideFormConfig.registrationStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="registrationDateInput" className="form-label">Дата регистрации</Label>
            <Input 
              type="date" 
              className="form-control"
              id="registrationDateInput"
              value={pesticide.registration_date || ''}
              onChange={(e) => handleInputChange('registration_date', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="expiryDateInput" className="form-label">Срок действия до</Label>
            <Input 
              type="date" 
              className="form-control"
              id="expiryDateInput"
              value={pesticide.expiry_date || ''}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="registrationAuthorityInput" className="form-label">Орган регистрации</Label>
            <Input 
              type="text" 
              className="form-control"
              id="registrationAuthorityInput"
              placeholder="Россельхознадзор"
              list="registrationAuthoritiesList"
              value={pesticide.registration_authority || ''}
              onChange={(e) => handleInputChange('registration_authority', e.target.value)}
            />
            <datalist id="registrationAuthoritiesList">
              {pesticideFormConfig.registrationAuthorities.map(authority => (
                <option key={authority} value={authority} />
              ))}
            </datalist>
          </div>
        </Col>

        {/* Цена и упаковка */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-price-tag-3-line me-2"></i>
              Цена и упаковка
            </h6>
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="basePriceInput" className="form-label">Базовая цена</Label>
            <Input 
              type="number" 
              className="form-control"
              id="basePriceInput"
              placeholder="1500.00"
              step="0.01"
              min="0"
              value={pesticide.base_price || ''}
              onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="currencyCodeSelect" className="form-label">Валюта</Label>
            <select 
              className="form-select"
              id="currencyCodeSelect"
              value={pesticide.currency_code || 'RUB'}
              onChange={(e) => handleInputChange('currency_code', e.target.value)}
            >
              {pesticideFormConfig.currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="pricePerUnitSelect" className="form-label">За единицу</Label>
            <select 
              className="form-select"
              id="pricePerUnitSelect"
              value={pesticide.price_per_unit || 'л'}
              onChange={(e) => handleInputChange('price_per_unit', e.target.value)}
            >
              {pesticideFormConfig.priceUnits.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="packageSizeInput" className="form-label">Размер упаковки</Label>
            <Input 
              type="number" 
              className="form-control"
              id="packageSizeInput"
              placeholder="1.0"
              step="0.001"
              min="0"
              value={pesticide.package_size || ''}
              onChange={(e) => handleInputChange('package_size', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="packageUnitSelect" className="form-label">Единица упаковки</Label>
            <select 
              className="form-select"
              id="packageUnitSelect"
              value={pesticide.package_unit || 'л'}
              onChange={(e) => handleInputChange('package_unit', e.target.value)}
            >
              {pesticideFormConfig.packageUnits.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="shelfLifeInput" className="form-label">Срок годности (мес.)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="shelfLifeInput"
              placeholder="24"
              min="1"
              max="120"
              value={pesticide.shelf_life_months || ''}
              onChange={(e) => handleInputChange('shelf_life_months', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Условия хранения и использования */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-temp-cold-line me-2"></i>
              Условия хранения и использования
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="storageConditionsInput" className="form-label">Условия хранения</Label>
            <Input 
              type="textarea" 
              className="form-control"
              id="storageConditionsInput"
              rows={3}
              placeholder="Хранить в сухом, прохладном месте при температуре от +5°C до +25°C"
              value={pesticide.storage_conditions || ''}
              onChange={(e) => handleInputChange('storage_conditions', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="phMinInput" className="form-label">pH мин.</Label>
            <Input 
              type="number" 
              className="form-control"
              id="phMinInput"
              placeholder="6.0"
              step="0.1"
              min="0"
              max="14"
              value={getPhRange().min || ''}
              onChange={(e) => updatePhRangeField('min', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="phMaxInput" className="form-label">pH макс.</Label>
            <Input 
              type="number" 
              className="form-control"
              id="phMaxInput"
              placeholder="8.0"
              step="0.1"
              min="0"
              max="14"
              value={getPhRange().max || ''}
              onChange={(e) => updatePhRangeField('max', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="tempMinInput" className="form-label">Температура мин. (°C)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="tempMinInput"
              placeholder="5"
              value={getTemperatureRange().min || ''}
              onChange={(e) => updateTemperatureField('min', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="tempMaxInput" className="form-label">Температура макс. (°C)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="tempMaxInput"
              placeholder="25"
              value={getTemperatureRange().max || ''}
              onChange={(e) => updateTemperatureField('max', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="tempUnitInput" className="form-label">Единица температуры</Label>
            <Input 
              type="text" 
              className="form-control"
              id="tempUnitInput"
              value={getTemperatureRange().unit || '°C'}
              onChange={(e) => updateTemperatureField('unit', e.target.value)}
              readOnly
            />
          </div>
        </Col>

        {/* Совместимость */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-links-line me-2"></i>
              Совместимость
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="compatibleWithInput" className="form-label">Совместим с</Label>
            <Input 
              type="text" 
              className="form-control"
              id="compatibleWithInput"
              placeholder="медные препараты, органические инсектициды (через запятую)"
              value={Array.isArray(getCompatibilityInfo().compatible_with) 
                ? getCompatibilityInfo().compatible_with.join(', ') 
                : getCompatibilityInfo().compatible_with}
              onChange={(e) => {
                const compatible = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                updateCompatibilityField('compatible_with', compatible);
              }}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="incompatibleWithInput" className="form-label">Несовместим с</Label>
            <Input 
              type="text" 
              className="form-control"
              id="incompatibleWithInput"
              placeholder="щелочные препараты, масляные растворы (через запятую)"
              value={Array.isArray(getCompatibilityInfo().incompatible_with) 
                ? getCompatibilityInfo().incompatible_with.join(', ') 
                : getCompatibilityInfo().incompatible_with}
              onChange={(e) => {
                const incompatible = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
                updateCompatibilityField('incompatible_with', incompatible);
              }}
            />
          </div>
        </Col>

        {/* Безопасность */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-shield-user-line me-2"></i>
              Безопасность
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="safetyPrecautionsInput" className="form-label">Меры предосторожности</Label>
            <Input 
              type="textarea" 
              className="form-control"
              id="safetyPrecautionsInput"
              rows={3}
              placeholder="Использовать защитную одежду, перчатки, очки..."
              value={pesticide.safety_precautions || ''}
              onChange={(e) => handleInputChange('safety_precautions', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="antidoteInfoInput" className="form-label">Антидоты и первая помощь</Label>
            <Input 
              type="textarea" 
              className="form-control"
              id="antidoteInfoInput"
              rows={3}
              placeholder="При попадании на кожу промыть водой, при попадании внутрь..."
              value={pesticide.antidote_info || ''}
              onChange={(e) => handleInputChange('antidote_info', e.target.value)}
            />
          </div>
        </Col>

        {/* Сертификаты */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-award-line me-2"></i>
              Сертификаты
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            {getCertificates().map((cert: any, index: number) => (
              <div key={index} className="border rounded p-3 mb-3">
                <Row>
                  <Col lg={4}>
                    <Label className="form-label">Тип сертификата</Label>
                    <select 
                      className="form-select"
                      value={cert.type || ''}
                      onChange={(e) => updateCertificate(index, 'type', e.target.value)}
                    >
                      <option value="">Выберите тип</option>
                      {pesticideFormConfig.certificateTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col lg={4}>
                    <Label className="form-label">Номер сертификата</Label>
                    <Input 
                      type="text" 
                      className="form-control"
                      placeholder="GMP-1234"
                      value={cert.number || ''}
                      onChange={(e) => updateCertificate(index, 'number', e.target.value)}
                    />
                  </Col>
                  <Col lg={3}>
                    <Label className="form-label">Действует до</Label>
                    <Input 
                      type="date" 
                      className="form-control"
                      value={cert.valid_until || ''}
                      onChange={(e) => updateCertificate(index, 'valid_until', e.target.value)}
                    />
                  </Col>
                  <Col lg={1} className="d-flex align-items-end">
                    <Button 
                      color="danger" 
                      size="sm" 
                      outline
                      onClick={() => removeCertificate(index)}
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
              onClick={addCertificate}
            >
              <i className="ri-add-line me-1"></i>
              Добавить сертификат
            </Button>
          </div>
        </Col>

        {/* Документы */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-file-text-line me-2"></i>
              Документы
            </h6>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="safetySheetInput" className="form-label">Паспорт безопасности</Label>
            <Input 
              type="text" 
              className="form-control"
              id="safetySheetInput"
              placeholder="safety_sheet_123.pdf"
              value={getDocuments().safety_sheet || ''}
              onChange={(e) => updateDocumentField('safety_sheet', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="instructionInput" className="form-label">Инструкция по применению</Label>
            <Input 
              type="text" 
              className="form-control"
              id="instructionInput"
              placeholder="instruction_123.pdf"
              value={getDocuments().instruction || ''}
              onChange={(e) => updateDocumentField('instruction', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="certificateDocInput" className="form-label">Сертификат соответствия</Label>
            <Input 
              type="text" 
              className="form-control"
              id="certificateDocInput"
              placeholder="certificate_123.pdf"
              value={getDocuments().certificate || ''}
              onChange={(e) => updateDocumentField('certificate', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="registrationDocInput" className="form-label">Свидетельство о регистрации</Label>
            <Input 
              type="text" 
              className="form-control"
              id="registrationDocInput"
              placeholder="registration_123.pdf"
              value={getDocuments().registration || ''}
              onChange={(e) => updateDocumentField('registration', e.target.value)}
            />
          </div>
        </Col>

        {/* Примечания */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-sticky-note-line me-2"></i>
              Дополнительная информация
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="notesInput" className="form-label">Примечания</Label>
            <Input 
              type="textarea" 
              className="form-control"
              id="notesInput"
              rows={4}
              placeholder="Дополнительные примечания о препарате..."
              value={pesticide.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>

        {/* Служебная информация */}
        {(pesticide.created_at || pesticide.updated_at) && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-time-line me-2"></i>
                  Служебная информация
                </h6>
              </div>
            </Col>

            {pesticide.created_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Дата создания</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(pesticide.created_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}

            {pesticide.updated_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Последнее обновление</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(pesticide.updated_at).toLocaleString('ru-RU')}
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
