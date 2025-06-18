import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { PlantingMaterialData } from '../hooks/usePlantingMaterialEdit';
import { plantingMaterialFormConfig } from '../config/editConfig';
import { useSyncData } from '../../../../hooks/useSyncData';
import { plantingMaterialsSyncConfig } from '../config/syncConfig';

interface BasicInfoTabProps {
  plantingMaterial: PlantingMaterialData | null;
  updatePlantingMaterial: (updates: Partial<PlantingMaterialData>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ plantingMaterial, updatePlantingMaterial }) => {
  const [counterparties, setCounterparties] = useState<{id: number, full_name: string}[]>([]);
  
  // Используем хук синхронизации для получения контрагентов
  const { loadTableData, isInitialized } = useSyncData(plantingMaterialsSyncConfig, {
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

  if (!plantingMaterial) return null;

  const handleInputChange = (field: keyof PlantingMaterialData, value: string | boolean | number | undefined) => {
    updatePlantingMaterial({ [field]: value });
  };

  return (
    <Form>
      <Row>
        {/* Наименование */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="nameInput" className="form-label">
              Наименование посевного материала <span className="text-danger">*</span>
            </Label>
            <Input 
              type="text" 
              className="form-control" 
              id="nameInput"
              placeholder="Введите наименование посевного материала" 
              value={plantingMaterial.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
        </Col>

        {/* Научное название */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="scientificNameInput" className="form-label">Научное название</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="scientificNameInput"
              placeholder="Латинское название" 
              value={plantingMaterial.scientific_name || ''}
              onChange={(e) => handleInputChange('scientific_name', e.target.value)}
            />
          </div>
        </Col>

        {/* Сорт */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="varietyInput" className="form-label">Сорт</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="varietyInput"
              placeholder="Название сорта или гибрида"
              value={plantingMaterial.variety || ''}
              onChange={(e) => handleInputChange('variety', e.target.value)}
            />
          </div>
        </Col>

        {/* Тип материала */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="materialTypeSelect" className="form-label">
              Тип посевного материала <span className="text-danger">*</span>
            </Label>
            <select 
              className="form-select" 
              id="materialTypeSelect"
              value={plantingMaterial.material_type || ''}
              onChange={(e) => handleInputChange('material_type', e.target.value)}
            >
              <option value="">Выберите тип материала</option>
              {plantingMaterialFormConfig.materialTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Категория культуры */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="cropCategorySelect" className="form-label">
              Категория культуры <span className="text-danger">*</span>
            </Label>
            <select 
              className="form-select" 
              id="cropCategorySelect"
              value={plantingMaterial.crop_category || ''}
              onChange={(e) => handleInputChange('crop_category', e.target.value)}
            >
              <option value="">Выберите категорию культуры</option>
              {plantingMaterialFormConfig.cropCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Сезонный тип */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="seasonTypeSelect" className="form-label">Сезонный тип</Label>
            <select 
              className="form-select" 
              id="seasonTypeSelect"
              value={plantingMaterial.season_type || ''}
              onChange={(e) => handleInputChange('season_type', e.target.value)}
            >
              <option value="">Выберите сезонный тип</option>
              {plantingMaterialFormConfig.seasonTypes.map(season => (
                <option key={season.value} value={season.value}>
                  {season.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Страна происхождения */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="originCountrySelect" className="form-label">Страна происхождения</Label>
            <select 
              className="form-select" 
              id="originCountrySelect"
              value={plantingMaterial.origin_country || ''}
              onChange={(e) => handleInputChange('origin_country', e.target.value)}
            >
              <option value="">Выберите страну происхождения</option>
              {plantingMaterialFormConfig.originCountries.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Селекционер */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="breederInput" className="form-label">Селекционер/Организация</Label>
            <Input 
              type="text" 
              className="form-control" 
              id="breederInput"
              placeholder="Название селекционной организации"
              value={plantingMaterial.breeder || ''}
              onChange={(e) => handleInputChange('breeder', e.target.value)}
            />
          </div>
        </Col>

        {/* Производитель */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="manufacturerSelect" className="form-label">Производитель</Label>
            <select 
              className="form-select" 
              id="manufacturerSelect"
              value={plantingMaterial.manufacturer_id || ''}
              onChange={(e) => handleInputChange('manufacturer_id', parseInt(e.target.value) || undefined)}
            >
              <option value="">Выберите производителя</option>
              {counterparties.map(counterparty => (
                <option key={counterparty.id} value={counterparty.id}>
                  {counterparty.full_name}
                </option>
              ))}
            </select>
            <div className="form-text">
              {counterparties.length === 0 
                ? 'Загрузка списка производителей...' 
                : `Доступно производителей: ${counterparties.length}`}
            </div>
          </div>
        </Col>

        {/* Статус активности */}
        <Col lg={6}>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActiveSwitch"
                checked={plantingMaterial.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="isActiveSwitch">
                <span className={`badge ${plantingMaterial.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                  {plantingMaterial.is_active ? '✓ Активный' : '✗ Неактивный'}
                </span>
                посевной материал
              </Label>
            </div>
          </div>
        </Col>

        {/* Описание */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="descriptionTextarea" className="form-label">Описание</Label>
            <textarea 
              className="form-control"
              id="descriptionTextarea"
              rows={4} 
              placeholder="Описание характеристик и особенностей сорта..."
              value={plantingMaterial.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab;