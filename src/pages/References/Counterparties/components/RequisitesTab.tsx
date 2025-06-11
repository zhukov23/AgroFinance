import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { CounterpartyData, BankAccountData } from '../hooks/useCounterpartyEdit';
import { counterpartyFormConfig } from '../config/editConfig';
import BankAccountItem from './BankAccountItem';

interface RequisitesTabProps {
  counterparty: CounterpartyData | null;
  primaryBank: BankAccountData | null;
  additionalBanks: BankAccountData[];
  updateCounterparty: (updates: Partial<CounterpartyData>) => void;
  addBankAccount: (bankAccount: Omit<BankAccountData, 'id' | 'organization_id'>) => void;
  updateBankAccount: (id: number, updates: Partial<BankAccountData>) => void;
  removeBankAccount: (id: number) => void;
  setPrimaryBank: (id: number) => void;
}

const RequisitesTab: React.FC<RequisitesTabProps> = ({
  counterparty,
  primaryBank,
  additionalBanks,
  updateCounterparty,
  addBankAccount,
  updateBankAccount,
  removeBankAccount,
  setPrimaryBank
}) => {
  if (!counterparty) return null;

  const handleInputChange = (field: keyof CounterpartyData, value: string | number) => {
    console.log('🔄 RequisitesTab handleInputChange:', { field, value, oldValue: counterparty[field] });
    updateCounterparty({ [field]: value });
  };
    // Добавить после handleAddBank
    const handleTestVatRate = () => {
    console.log('🧪 Тестируем изменение ставки НДС на 20');
    console.log('До изменения:', counterparty.vat_rate);
    updateCounterparty({ vat_rate: '20' });
    console.log('После updateCounterparty вызова');
    };
  const handleAddBank = () => {
    const newBank: Omit<BankAccountData, 'id' | 'organization_id'> = {
      bank_id: 0, // Временно, пока не реализовано связывание с справочником банков
      account_number: '',
      currency: 'RUB',
      is_primary: false,
      is_active: true,
      purpose: 'main',
      bank_name: '',
      bank_bik: '',
      bank_correspondent_account: '',
      bank_address: '',
      bank_swift: ''
    };
    addBankAccount(newBank);
  };

  const allBanks = [primaryBank, ...additionalBanks].filter(Boolean) as BankAccountData[];

  // Логирование текущих значений селектов
  console.log('🔍 RequisitesTab render values:', {
    vat_status: counterparty.vat_status,
    vat_rate: counterparty.vat_rate,
    tax_system: counterparty.tax_system,
    vatStatusOptions: counterpartyFormConfig.vatStatuses,
    vatRateOptions: counterpartyFormConfig.vatRates,
    taxSystemOptions: counterpartyFormConfig.taxSystems
  });

  return (
    <Form>
      <Row>
        {/* Банковские реквизиты */}
        <Col lg={12}>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-primary border-bottom pb-2 mb-3">
                <i className="ri-bank-line me-2"></i>
                Банковские реквизиты
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-soft-primary"
                onClick={handleAddBank}
              >
                <i className="ri-add-line me-1"></i>
                Добавить банк
              </button>
            </div>
          </div>
        </Col>

{/* Основной банк */}
{primaryBank && (
  <Col lg={12} key={`primary_${primaryBank.id}`}>
    <BankAccountItem
      account={primaryBank}
      index={0}
      isPrimary={true}
      onUpdate={(updates) => updateBankAccount(primaryBank.id!, updates)}
      onRemove={() => removeBankAccount(primaryBank.id!)}
      onSetPrimary={() => {}} // Уже основной
      canRemove={allBanks.length > 1}
    />
  </Col>
)}

{/* Дополнительные банки */}
{additionalBanks.map((bank, index) => (
  <Col lg={12} key={`additional_${bank.id}_${index}`}>
    <BankAccountItem
      account={bank}
      index={index + 1}
      isPrimary={false}
      onUpdate={(updates) => updateBankAccount(bank.id!, updates)}
      onRemove={() => removeBankAccount(bank.id!)}
      onSetPrimary={() => setPrimaryBank(bank.id!)}
      canRemove={true}
    />
  </Col>
))}
        {/* Сообщение если нет банков */}
        {allBanks.length === 0 && (
          <Col lg={12}>
            <div className="text-center p-4 bg-light border rounded">
              <i className="ri-bank-line text-muted" style={{ fontSize: '2rem' }}></i>
              <p className="text-muted mt-2 mb-0">
                Банковские реквизиты не добавлены
              </p>
              <button
                type="button"
                className="btn btn-sm btn-primary mt-2"
                onClick={handleAddBank}
              >
                <i className="ri-add-line me-1"></i>
                Добавить первый банк
              </button>
            </div>
          </Col>
        )}

        {/* Налоговая информация */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-file-list-3-line me-2"></i>
              Налоговая информация
            </h6>
          </div>
        </Col>

        {/* НДС */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="vatStatusSelect" className="form-label">Статус НДС</Label>
            <select 
              className="form-select" 
              id="vatStatusSelect"
              value={counterparty.vat_status || ''}
              onChange={(e) => {
                console.log('🎯 VAT Status onChange:', { 
                  newValue: e.target.value, 
                  oldValue: counterparty.vat_status,
                  allOptions: counterpartyFormConfig.vatStatuses.map(s => s.value)
                });
                handleInputChange('vat_status', e.target.value);
              }}
            >
              <option value="">Выберите статус НДС</option>
              {counterpartyFormConfig.vatStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Ставка НДС */}
        <Col lg={6}>
  <div className="mb-3">
    <Label htmlFor="vatRateSelect" className="form-label">
      Ставка НДС
      <button 
        type="button" 
        className="btn btn-sm btn-outline-secondary ms-2"
        onClick={handleTestVatRate}
      >
        🧪 Тест: установить 20%
      </button>
    </Label>
            <select 
              className="form-select" 
              id="vatRateSelect"
              value={counterparty.vat_rate || ''}
              onChange={(e) => {
                console.log('🎯 VAT Rate onChange:', { 
                  newValue: e.target.value, 
                  oldValue: counterparty.vat_rate,
                  allOptions: counterpartyFormConfig.vatRates.map(r => r.value)
                });
                handleInputChange('vat_rate', e.target.value);
              }}
            >
              <option value="">Выберите ставку</option>
              {counterpartyFormConfig.vatRates.map(rate => (
                <option key={rate.value} value={rate.value}>
                  {rate.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Код ОКВЭД */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="okvedInput" className="form-label">Основной код ОКВЭД</Label>
            <Input 
              type="text" 
              className="form-control"
              id="okvedInput"
              placeholder="01.11.1"
              value={counterparty.okved_code || ''}
              onChange={(e) => handleInputChange('okved_code', e.target.value)}
            />
            <div className="form-text">Основной вид деятельности</div>
          </div>
        </Col>

        {/* Система налогообложения */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="taxSystemSelect" className="form-label">Система налогообложения</Label>
            <select 
              className="form-select" 
              id="taxSystemSelect"
              value={counterparty.tax_system || ''}
              onChange={(e) => {
                console.log('🎯 Tax System onChange:', { 
                  newValue: e.target.value, 
                  oldValue: counterparty.tax_system,
                  allOptions: counterpartyFormConfig.taxSystems.map(s => s.value)
                });
                handleInputChange('tax_system', e.target.value);
              }}
            >
              <option value="">Выберите систему</option>
              {counterpartyFormConfig.taxSystems.map(system => (
                <option key={system.value} value={system.value}>
                  {system.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Информация о регистрации */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-building-line me-2"></i>
              Регистрационные данные
            </h6>
          </div>
        </Col>

        {/* Дата регистрации */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="registrationDateInput" className="form-label">Дата регистрации</Label>
            <Input 
              type="date" 
              className="form-control"
              id="registrationDateInput"
              value={counterparty.registration_date || ''}
              onChange={(e) => handleInputChange('registration_date', e.target.value)}
            />
          </div>
        </Col>

        {/* Орган регистрации */}
        <Col lg={8}>
          <div className="mb-3">
            <Label htmlFor="registrationAuthorityInput" className="form-label">Орган регистрации</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="registrationAuthorityInput"
              placeholder="Межрайонная ИФНС России №..."
              value={counterparty.registration_authority || ''}
              onChange={(e) => handleInputChange('registration_authority', e.target.value)}
            />
          </div>
        </Col>

        {/* Уставный капитал */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="charterCapitalInput" className="form-label">Уставный капитал</Label>
            <div className="input-group">
              <Input 
                type="number" 
                className="form-control"
                id="charterCapitalInput"
                placeholder="0"
                min="0"
                step="1000"
                value={counterparty.charter_capital || ''}
                onChange={(e) => handleInputChange('charter_capital', parseFloat(e.target.value) || 0)}
              />
              <span className="input-group-text">₽</span>
            </div>
          </div>
        </Col>

        {/* Количество участников */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="participantsCountInput" className="form-label">Количество участников</Label>
            <Input 
              type="number" 
              className="form-control"
              id="participantsCountInput"
              placeholder="1"
              min="1"
              value={counterparty.participants_count || ''}
              onChange={(e) => handleInputChange('participants_count', parseInt(e.target.value) || 1)}
            />
          </div>
        </Col>

        {/* Примечания к реквизитам */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="bankNotesTextarea" className="form-label">Дополнительная информация по реквизитам</Label>
            <textarea 
              className="form-control"
              id="bankNotesTextarea"
              rows={3} 
              placeholder="Особенности работы с банковскими реквизитами, ограничения и т.д."
              value={counterparty.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default RequisitesTab;