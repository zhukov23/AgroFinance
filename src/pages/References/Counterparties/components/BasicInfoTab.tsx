import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { CounterpartyData } from '../hooks/useCounterpartyEdit';
import { counterpartyFormConfig } from '../config/editConfig';

interface BasicInfoTabProps {
  counterparty: CounterpartyData | null;
  updateCounterparty: (updates: Partial<CounterpartyData>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ counterparty, updateCounterparty }) => {
  if (!counterparty) return null;

const handleInputChange = (field: keyof CounterpartyData, value: string | string[] | boolean | number) => {
  updateCounterparty({ [field]: value });
};

  const handleTypeChange = (value: string) => {
    // Обработка множественного выбора типов контрагента
    const currentTypes = counterparty.counterparty_type || [];
    let newTypes: string[];
    
    if (currentTypes.includes(value)) {
      newTypes = currentTypes.filter(type => type !== value);
    } else {
      newTypes = [...currentTypes, value];
    }
    
    updateCounterparty({ counterparty_type: newTypes });
  };

  return (
    <Form>
      <Row>
        {/* Полное наименование */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="fullNameInput" className="form-label">
              Полное наименование <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id="fullNameInput"
              placeholder="Введите полное наименование организации" 
              value={counterparty.full_name || ''}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
            />
          </div>
        </Col>

        {/* Краткое наименование */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="shortNameInput" className="form-label">Краткое наименование</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="shortNameInput"
              placeholder="ООО, ИП, АО и т.д." 
              value={counterparty.short_name || ''}
              onChange={(e) => handleInputChange('short_name', e.target.value)}
            />
          </div>
        </Col>

        {/* Тип контрагента */}
        <Col lg={6}>
          <div className="mb-3">
            <Label className="form-label">
              Тип контрагента <span className="text-danger">*</span>
            </Label>
            <div className="d-flex flex-wrap gap-2">
              {counterpartyFormConfig.counterpartyTypes.map(type => (
                <div key={type.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`type_${type.value}`}
                    checked={counterparty.counterparty_type?.includes(type.value) || false}
                    onChange={() => handleTypeChange(type.value)}
                  />
                  <Label className="form-check-label" htmlFor={`type_${type.value}`}>
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
            {counterparty.counterparty_type && counterparty.counterparty_type.length > 0 && (
              <div className="mt-2">
                {counterparty.counterparty_type.map(typeValue => {
                  const typeConfig = counterpartyFormConfig.counterpartyTypes.find(t => t.value === typeValue);
                  return typeConfig ? (
                    <span key={typeValue} className={`badge bg-${typeConfig.color} me-1`}>
                      {typeConfig.label}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </Col>

        {/* ИНН */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="innInput" className="form-label">ИНН</Label>
            <Input 
              type="text" 
              className="form-control"
              id="innInput"
              placeholder="10 или 12 цифр"
              maxLength={12}
              value={counterparty.inn || ''}
              onChange={(e) => handleInputChange('inn', e.target.value.replace(/\D/g, ''))}
            />
            <div className="form-text">Для юр. лиц - 10 цифр, для ИП - 12 цифр</div>
          </div>
        </Col>

        {/* КПП */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="kppInput" className="form-label">КПП</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="kppInput"
              placeholder="9 цифр"
              maxLength={9}
              value={counterparty.kpp || ''}
              onChange={(e) => handleInputChange('kpp', e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </Col>

        {/* ОГРН */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="ogrnInput" className="form-label">ОГРН</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="ogrnInput"
              placeholder="13 или 15 цифр"
              maxLength={15}
              value={counterparty.ogrn || ''}
              onChange={(e) => handleInputChange('ogrn', e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </Col>

        {/* Контактное лицо */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="contactPersonInput" className="form-label">Контактное лицо</Label>
            <Input 
              type="text" 
              className="form-control"
              id="contactPersonInput"
              placeholder="ФИО контактного лица"
              value={counterparty.contact_person || ''}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
            />
          </div>
        </Col>

        {/* Телефон */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="phoneInput" className="form-label">Телефон</Label>
            <Input 
              type="tel" 
              className="form-control"
              id="phoneInput"
              placeholder="+7 (999) 123-45-67"
              value={counterparty.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        </Col>

        {/* Email */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="emailInput" className="form-label">Email</Label>
            <Input 
              type="email" 
              className="form-control" 
              id="emailInput"
              placeholder="info@company.ru"
              value={counterparty.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
        </Col>

        {/* Веб-сайт */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="websiteInput" className="form-label">Веб-сайт</Label>
            <Input 
              type="url" 
              className="form-control" 
              id="websiteInput"
              placeholder="https://company.ru" 
              value={counterparty.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>
        </Col>

        {/* Статус */}
        <Col lg={12}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={counterparty.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="isActiveSwitch">
                <span className={`badge ${counterparty.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                  {counterparty.is_active ? '✓ Активный' : '✗ Неактивный'}
                </span>
                контрагент
              </Label>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab;