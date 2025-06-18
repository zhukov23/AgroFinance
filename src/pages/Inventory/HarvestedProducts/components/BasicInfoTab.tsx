import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { HarvestedProductData } from '../hooks/useHarvestedProductEdit';
import { harvestedProductFormConfig } from '../config/editConfig';
import { useSyncData } from '../../../../hooks/useSyncData';
import { harvestedProductsSyncConfig } from '../config/syncConfig';

interface BasicInfoTabProps {
  harvestedProduct: HarvestedProductData | null;
  updateHarvestedProduct: (updates: Partial<HarvestedProductData>) => void;
  validationErrors: {[key: string]: string};
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  harvestedProduct, 
  updateHarvestedProduct, 
  validationErrors 
}) => {
  const [storageLocations, setStorageLocations] = useState<{id: number, name: string}[]>([]);
  const [plantingMaterials, setPlantingMaterials] = useState<{id: number, name: string}[]>([]);
  
  // State для валидации
  const [validation, setValidation] = useState({
    product_name: null as boolean | null,
    harvest_date: null as boolean | null,
    quantity: null as boolean | null,
    harvest_area: null as boolean | null,
    field_name: null as boolean | null,
    storage_location_id: null as boolean | null,
    planting_material_id: null as boolean | null
  });

  // Используем хук синхронизации для получения связанных данных
  const { loadTableData, isInitialized } = useSyncData(harvestedProductsSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  // Загружаем список мест хранения и посевного материала при инициализации
  useEffect(() => {
    const loadRelatedData = async () => {
      if (isInitialized) {
        try {
          // Загружаем места хранения
          const storageData = await loadTableData('reference_storage_locations');
          const filteredStorageData = storageData
            .filter((item: any) => item.id && item.name)
            .map((item: any) => ({
              id: item.id,
              name: item.name
            }));
          setStorageLocations(filteredStorageData);

          // Загружаем посевной материал
          const plantingData = await loadTableData('reference_planting_materials');
          const filteredPlantingData = plantingData
            .filter((item: any) => item.id && item.name)
            .map((item: any) => ({
              id: item.id,
              name: item.name
            }));
          setPlantingMaterials(filteredPlantingData);
        } catch (error) {
          console.error('Ошибка загрузки связанных данных:', error);
        }
      }
    };

    loadRelatedData();
  }, [isInitialized, loadTableData]);

  // Функция валидации при изменении поля
  const onChangeValidation = (fieldName: string, value: any) => {
    const modifiedV: any = { ...validation };
    
    if (fieldName === 'product_name') {
      modifiedV[fieldName] = value && value.trim().length > 0;
    } else if (fieldName === 'harvest_date') {
      modifiedV[fieldName] = value && value !== '';
    } else if (fieldName === 'quantity') {
      const numValue = parseFloat(value);
      modifiedV[fieldName] = !isNaN(numValue) && numValue > 0;
    } else if (fieldName === 'harvest_area') {
      const numValue = parseFloat(value);
      modifiedV[fieldName] = !value || (!isNaN(numValue) && numValue > 0);
    } else if (fieldName === 'field_name') {
      modifiedV[fieldName] = !value || value.trim().length > 0;
    } else if (fieldName === 'storage_location_id') {
      modifiedV[fieldName] = !value || parseInt(value) > 0;
    } else if (fieldName === 'planting_material_id') {
      modifiedV[fieldName] = !value || parseInt(value) > 0;
    }
    
    setValidation(modifiedV);
  };

  if (!harvestedProduct) return null;

  const handleInputChange = (field: keyof HarvestedProductData, value: string | boolean | number | undefined) => {
    updateHarvestedProduct({ [field]: value });
  };

  return (
    <Form>
      <Row>
        {/* Наименование продукции */}
        <Col lg={12}>
          <div className="mb-3 position-relative">
            <Label htmlFor="productNameInput" className="form-label">
              Наименование продукции <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id="productNameInput"
              placeholder="Введите наименование урожайной продукции" 
              value={harvestedProduct.product_name || ''}
              onChange={(e) => {
                handleInputChange('product_name', e.target.value);
                onChangeValidation('product_name', e.target.value);
              }}
              valid={validation.product_name === true}
              invalid={(validation.product_name !== true && validation.product_name !== null) || !!validationErrors.product_name}
            />
            <div className={validation.product_name === true ? "valid-tooltip" : "invalid-tooltip"}>
              {validation.product_name === true 
                ? "Отлично!" 
                : validationErrors.product_name || "Пожалуйста, введите наименование продукции"}
            </div>
          </div>
        </Col>

        {/* Дата сбора урожая */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="harvestDateInput" className="form-label">
              Дата сбора урожая <span className="text-danger">*</span>
            </Label>
            <Input 
              type="date" 
              className="form-control" 
              id="harvestDateInput"
              value={harvestedProduct.harvest_date || ''}
              onChange={(e) => {
                handleInputChange('harvest_date', e.target.value);
                onChangeValidation('harvest_date', e.target.value);
              }}
              valid={validation.harvest_date === true}
              invalid={(validation.harvest_date !== true && validation.harvest_date !== null) || !!validationErrors.harvest_date}
            />
            <div className={validation.harvest_date === true ? "valid-tooltip" : "invalid-tooltip"}>
              {validation.harvest_date === true 
                ? "Отлично!" 
                : validationErrors.harvest_date || "Пожалуйста, укажите дату сбора урожая"}
            </div>
          </div>
        </Col>

        {/* Название поля */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="fieldNameInput" className="form-label">Название поля</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="fieldNameInput"
              placeholder="Поле №1, Южное поле"
              value={harvestedProduct.field_name || ''}
              onChange={(e) => {
                handleInputChange('field_name', e.target.value);
                onChangeValidation('field_name', e.target.value);
              }}
              valid={validation.field_name === true}
              invalid={validation.field_name !== true && validation.field_name !== null}
            />
            {validation.field_name !== null && (
              <div className={validation.field_name === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.field_name === true 
                  ? "Отлично!" 
                  : "Введите корректное название поля"}
              </div>
            )}
          </div>
        </Col>

        {/* Площадь сбора */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="harvestAreaInput" className="form-label">Площадь сбора (га)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="harvestAreaInput"
              placeholder="100.50"
              step="0.01"
              min="0"
              value={harvestedProduct.harvest_area || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || undefined;
                handleInputChange('harvest_area', value);
                onChangeValidation('harvest_area', e.target.value);
              }}
              valid={validation.harvest_area === true}
              invalid={validation.harvest_area !== true && validation.harvest_area !== null}
            />
            {validation.harvest_area !== null && (
              <div className={validation.harvest_area === true ? "valid-tooltip" : "invalid-tooltip"}>
                {validation.harvest_area === true 
                  ? "Отлично!" 
                  : "Площадь должна быть положительным числом"}
              </div>
            )}
          </div>
        </Col>

        {/* Количество */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="quantityInput" className="form-label">
              Количество (тонн) <span className="text-danger">*</span>
            </Label>
            <Input 
              type="number" 
              className="form-control"
              id="quantityInput"
              placeholder="500.250"
              step="0.001"
              min="0.001"
              value={harvestedProduct.quantity || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                handleInputChange('quantity', value);
                onChangeValidation('quantity', e.target.value);
              }}
              valid={validation.quantity === true}
              invalid={(validation.quantity !== true && validation.quantity !== null) || !!validationErrors.quantity}
            />
            <div className={validation.quantity === true ? "valid-tooltip" : "invalid-tooltip"}>
              {validation.quantity === true 
                ? "Отлично!" 
                : validationErrors.quantity || "Количество должно быть больше 0"}
            </div>
          </div>
        </Col>

        {/* Посевной материал */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="plantingMaterialSelect" className="form-label">Посевной материал</Label>
            <select 
              className="form-select" 
              id="plantingMaterialSelect"
              value={harvestedProduct.planting_material_id || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('planting_material_id', value);
                onChangeValidation('planting_material_id', e.target.value);
              }}
            >
              <option value="">Выберите посевной материал</option>
              {plantingMaterials.map(material => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
            <div className="form-text">
              {plantingMaterials.length === 0 
                ? 'Загрузка списка посевного материала...' 
                : `Доступно материалов: ${plantingMaterials.length}`}
            </div>
          </div>
        </Col>

        {/* Место хранения */}
        <Col lg={4}>
          <div className="mb-3 position-relative">
            <Label htmlFor="storageLocationSelect" className="form-label">Место хранения</Label>
            <select 
              className="form-select" 
              id="storageLocationSelect"
              value={harvestedProduct.storage_location_id || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('storage_location_id', value);
                onChangeValidation('storage_location_id', e.target.value);
              }}
            >
              <option value="">Выберите место хранения</option>
              {storageLocations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <div className="form-text">
              {storageLocations.length === 0 
                ? 'Загрузка списка мест хранения...' 
                : `Доступно мест: ${storageLocations.length}`}
            </div>
          </div>
        </Col>

        {/* ID посева */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="plantingIdInput" className="form-label">ID посева</Label>
            <Input 
              type="number" 
              className="form-control"
              id="plantingIdInput"
              placeholder="Связь с записью посева"
              value={harvestedProduct.planting_id || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                handleInputChange('planting_id', value);
              }}
            />
            <div className="form-text">Связь с операцией посева (если есть)</div>
          </div>
        </Col>

        {/* Статус активности */}
        <Col lg={6}>
          <div className="mb-3">
            <div className="form-check form-switch mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={harvestedProduct.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="isActiveSwitch">
                <span className={`badge ${harvestedProduct.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                  {harvestedProduct.is_active ? '✓ Активная' : '✗ Неактивная'}
                </span>
                урожайная продукция
              </Label>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab; 
