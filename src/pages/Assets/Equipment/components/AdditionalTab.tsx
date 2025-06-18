import React, { useState } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { EquipmentData } from '../hooks/useEquipmentEdit';
import { equipmentFormConfig } from '../config/editConfig';

interface AdditionalTabProps {
  equipment: EquipmentData | null;
  updateEquipment: (updates: Partial<EquipmentData>) => void;
  validationErrors: {[key: string]: string};
}

const AdditionalTab: React.FC<AdditionalTabProps> = ({ 
  equipment, 
  updateEquipment, 
  validationErrors 
}) => {
  // State для валидации
  const [validation, setValidation] = useState({
    specifications: null as boolean | null,
    attachments: null as boolean | null
  });

  if (!equipment) return null;

  const handleInputChange = (field: keyof EquipmentData, value: string | string[] | any | undefined) => {
    updateEquipment({ [field]: value });
  };

  const handleCertificationChange = (certValue: string) => {
    const currentCerts = Array.isArray(equipment.certifications) 
      ? equipment.certifications 
      : [];
    let newCerts: string[];
    
    if (currentCerts.includes(certValue)) {
      newCerts = currentCerts.filter(cert => cert !== certValue);
    } else {
      newCerts = [...currentCerts, certValue];
    }
    
    updateEquipment({ certifications: newCerts });
  };

  const handleSpecificationChange = (category: string, field: string, value: string) => {
    const currentSpecs = equipment.specifications || {};
    const categorySpecs = currentSpecs[category] || {};
    
    let processedValue: any = value;
    
    // Обработка разных типов значений
    if (field === 'gps_ready' || field === 'auto_steering') {
      processedValue = value === 'true';
    } else if (field === 'pump_capacity' || field === 'working_pressure' || field === 'gears_count') {
      processedValue = parseFloat(value) || undefined;
    }
    
    updateEquipment({ 
      specifications: {
        ...currentSpecs,
        [category]: {
          ...categorySpecs,
          [field]: processedValue
        }
      }
    });
  };

  const handleAttachmentChange = (category: string, value: string) => {
    const currentAttachments = equipment.attachments || {};
    const categoryItems = currentAttachments[category] || [];
    
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    
    updateEquipment({ 
      attachments: {
        ...currentAttachments,
        [category]: items
      }
    });
  };

  return (
    <Form>
      <Row className="g-2">
        {/* Сертификации */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-award-line me-2"></i>
              Сертификации и стандарты
            </h6>
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">Сертификации</Label>
            <div className="d-flex flex-wrap gap-2">
              {equipmentFormConfig.certifications.map(cert => (
                <div key={cert.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`cert_${cert.value}`}
                    checked={Array.isArray(equipment.certifications) 
                      ? equipment.certifications.includes(cert.value) 
                      : false}
                    onChange={() => handleCertificationChange(cert.value)}
                  />
                  <Label className="form-check-label" htmlFor={`cert_${cert.value}`}>
                    {cert.label}
                  </Label>
                </div>
              ))}
            </div>
            {Array.isArray(equipment.certifications) && equipment.certifications.length > 0 && (
              <div className="mt-2">
                {equipment.certifications.map(certValue => {
                  const certConfig = equipmentFormConfig.certifications.find(c => c.value === certValue);
                  return certConfig ? (
                    <span key={certValue} className="badge bg-success me-1">
                      ✓ {certConfig.label}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </Col>

        {/* Технические спецификации */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-settings-2-line me-2"></i>
              Технические спецификации
            </h6>
          </div>
        </Col>

        {/* Гидравлическая система */}
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label fw-bold">Гидравлическая система</Label>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="pumpCapacityInput" className="form-label">Производительность насоса (л/мин)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="pumpCapacityInput"
              placeholder="120"
              step="0.01"
              min="0"
              value={equipment.specifications?.hydraulic_system?.pump_capacity || ''}
              onChange={(e) => handleSpecificationChange('hydraulic_system', 'pump_capacity', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="workingPressureInput" className="form-label">Рабочее давление (бар)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="workingPressureInput"
              placeholder="200"
              min="0"
              value={equipment.specifications?.hydraulic_system?.working_pressure || ''}
              onChange={(e) => handleSpecificationChange('hydraulic_system', 'working_pressure', e.target.value)}
            />
          </div>
        </Col>

        {/* Электроника */}
        <Col lg={12}>
          <div className="mb-3 mt-3">
            <Label className="form-label fw-bold">Электроника и управление</Label>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="gpsReadySelect" className="form-label">GPS готовность</Label>
            <select 
              className="form-select" 
              id="gpsReadySelect"
              value={equipment.specifications?.electronics?.gps_ready?.toString() || ''}
              onChange={(e) => handleSpecificationChange('electronics', 'gps_ready', e.target.value)}
            >
              <option value="">Не указано</option>
              <option value="true">Да</option>
              <option value="false">Нет</option>
            </select>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="displayTypeSelect" className="form-label">Тип дисплея</Label>
            <select 
              className="form-select" 
              id="displayTypeSelect"
              value={equipment.specifications?.electronics?.display_type || ''}
              onChange={(e) => handleSpecificationChange('electronics', 'display_type', e.target.value)}
            >
              <option value="">Не указано</option>
              <option value="LCD">LCD</option>
              <option value="LED">LED</option>
              <option value="OLED">OLED</option>
            </select>
          </div>
        </Col>

        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="autoSteeringSelect" className="form-label">Автоуправление</Label>
            <select 
              className="form-select" 
              id="autoSteeringSelect"
              value={equipment.specifications?.electronics?.auto_steering?.toString() || ''}
              onChange={(e) => handleSpecificationChange('electronics', 'auto_steering', e.target.value)}
            >
              <option value="">Не указано</option>
              <option value="true">Да</option>
              <option value="false">Нет</option>
            </select>
          </div>
        </Col>

        {/* Трансмиссия */}
        <Col lg={12}>
          <div className="mb-3 mt-3">
            <Label className="form-label fw-bold">Трансмиссия</Label>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="transmissionTypeSelect" className="form-label">Тип трансмиссии</Label>
            <select 
              className="form-select" 
              id="transmissionTypeSelect"
              value={equipment.specifications?.transmission?.type || ''}
              onChange={(e) => handleSpecificationChange('transmission', 'type', e.target.value)}
            >
              <option value="">Не указано</option>
              <option value="механическая">Механическая</option>
              <option value="гидростатическая">Гидростатическая</option>
              <option value="вариаторная">Вариаторная</option>
            </select>
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="gearsCountInput" className="form-label">Количество передач</Label>
            <Input 
              type="number" 
              className="form-control"
              id="gearsCountInput"
              placeholder="16"
              min="1"
              value={equipment.specifications?.transmission?.gears_count || ''}
              onChange={(e) => handleSpecificationChange('transmission', 'gears_count', e.target.value)}
            />
          </div>
        </Col>

        {/* Навесное оборудование */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-tools-fill me-2"></i>
              Навесное оборудование
            </h6>
          </div>
        </Col>

        {/* Входящее в комплект */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="includedAttachmentsInput" className="form-label">Входящее в комплект</Label>
            <Input 
              type="text" 
              className="form-control"
              id="includedAttachmentsInput"
              placeholder="основная рама, гидроцилиндры, рабочие органы (через запятую)"
              value={Array.isArray(equipment.attachments?.included) 
                ? equipment.attachments.included.join(', ') 
                : ''}
              onChange={(e) => handleAttachmentChange('included', e.target.value)}
            />
            <div className="form-text">Перечислите компоненты через запятую</div>
          </div>
        </Col>

        {/* Опциональное оборудование */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="optionalAttachmentsInput" className="form-label">Опциональное оборудование</Label>
            <Input 
              type="text" 
              className="form-control"
              id="optionalAttachmentsInput"
              placeholder="GPS-навигация, система автовождения, дополнительное освещение (через запятую)"
              value={Array.isArray(equipment.attachments?.optional) 
                ? equipment.attachments.optional.join(', ') 
                : ''}
              onChange={(e) => handleAttachmentChange('optional', e.target.value)}
            />
            <div className="form-text">Перечислите опции через запятую</div>
          </div>
        </Col>

        {/* Совместимое оборудование */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="compatibleAttachmentsInput" className="form-label">Совместимое оборудование</Label>
            <Input 
              type="text" 
              className="form-control"
              id="compatibleAttachmentsInput"
              placeholder="фронтальный погрузчик, культиватор, борона (через запятую)"
              value={Array.isArray(equipment.attachments?.compatible) 
                ? equipment.attachments.compatible.join(', ') 
                : ''}
              onChange={(e) => handleAttachmentChange('compatible', e.target.value)}
            />
            <div className="form-text">Перечислите совместимое оборудование через запятую</div>
          </div>
        </Col>

        {/* Служебная информация */}
        {(equipment.created_at || equipment.updated_at) && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-time-line me-2"></i>
                  Служебная информация
                </h6>
              </div>
            </Col>

            {equipment.created_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Дата создания</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(equipment.created_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}

            {equipment.updated_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Последнее обновление</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(equipment.updated_at).toLocaleString('ru-RU')}
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
