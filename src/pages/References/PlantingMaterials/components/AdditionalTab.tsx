import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { PlantingMaterialData } from '../hooks/usePlantingMaterialEdit';
import { plantingMaterialFormConfig } from '../config/editConfig';

interface AdditionalTabProps {
  plantingMaterial: PlantingMaterialData | null;
  updatePlantingMaterial: (updates: Partial<PlantingMaterialData>) => void;
}

const AdditionalTab: React.FC<AdditionalTabProps> = ({ plantingMaterial, updatePlantingMaterial }) => {
  if (!plantingMaterial) return null;

  const handleInputChange = (field: keyof PlantingMaterialData, value: string | number | string[] | undefined) => {
    updatePlantingMaterial({ [field]: value });
  };

  const handleTagChange = (value: string) => {
    // Обработка множественного выбора тегов
    const currentTags = Array.isArray(plantingMaterial.tags) 
      ? plantingMaterial.tags 
      : [];
    let newTags: string[];
    
    if (currentTags.includes(value)) {
      newTags = currentTags.filter(tag => tag !== value);
    } else {
      newTags = [...currentTags, value];
    }
    
    updatePlantingMaterial({ tags: newTags });
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
          <div className="mb-3">
            <Label htmlFor="statusSelect" className="form-label">Статус</Label>
            <select 
              className="form-select" 
              id="statusSelect"
              value={plantingMaterial.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Выберите статус</option>
              {plantingMaterialFormConfig.statuses.map(status => (
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
            <Label htmlFor="ratingSelect" className="form-label">Рейтинг</Label>
            <select 
              className="form-select" 
              id="ratingSelect"
              value={plantingMaterial.rating || ''}
              onChange={(e) => handleInputChange('rating', parseInt(e.target.value) || undefined)}
            >
              <option value="">Не установлен</option>
              {plantingMaterialFormConfig.ratings.map(rating => (
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
            <Label className="form-label">Теги</Label>
            <div className="d-flex flex-wrap gap-2">
              {plantingMaterialFormConfig.commonTags.map(tag => (
                <div key={tag.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`tag_${tag.value}`}
                    checked={Array.isArray(plantingMaterial.tags) 
                      ? plantingMaterial.tags.includes(tag.value) 
                      : false}
                    onChange={() => handleTagChange(tag.value)}
                  />
                  <Label className="form-check-label" htmlFor={`tag_${tag.value}`}>
                    {tag.label}
                  </Label>
                </div>
              ))}
            </div>
            {Array.isArray(plantingMaterial.tags) && plantingMaterial.tags.length > 0 && (
              <div className="mt-2">
                {plantingMaterial.tags.map(tagValue => {
                  const tagConfig = plantingMaterialFormConfig.commonTags.find(t => t.value === tagValue);
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

        {/* Производитель/Поставщик */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-building-line me-2"></i>
              Информация о производителе
            </h6>
          </div>
        </Col>

        {/* ID производителя (для связи с таблицей контрагентов) */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="manufacturerIdInput" className="form-label">ID производителя</Label>
            <Input 
              type="number" 
              className="form-control"
              id="manufacturerIdInput"
              placeholder="ID из справочника контрагентов"
              value={plantingMaterial.manufacturer_id || ''}
              onChange={(e) => handleInputChange('manufacturer_id', parseInt(e.target.value) || undefined)}
            />
            <div className="form-text">Связь с записью в справочнике контрагентов</div>
          </div>
        </Col>

        {/* Служебная информация */}
        {(plantingMaterial.created_at || plantingMaterial.updated_at) && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-time-line me-2"></i>
                  Служебная информация
                </h6>
              </div>
            </Col>

            {plantingMaterial.created_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Дата создания</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(plantingMaterial.created_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}

            {plantingMaterial.updated_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Последнее обновление</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(plantingMaterial.updated_at).toLocaleString('ru-RU')}
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
              placeholder="Дополнительная информация о посевном материале..."
              value={plantingMaterial.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default AdditionalTab;