import React, { useState } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { HarvestedProductData } from '../hooks/useHarvestedProductEdit';
import { harvestedProductFormConfig } from '../config/editConfig';

interface AdditionalTabProps {
  harvestedProduct: HarvestedProductData | null;
  updateHarvestedProduct: (updates: Partial<HarvestedProductData>) => void;
  validationErrors: {[key: string]: string};
}

const AdditionalTab: React.FC<AdditionalTabProps> = ({ 
  harvestedProduct, 
  updateHarvestedProduct, 
  validationErrors 
}) => {
  // State для валидации
  const [validation, setValidation] = useState({
    rating: null as boolean | null,
    lab_certificate_number: null as boolean | null,
    status: null as boolean | null
  });

  // Функция валидации при изменении поля
  const onChangeValidation = (fieldName: string, value: any) => {
    const modifiedV: any = { ...validation };
    
    if (fieldName === 'rating') {
      const numValue = parseInt(value);
      modifiedV[fieldName] = !value || (!isNaN(numValue) && numValue >= 1 && numValue <= 5);
    } else if (fieldName === 'lab_certificate_number') {
      modifiedV[fieldName] = !value || value.trim().length > 0;
    } else if (fieldName === 'status') {
      modifiedV[fieldName] = !value || value !== '';
    }
    
    setValidation(modifiedV);
  };

  if (!harvestedProduct) return null;

  const handleInputChange = (field: keyof HarvestedProductData, value: string | number | string[] | undefined) => {
    updateHarvestedProduct({ [field]: value });
  };

  const handleTagChange = (value: string) => {
    // Обработка множественного выбора тегов
    const currentTags = Array.isArray(harvestedProduct.tags) 
      ? harvestedProduct.tags 
      : [];
    let newTags: string[];
    
    if (currentTags.includes(value)) {
      newTags = currentTags.filter(tag => tag !== value);
    } else {
      newTags = [...currentTags, value];
    }
    
    updateHarvestedProduct({ tags: newTags });
  };

  return (
    <Form>
      <Row className="g-2">
        {/* Статус и рейтинг */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-star-line me-2"></i>
              Статус и рейтинг
            </h6>
          </div>
        </Col>

        {/* Статус */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="statusSelect" className="form-label">Статус</Label>
            <select 
              className="form-select" 
              id="statusSelect"
              value={harvestedProduct.status || ''}
              onChange={(e) => {
                handleInputChange('status', e.target.value);
                onChangeValidation('status', e.target.value);
              }}
            >
              <option value="">Выберите статус</option>
              {harvestedProductFormConfig.statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Рейтинг */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="ratingSelect" className="form-label">Рейтинг качества</Label>
            <select 
              className="form-select" 
              id="ratingSelect"
              value={harvestedProduct.rating || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('rating', value);
                onChangeValidation('rating', e.target.value);
              }}
            >
              <option value="">Не установлен</option>
              {harvestedProductFormConfig.ratings.map(rating => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
            {(validation.rating !== null || validationErrors.rating) && (
              <div className={validation.rating === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.rating === true 
                  ? "Отлично!" 
                  : validationErrors.rating || "Рейтинг должен быть от 1 до 5"}
              </div>
            )}
          </div>
        </Col>

        {/* Теги */}
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">Теги продукции</Label>
            <div className="d-flex flex-wrap gap-2">
              {harvestedProductFormConfig.commonTags.map(tag => (
                <div key={tag.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`tag_${tag.value}`}
                    checked={Array.isArray(harvestedProduct.tags) 
                      ? harvestedProduct.tags.includes(tag.value) 
                      : false}
                    onChange={() => handleTagChange(tag.value)}
                  />
                  <Label className="form-check-label" htmlFor={`tag_${tag.value}`}>
                    {tag.label}
                  </Label>
                </div>
              ))}
            </div>
            {Array.isArray(harvestedProduct.tags) && harvestedProduct.tags.length > 0 && (
              <div className="mt-2">
                {harvestedProduct.tags.map(tagValue => {
                  const tagConfig = harvestedProductFormConfig.commonTags.find(t => t.value === tagValue);
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

        {/* Лабораторная информация */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-flask-line me-2"></i>
              Лабораторная информация
            </h6>
          </div>
        </Col>

        {/* Дата лабораторного анализа */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="labAnalysisDateInput" className="form-label">Дата лабораторного анализа</Label>
            <Input 
              type="date" 
              className="form-control" 
              id="labAnalysisDateInput"
              value={harvestedProduct.lab_analysis_date || ''}
              onChange={(e) => handleInputChange('lab_analysis_date', e.target.value)}
            />
          </div>
        </Col>

        {/* Номер лабораторного сертификата */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="labCertificateInput" className="form-label">Номер лабораторного сертификата</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="labCertificateInput"
              placeholder="ЛС-2024-001234"
              value={harvestedProduct.lab_certificate_number || ''}
              onChange={(e) => {
                handleInputChange('lab_certificate_number', e.target.value);
                onChangeValidation('lab_certificate_number', e.target.value);
              }}
              valid={validation.lab_certificate_number === true}
              invalid={validation.lab_certificate_number !== true && validation.lab_certificate_number !== null}
            />
            {validation.lab_certificate_number !== null && (
              <div className={validation.lab_certificate_number === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.lab_certificate_number === true 
                  ? "Отлично!" 
                  : "Введите корректный номер сертификата"}
              </div>
            )}
          </div>
        </Col>

        {/* Хранение */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-archive-line me-2"></i>
              Информация о хранении
            </h6>
          </div>
        </Col>

        {/* Дата помещения на хранение */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="storageDateInput" className="form-label">Дата помещения на хранение</Label>
            <Input 
              type="date" 
              className="form-control" 
              id="storageDateInput"
              value={harvestedProduct.storage_date || ''}
              onChange={(e) => handleInputChange('storage_date', e.target.value)}
            />
          </div>
        </Col>

        {/* Условия хранения */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="storageConditionsTextarea" className="form-label">Условия хранения</Label>
            <textarea 
              className="form-control"
              id="storageConditionsTextarea"
              rows={3} 
              placeholder="Описание условий хранения (температура, влажность, вентиляция)..."
              value={harvestedProduct.storage_conditions || ''}
              onChange={(e) => handleInputChange('storage_conditions', e.target.value)}
            />
          </div>
        </Col>

        {/* Рекомендации */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-lightbulb-line me-2"></i>
              Рекомендации и условия
            </h6>
          </div>
        </Col>

        {/* Условия уборки */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="harvestConditionsTextarea" className="form-label">Условия уборки</Label>
            <textarea 
              className="form-control"
              id="harvestConditionsTextarea"
              rows={3} 
              placeholder="Описание условий уборки урожая (погода, время, техника)..."
              value={harvestedProduct.harvest_conditions || ''}
              onChange={(e) => handleInputChange('harvest_conditions', e.target.value)}
            />
          </div>
        </Col>

        {/* Рекомендации по переработке */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="processingRecommendationsTextarea" className="form-label">Рекомендации по переработке</Label>
            <textarea 
              className="form-control"
              id="processingRecommendationsTextarea"
              rows={3} 
              placeholder="Рекомендации по использованию и переработке продукции..."
              value={harvestedProduct.processing_recommendations || ''}
              onChange={(e) => handleInputChange('processing_recommendations', e.target.value)}
            />
          </div>
        </Col>

        {/* Служебная информация */}
        {(harvestedProduct.created_at || harvestedProduct.updated_at) && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-time-line me-2"></i>
                  Служебная информация
                </h6>
              </div>
            </Col>

            {harvestedProduct.created_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Дата создания</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(harvestedProduct.created_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}

            {harvestedProduct.updated_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Последнее обновление</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(harvestedProduct.updated_at).toLocaleString('ru-RU')}
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
              placeholder="Дополнительная информация об урожайной продукции..."
              value={harvestedProduct.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default AdditionalTab; 
