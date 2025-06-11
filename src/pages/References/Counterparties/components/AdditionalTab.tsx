import React, { useState } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { CounterpartyData } from '../hooks/useCounterpartyEdit';
import { counterpartyFormConfig } from '../config/editConfig';

interface AdditionalTabProps {
  counterparty: CounterpartyData | null;
  updateCounterparty: (updates: Partial<CounterpartyData>) => void;
}

const AdditionalTab: React.FC<AdditionalTabProps> = ({ counterparty, updateCounterparty }) => {
  const [sameAsLegalAddress, setSameAsLegalAddress] = useState(false);

  if (!counterparty) return null;

  const handleInputChange = (field: keyof CounterpartyData, value: string | number | boolean) => {
    updateCounterparty({ [field]: value });
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAsLegalAddress(checked);
    if (checked) {
      handleInputChange('postal_address', counterparty.address || '');
    }
  };

  return (
    <Form>
      <Row className="g-2">
        {/* Руководитель - ФИО */}
        <Col lg={8}>
          <div className="mb-3">
            <Label htmlFor="directorNameInput" className="form-label">ФИО руководителя</Label>
            <Input 
              type="text" 
              className="form-control"
              id="directorNameInput"
              placeholder="Иванов Иван Иванович"
              value={counterparty.director_name || ''}
              onChange={(e) => handleInputChange('director_name', e.target.value)}
            />
          </div>
        </Col>

        {/* Руководитель - должность */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="directorPositionSelect" className="form-label">Должность руководителя</Label>
            <select 
              className="form-select" 
              id="directorPositionSelect"
              value={counterparty.director_position || ''}
              onChange={(e) => handleInputChange('director_position', e.target.value)}
            >
              <option value="">Выберите должность</option>
              {counterpartyFormConfig.directorPositions.map(position => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Адрес */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="addressInput" className="form-label">Юридический адрес</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="addressInput"
              placeholder="г. Москва, ул. Примерная, д. 1, оф. 10"
              value={counterparty.address || ''}
              onChange={(e) => {
                handleInputChange('address', e.target.value);
                if (sameAsLegalAddress) {
                  handleInputChange('postal_address', e.target.value);
                }
              }}
            />
          </div>
        </Col>

        {/* Почтовый адрес */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="postalAddressInput" className="form-label">Почтовый адрес</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="postalAddressInput"
              placeholder="Если отличается от юридического"
              value={counterparty.postal_address || ''}
              onChange={(e) => handleInputChange('postal_address', e.target.value)}
              disabled={sameAsLegalAddress}
            />
            <div className="form-check mt-2">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="sameAsLegalAddress"
                checked={sameAsLegalAddress}
                onChange={(e) => handleSameAddressChange(e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="sameAsLegalAddress">
                Совпадает с юридическим адресом
              </Label>
            </div>
          </div>
        </Col>

        {/* Логотип */}
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">Логотип компании</Label>
            <div className="d-flex align-items-center">
              <div className="me-3">
                {counterparty.logo_url ? (
                  <img 
                    src={counterparty.logo_url} 
                    alt="Логотип" 
                    className="rounded border"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded border d-flex align-items-center justify-content-center bg-light text-muted"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <i className="ri-image-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                )}
              </div>
              <div>
                <Input 
                  type="file" 
                  className="form-control mb-2" 
                  id="logoInput"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handleInputChange('logo_url', event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="form-text">
                  Рекомендуемый размер: 300x300px. Форматы: JPG, PNG, SVG
                </div>
                {counterparty.logo_url && (
                  <button
                    type="button"
                    className="btn btn-sm btn-soft-danger mt-1"
                    onClick={() => handleInputChange('logo_url', '')}
                  >
                    <i className="ri-delete-bin-line me-1"></i>
                    Удалить логотип
                  </button>
                )}
              </div>
            </div>
          </div>
        </Col>

        {/* Кредитный лимит */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="creditLimitInput" className="form-label">Кредитный лимит</Label>
            <div className="input-group">
              <Input 
                type="number" 
                className="form-control"
                id="creditLimitInput"
                placeholder="0"
                min="0"
                step="1000"
                value={counterparty.credit_limit || ''}
                onChange={(e) => handleInputChange('credit_limit', parseFloat(e.target.value) || 0)}
              />
              <span className="input-group-text">₽</span>
            </div>
          </div>
        </Col>

        {/* Рейтинг */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="ratingSelect" className="form-label">Рейтинг надежности</Label>
            <select 
              className="form-select" 
              id="ratingSelect"
              value={counterparty.rating || ''}
              onChange={(e) => handleInputChange('rating', e.target.value)}
            >
              <option value="">Не установлен</option>
              {counterpartyFormConfig.ratings.map(rating => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Превью рейтинга */}
        {counterparty.rating && (
          <Col lg={12}>
            <div className="mb-3">
              <div className="alert alert-info d-flex align-items-center">
                <i className="ri-star-line me-2"></i>
                <span>
                  Текущий рейтинг: <strong>
                    {counterpartyFormConfig.ratings.find(r => r.value === counterparty.rating)?.label}
                  </strong>
                </span>
              </div>
            </div>
          </Col>
        )}

        {/* Даты создания и обновления (только для чтения) */}
        {(counterparty.created_at || counterparty.updated_at) && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-time-line me-2"></i>
                  Служебная информация
                </h6>
              </div>
            </Col>

            {counterparty.created_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Дата создания</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(counterparty.created_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}

            {counterparty.updated_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Последнее обновление</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(counterparty.updated_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}
          </>
        )}

        {/* Примечания */}
        <Col lg={12}>
          <div className="mb-3 pb-2">
            <Label htmlFor="notesTextarea" className="form-label">Примечания</Label>
            <textarea 
              className="form-control"
              id="notesTextarea"
              rows={4} 
              placeholder="Дополнительная информация о контрагенте..."
              value={counterparty.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default AdditionalTab;