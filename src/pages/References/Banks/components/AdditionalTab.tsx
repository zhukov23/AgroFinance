import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { BankData } from '../hooks/useBankEdit';
import { bankFormConfig } from '../config/editConfig';

interface AdditionalTabProps {
  bank: BankData | null;
  updateBank: (updates: Partial<BankData>) => void;
}

const AdditionalTab: React.FC<AdditionalTabProps> = ({ bank, updateBank }) => {
  if (!bank) return null;

  const handleInputChange = (field: keyof BankData, value: string | string[]) => {
    updateBank({ [field]: value });
  };

  const handleTagChange = (value: string) => {
    // Обработка множественного выбора тегов
    const currentTags = bank.tags || [];
    let newTags: string[];
    
    if (currentTags.includes(value)) {
      newTags = currentTags.filter(tag => tag !== value);
    } else {
      newTags = [...currentTags, value];
    }
    
    updateBank({ tags: newTags });
  };

  return (
    <Form>
      <Row className="g-2">


        {/* Контактная информация */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-phone-line me-2"></i>
              Контактная информация
            </h6>
          </div>
        </Col>

        {/* Телефон */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="phoneInput" className="form-label">Телефон</Label>
            <Input 
              type="tel" 
              className="form-control"
              id="phoneInput"
              placeholder="+7 (999) 123-45-67"
              value={bank.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        </Col>

        {/* Email */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="emailInput" className="form-label">Email</Label>
            <Input 
              type="email" 
              className="form-control" 
              id="emailInput"
              placeholder="info@bank.ru"
              value={bank.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
        </Col>

        {/* Веб-сайт */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="websiteInput" className="form-label">Веб-сайт</Label>
            <Input 
              type="url" 
              className="form-control" 
              id="websiteInput"
              placeholder="https://bank.ru" 
              value={bank.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>
        </Col>

        {/* Статус и рейтинг */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-star-line me-2"></i>
              Статус и рейтинг
            </h6>
          </div>
        </Col>

        {/* Статус банка */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="statusSelect" className="form-label">Статус банка</Label>
            <select 
              className="form-select" 
              id="statusSelect"
              value={bank.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Выберите статус</option>
              {bankFormConfig.bankStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Рейтинг */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="ratingSelect" className="form-label">Рейтинг надежности</Label>
            <select 
              className="form-select" 
              id="ratingSelect"
              value={bank.rating || ''}
              onChange={(e) => handleInputChange('rating', e.target.value)}
            >
              <option value="">Не установлен</option>
              {bankFormConfig.ratings.map(rating => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Теги */}
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">Теги банка</Label>
            <div className="d-flex flex-wrap gap-2">
              {bankFormConfig.bankTags.map(tag => (
                <div key={tag.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`tag_${tag.value}`}
                    checked={bank.tags?.includes(tag.value) || false}
                    onChange={() => handleTagChange(tag.value)}
                  />
                  <Label className="form-check-label" htmlFor={`tag_${tag.value}`}>
                    {tag.label}
                  </Label>
                </div>
              ))}
            </div>
            {bank.tags && bank.tags.length > 0 && (
              <div className="mt-2">
                {bank.tags.map(tagValue => {
                  const tagConfig = bankFormConfig.bankTags.find(t => t.value === tagValue);
                  return tagConfig ? (
                    <span key={tagValue} className={`badge bg-${tagConfig.color} me-1`}>
                      {tagConfig.label}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </Col>



        {/* Примечания */}
        <Col lg={12}>
          <div className="mb-3 pb-2">
            <Label htmlFor="notesTextarea" className="form-label">Примечания</Label>
            <textarea 
              className="form-control"
              id="notesTextarea"
              rows={4} 
              placeholder="Дополнительная информация о банке..."
              value={bank.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default AdditionalTab;