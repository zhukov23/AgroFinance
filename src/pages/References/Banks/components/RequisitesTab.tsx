 import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { BankData } from '../hooks/useBankEdit';

interface RequisitesTabProps {
  bank: BankData | null;
  updateBank: (updates: Partial<BankData>) => void;
}

const RequisitesTab: React.FC<RequisitesTabProps> = ({ bank, updateBank }) => {
  if (!bank) return null;

  const handleInputChange = (field: keyof BankData, value: string) => {
    updateBank({ [field]: value });
  };

  return (
    <Form>
      <Row>
        {/* Банковские реквизиты */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-bank-line me-2"></i>
              Банковские реквизиты
            </h6>
          </div>
        </Col>

        {/* Корреспондентский счет */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="correspondentAccountInput" className="form-label">Корреспондентский счет</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="correspondentAccountInput"
              placeholder="20 цифр"
              maxLength={20}
              value={bank.correspondent_account || ''}
              onChange={(e) => handleInputChange('correspondent_account', e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </Col>

        {/* SWIFT код */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="swiftCodeInput" className="form-label">SWIFT код</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="swiftCodeInput"
              placeholder="SABRRUMM"
              maxLength={11}
              value={bank.swift_code || ''}
              onChange={(e) => handleInputChange('swift_code', e.target.value.toUpperCase())}
            />
            <div className="form-text">Для международных переводов (8-11 символов)</div>
          </div>
        </Col>

        {/* Регистрационная информация */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-file-list-3-line me-2"></i>
              Регистрационная информация
            </h6>
          </div>
        </Col>

        {/* Регистрационный номер */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="registrationNumberInput" className="form-label">Регистрационный номер</Label>
            <Input 
              type="text" 
              className="form-control"
              id="registrationNumberInput"
              placeholder="Регистрационный номер в ЦБ РФ"
              value={bank.registration_number || ''}
              onChange={(e) => handleInputChange('registration_number', e.target.value)}
            />
          </div>
        </Col>

        {/* Номер лицензии */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="licenseNumberInput" className="form-label">Номер лицензии</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="licenseNumberInput"
              placeholder="Номер лицензии банка"
              value={bank.license_number || ''}
              onChange={(e) => handleInputChange('license_number', e.target.value)}
            />
          </div>
        </Col>

        {/* Дата лицензии */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="licenseDateInput" className="form-label">Дата выдачи лицензии</Label>
            <Input 
              type="date" 
              className="form-control" 
              id="licenseDateInput"
              value={bank.license_date || ''}
              onChange={(e) => handleInputChange('license_date', e.target.value)}
            />
          </div>
        </Col>

        {/* Адрес */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="addressInput" className="form-label">Юридический адрес</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="addressInput"
              placeholder="г. Москва, ул. Примерная, д. 1"
              value={bank.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </Col>

        {/* Служебная информация */}
        {(bank.created_at || bank.updated_at) && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-time-line me-2"></i>
                  Служебная информация
                </h6>
              </div>
            </Col>

            {bank.created_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Дата создания</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(bank.created_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}

            {bank.updated_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Последнее обновление</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(bank.updated_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}
          </>
        )}

        {/* Примечания к реквизитам */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="bankNotesTextarea" className="form-label">Дополнительная информация по реквизитам</Label>
            <textarea 
              className="form-control"
              id="bankNotesTextarea"
              rows={3} 
              placeholder="Особенности работы с банком, ограничения и т.д."
              value={bank.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default RequisitesTab;
