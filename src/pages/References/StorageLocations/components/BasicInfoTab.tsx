import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { StorageLocationData } from '../hooks/useStorageLocationEdit';
import { storageLocationFormConfig } from '../config/editConfig';
import { useSyncData } from '../../../../hooks/useSyncData';
import { storageLocationsSyncConfig } from '../config/syncConfig';

interface BasicInfoTabProps {
  storageLocation: StorageLocationData | null;
  updateStorageLocation: (updates: Partial<StorageLocationData>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ storageLocation, updateStorageLocation }) => {
  const [counterparties, setCounterparties] = useState<{id: number, full_name: string}[]>([]);
  
  // State для валидации
  const [validation, setValidation] = useState({
    name: null,
    storage_type: null,
    email: null,
    phone: null,
    coordinates: null,
    counterparty_id: null
  });

  // Используем хук синхронизации для получения контрагентов
  const { loadTableData, isInitialized } = useSyncData(storageLocationsSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Загружаем список контрагентов при инициализации
  useEffect(() => {
    const loadCounterparties = async () => {
      if (isInitialized) {
        try {
          const allData = await loadTableData('reference_counterparties');
          // Фильтруем только нужные поля: id и full_name
          const filteredData = allData
            .filter((item: any) => item.id && item.full_name)
            .map((item: any) => ({
              id: item.id,
              full_name: item.full_name
            }));
          setCounterparties(filteredData);
        } catch (error) {
          console.error('Ошибка загрузки контрагентов:', error);
        }
      }
    };

    loadCounterparties();
  }, [isInitialized, loadTableData]);

  // Функция валидации при изменении поля
  const onChangeValidation = (fieldName: string, value: any) => {
    const modifiedV: any = { ...validation };
    
    if (fieldName === 'name') {
      modifiedV[fieldName] = value && value.trim().length > 0;
    } else if (fieldName === 'storage_type') {
      modifiedV[fieldName] = value && value !== '';
      // При смене типа склада сбрасываем валидацию контрагента
      if (value === 'own') {
        modifiedV['counterparty_id'] = true; // Для собственных не требуется
      } else {
        modifiedV['counterparty_id'] = storageLocation?.counterparty_id ? true : null; // Сбрасываем для внешних
      }
    } else if (fieldName === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      modifiedV[fieldName] = !value || emailPattern.test(value);
    } else if (fieldName === 'phone') {
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
      modifiedV[fieldName] = !value || phonePattern.test(value);
    } else if (fieldName === 'coordinates') {
      const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
      modifiedV[fieldName] = !value || coordPattern.test(value);
    } else if (fieldName === 'counterparty_id') {
      // Для внешних складов контрагент обязателен
      if (storageLocation?.storage_type === 'external') {
        modifiedV[fieldName] = value && value !== '';
      } else {
        modifiedV[fieldName] = true; // Для собственных не требуется
      }
    }
    
    setValidation(modifiedV);
  };

  if (!storageLocation) return null;

  const handleInputChange = (field: keyof StorageLocationData, value: string | boolean | number | undefined) => {
    updateStorageLocation({ [field]: value });
  };

  return (
    <Form>
      <Row>
        {/* Наименование */}
        <Col lg={12}>
          <div className="mb-3 position-relative">
            <Label htmlFor="nameInput" className="form-label">
              Наименование места хранения <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id="nameInput"
              placeholder="Введите наименование места хранения" 
              value={storageLocation.name || ''}
              onChange={(e) => {
                handleInputChange('name', e.target.value);
                onChangeValidation('name', e.target.value);
              }}
              valid={validation.name === true}
              invalid={validation.name !== true && validation.name !== null}
            />
            <div className={validation.name === true ? "valid-tooltip" : "invalid-tooltip"}>
              {validation.name === true 
                ? "Отлично!" 
                : "Пожалуйста, введите наименование места хранения"}
            </div>
          </div>
        </Col>

        {/* Код */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="codeInput" className="form-label">Код</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="codeInput"
              placeholder="SKL-001, ELEV-12" 
              value={storageLocation.code || ''}
              onChange={(e) => handleInputChange('code', e.target.value)}
            />
          </div>
        </Col>

        {/* Тип хранилища */}
        <Col lg={6}>
          <div className="mb-3 position-relative">
            <Label htmlFor="storageTypeSelect" className="form-label">
              Тип хранилища <span className="text-danger">*</span>
            </Label>
            <select 
              className="form-select" 
              id="storageTypeSelect"
              value={storageLocation.storage_type || ''}
              onChange={(e) => {
                handleInputChange('storage_type', e.target.value);
                onChangeValidation('storage_type', e.target.value);
              }}
            >
              <option value="">Выберите тип хранилища</option>
              {storageLocationFormConfig.storageTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {validation.storage_type !== null && (
              <div className={validation.storage_type === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.storage_type === true 
                  ? "Отлично!" 
                  : "Пожалуйста, выберите тип хранилища"}
              </div>
            )}
          </div>
        </Col>

        {/* Контрагент (для внешних складов) */}
        {storageLocation.storage_type === 'external' && (
          <Col lg={12}>
            <div className="mb-3 position-relative">
              <Label htmlFor="counterpartySelect" className="form-label">
                Контрагент (владелец склада) <span className="text-danger">*</span>
              </Label>
              <select 
                className="form-select" 
                id="counterpartySelect"
                value={storageLocation.counterparty_id || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || undefined;
                  handleInputChange('counterparty_id', value);
                  onChangeValidation('counterparty_id', value);
                }}
              >
                <option value="">Выберите контрагента</option>
                {counterparties.map(counterparty => (
                  <option key={counterparty.id} value={counterparty.id}>
                    {counterparty.full_name}
                  </option>
                ))}
              </select>
              {validation.counterparty_id !== null && (
                <div className={validation.counterparty_id === true ? "valid-tooltip" : "invalid-tooltip"}>
                  {validation.counterparty_id === true 
                    ? "Отлично!" 
                    : "Пожалуйста, выберите контрагента для внешнего склада"}
                </div>
              )}
              <div className="form-text">
                {counterparties.length === 0 
                  ? 'Загрузка списка контрагентов...' 
                  : `Доступно контрагентов: ${counterparties.length}`}
              </div>
            </div>
          </Col>
        )}

        {/* Адрес */}
        <Col lg={8}>
          <div className="mb-3">
            <Label htmlFor="addressInput" className="form-label">Адрес</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="addressInput"
              placeholder="Полный адрес места хранения"
              value={storageLocation.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </Col>

        {/* Координаты */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="coordinatesInput" className="form-label">GPS координаты</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="coordinatesInput"
              placeholder="55.7558,37.6176"
              value={storageLocation.coordinates || ''}
              onChange={(e) => {
                handleInputChange('coordinates', e.target.value);
                onChangeValidation('coordinates', e.target.value);
              }}
              valid={validation.coordinates === true}
              invalid={validation.coordinates !== true && validation.coordinates !== null}
            />
            {validation.coordinates !== null && (
              <div className={validation.coordinates === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.coordinates === true 
                  ? "Отлично!" 
                  : "Формат: широта,долгота (например: 55.7558,37.6176)"}
              </div>
            )}
            <div className="form-text">Формат: широта,долгота</div>
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
              placeholder="ФИО ответственного лица"
              value={storageLocation.contact_person || ''}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
            />
          </div>
        </Col>

        {/* Телефон */}
        <Col lg={3}>
          <div className="mb-3 position-relative">
            <Label htmlFor="phoneInput" className="form-label">Телефон</Label>
            <Input 
              type="tel" 
              className="form-control"
              id="phoneInput"
              placeholder="+7 (999) 123-45-67"
              value={storageLocation.phone || ''}
              onChange={(e) => {
                handleInputChange('phone', e.target.value);
                onChangeValidation('phone', e.target.value);
              }}
              valid={validation.phone === true}
              invalid={validation.phone !== true && validation.phone !== null}
            />
            {validation.phone !== null && (
              <div className={validation.phone === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.phone === true 
                  ? "Отлично!" 
                  : "Введите корректный номер телефона"}
              </div>
            )}
          </div>
        </Col>

        {/* Email */}
        <Col lg={3}>
          <div className="mb-3 position-relative">
            <Label htmlFor="emailInput" className="form-label">Email</Label>
            <Input 
              type="email" 
              className="form-control" 
              id="emailInput"
              placeholder="email@example.com"
              value={storageLocation.email || ''}
              onChange={(e) => {
                handleInputChange('email', e.target.value);
                onChangeValidation('email', e.target.value);
              }}
              valid={validation.email === true}
              invalid={validation.email !== true && validation.email !== null}
            />
            {validation.email !== null && (
              <div className={validation.email === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.email === true 
                  ? "Отлично!" 
                  : "Введите корректный email адрес"}
              </div>
            )}
          </div>
        </Col>

        {/* Статус активности */}
        <Col lg={12}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={storageLocation.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="isActiveSwitch">
                <span className={`badge ${storageLocation.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                  {storageLocation.is_active ? '✓ Активное' : '✗ Неактивное'}
                </span>
                место хранения
              </Label>
            </div>
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
              placeholder="Описание условий хранения (температура, влажность, особенности)..."
              value={storageLocation.storage_conditions || ''}
              onChange={(e) => handleInputChange('storage_conditions', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab;