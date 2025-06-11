import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { BankData } from '../hooks/useBankEdit';

interface BasicInfoTabProps {
  bank: BankData | null;
  updateBank: (updates: Partial<BankData>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ bank, updateBank }) => {
  if (!bank) return null;

  const handleInputChange = (field: keyof BankData, value: string | boolean) => {
    updateBank({ [field]: value });
  };

  return (
    <Form>
      <Row>
        {/* Полное наименование */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="nameInput" className="form-label">
              Наименование банка <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id="nameInput"
              placeholder="Введите полное наименование банка" 
              value={bank.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
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
              placeholder="Краткое название банка" 
              value={bank.short_name || ''}
              onChange={(e) => handleInputChange('short_name', e.target.value)}
            />
          </div>
        </Col>

        {/* БИК */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="bikInput" className="form-label">
              БИК <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control"
              id="bikInput"
              placeholder="9 цифр"
              maxLength={9}
              value={bank.bik || ''}
              onChange={(e) => handleInputChange('bik', e.target.value.replace(/\D/g, ''))}
            />
            <div className="form-text">Банковский идентификационный код (9 цифр)</div>
          </div>
        </Col>

        {/* Регион */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="regionInput" className="form-label">Регион</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="regionInput"
              placeholder="Московская область, г. Москва"
              value={bank.region || ''}
              onChange={(e) => handleInputChange('region', e.target.value)}
            />
          </div>
        </Col>

        {/* Статус активности */}
        <Col lg={6}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={bank.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="isActiveSwitch">
                <span className={`badge ${bank.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                  {bank.is_active ? '✓ Активный' : '✗ Неактивный'}
                </span>
                банк
              </Label>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab; 
