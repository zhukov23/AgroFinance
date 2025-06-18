import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { StorageLocationData } from '../hooks/useStorageLocationEdit';
import { storageLocationFormConfig } from '../config/editConfig';

interface AdditionalTabProps {
  storageLocation: StorageLocationData | null;
  updateStorageLocation: (updates: Partial<StorageLocationData>) => void;
}

const AdditionalTab: React.FC<AdditionalTabProps> = ({ storageLocation, updateStorageLocation }) => {
  if (!storageLocation) return null;

  const handleInputChange = (field: keyof StorageLocationData, value: string | number | string[] | undefined) => {
    updateStorageLocation({ [field]: value });
  };

  const handleTagChange = (value: string) => {
    // Обработка множественного выбора тегов
    const currentTags = Array.isArray(storageLocation.tags) 
      ? storageLocation.tags 
      : [];
    let newTags: string[];
    
    if (currentTags.includes(value)) {
      newTags = currentTags.filter(tag => tag !== value);
    } else {
      newTags = [...currentTags, value];
    }
    
    updateStorageLocation({ tags: newTags });
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
              value={storageLocation.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="">Выберите статус</option>
              {storageLocationFormConfig.statuses.map(status => (
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
              value={storageLocation.rating || ''}
              onChange={(e) => handleInputChange('rating', parseInt(e.target.value) || undefined)}
            >
              <option value="">Не установлен</option>
              {storageLocationFormConfig.ratings.map(rating => (
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
              {storageLocationFormConfig.commonTags.map(tag => (
                <div key={tag.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`tag_${tag.value}`}
                    checked={Array.isArray(storageLocation.tags) 
                      ? storageLocation.tags.includes(tag.value) 
                      : false}
                    onChange={() => handleTagChange(tag.value)}
                  />
                  <Label className="form-check-label" htmlFor={`tag_${tag.value}`}>
                    {tag.label}
                  </Label>
                </div>
              ))}
            </div>
            {Array.isArray(storageLocation.tags) && storageLocation.tags.length > 0 && (
              <div className="mt-2">
                {storageLocation.tags.map(tagValue => {
                  const tagConfig = storageLocationFormConfig.commonTags.find(t => t.value === tagValue);
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

        {/* Служебная информация */}
        {(storageLocation.created_at || storageLocation.updated_at) && (
          <>
            <Col lg={12}>
              <div className="mb-4 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className="ri-time-line me-2"></i>
                  Служебная информация
                </h6>
              </div>
            </Col>

            {storageLocation.created_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Дата создания</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(storageLocation.created_at).toLocaleString('ru-RU')}
                    readOnly
                  />
                </div>
              </Col>
            )}

            {storageLocation.updated_at && (
              <Col lg={6}>
                <div className="mb-3">
                  <Label className="form-label">Последнее обновление</Label>
                  <Input 
                    type="text" 
                    className="form-control" 
                    value={new Date(storageLocation.updated_at).toLocaleString('ru-RU')}
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
              placeholder="Дополнительная информация о месте хранения..."
              value={storageLocation.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default AdditionalTab; 
