import React from 'react';
import { Row, Col, Label, Input } from 'reactstrap';
import { BankAccountData } from '../hooks/useCounterpartyEdit';
import { counterpartyFormConfig } from '../config/editConfig';

interface BankAccountItemProps {
  account: BankAccountData;
  index: number;
  isPrimary: boolean;
  onUpdate: (updates: Partial<BankAccountData>) => void;
  onRemove: () => void;
  onSetPrimary: () => void;
  canRemove: boolean;
}

const BankAccountItem: React.FC<BankAccountItemProps> = ({
  account,
  index,
  isPrimary,
  onUpdate,
  onRemove,
  onSetPrimary,
  canRemove
}) => {
  const handleInputChange = (field: keyof BankAccountData, value: string | boolean) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className={`border rounded p-3 mb-3 ${isPrimary ? 'border-primary bg-light' : 'bg-light'}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0">
            {isPrimary ? '⭐ Основной банк' : `Банк #${index + 1}`}
          </h6>
          {!isPrimary && (
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={onSetPrimary}
              title="Сделать основным"
            >
              <i className="ri-star-line"></i>
            </button>
          )}
        </div>
        
        <div className="d-flex gap-1">
          {/* Статус активности */}
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id={`account_active_${account.id}`}
              checked={account.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
            />
            <Label className="form-check-label" htmlFor={`account_active_${account.id}`}>
              <span className={`badge ${account.is_active ? 'bg-success' : 'bg-secondary'}`}>
                {account.is_active ? 'Активный' : 'Неактивный'}
              </span>
            </Label>
          </div>
          
          {/* Кнопка удаления */}
          {canRemove && (
            <button
              type="button"
              className="btn btn-sm btn-soft-danger"
              onClick={onRemove}
              title="Удалить банковский счет"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          )}
        </div>
      </div>
      
      <Row>
        {/* Наименование банка */}
        <Col lg={8}>
          <div className="mb-3">
            <Label htmlFor={`bankName_${account.id}`} className="form-label">
              Наименование банка {isPrimary && <span className="text-danger">*</span>}
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id={`bankName_${account.id}`}
              placeholder="ПАО Сбербанк России" 
              value={account.bank_name || ''}
              onChange={(e) => handleInputChange('bank_name', e.target.value)}
            />
          </div>
        </Col>
        
        {/* БИК */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor={`bik_${account.id}`} className="form-label">БИК</Label>
            <Input 
              type="text" 
              className="form-control"
              id={`bik_${account.id}`}
              placeholder="044525225"
              maxLength={9}
              value={account.bank_bik || ''}
              onChange={(e) => handleInputChange('bank_bik', e.target.value.replace(/\D/g, ''))}
            />
            <div className="form-text">9 цифр</div>
          </div>
        </Col>
        
        {/* Корреспондентский счет */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor={`corrAccount_${account.id}`} className="form-label">Корреспондентский счет</Label>
            <Input 
              type="text" 
              className="form-control"
              id={`corrAccount_${account.id}`}
              placeholder="30101810400000000225"
              maxLength={20}
              value={account.bank_correspondent_account || ''}
              onChange={(e) => handleInputChange('bank_correspondent_account', e.target.value.replace(/\D/g, ''))}
            />
            <div className="form-text">20 цифр</div>
          </div>
        </Col>
        
        {/* Расчетный счет */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor={`accountNumber_${account.id}`} className="form-label">
              Расчетный счет <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control"
              id={`accountNumber_${account.id}`}
              placeholder="40702810338000123456"
              maxLength={20}
              value={account.account_number || ''}
              onChange={(e) => handleInputChange('account_number', e.target.value.replace(/\D/g, ''))}
            />
            <div className="form-text">20 цифр</div>
          </div>
        </Col>
        
        {/* Валюта */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor={`currency_${account.id}`} className="form-label">Валюта</Label>
            <select 
              className="form-select" 
              id={`currency_${account.id}`}
              value={account.currency || 'RUB'}
              onChange={(e) => handleInputChange('currency', e.target.value)}
            >
              {counterpartyFormConfig.currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </Col>
        
        {/* Назначение счета */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor={`purpose_${account.id}`} className="form-label">Назначение</Label>
            <select 
              className="form-select" 
              id={`purpose_${account.id}`}
              value={account.purpose || 'main'}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
            >
              {counterpartyFormConfig.accountPurposes.map(purpose => (
                <option key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </option>
              ))}
            </select>
          </div>
        </Col>
        
        {/* Дата открытия */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor={`openingDate_${account.id}`} className="form-label">Дата открытия</Label>
            <Input 
              type="date" 
              className="form-control"
              id={`openingDate_${account.id}`}
              value={account.opening_date || ''}
              onChange={(e) => handleInputChange('opening_date', e.target.value)}
            />
          </div>
        </Col>
        
        {/* Адрес банка */}
        <Col lg={8}>
          <div className="mb-3">
            <Label htmlFor={`bankAddress_${account.id}`} className="form-label">Адрес банка</Label>
            <Input 
              type="text" 
              className="form-control" 
              id={`bankAddress_${account.id}`}
              placeholder="г. Москва, ул. Вавилова, д. 19"
              value={account.bank_address || ''}
              onChange={(e) => handleInputChange('bank_address', e.target.value)}
            />
          </div>
        </Col>
        
        {/* SWIFT */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor={`swift_${account.id}`} className="form-label">SWIFT код</Label>
            <Input 
              type="text" 
              className="form-control"
              id={`swift_${account.id}`}
              placeholder="SABRRUMM"
              maxLength={11}
              value={account.bank_swift || ''}
              onChange={(e) => handleInputChange('bank_swift', e.target.value.toUpperCase())}
            />
            <div className="form-text">Для международных переводов</div>
          </div>
        </Col>
        
        {/* Примечания */}
        {!isPrimary && (
          <Col lg={12}>
            <div className="mb-3">
              <Label htmlFor={`notes_${account.id}`} className="form-label">Примечания</Label>
              <textarea 
                className="form-control"
                id={`notes_${account.id}`}
                rows={2} 
                placeholder="Дополнительная информация о банковском счете..."
                value={account.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default BankAccountItem;