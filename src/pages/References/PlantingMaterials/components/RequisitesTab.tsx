import React from 'react';
import { Form, Row, Col, Label, Input } from 'reactstrap';
import { PlantingMaterialData } from '../hooks/usePlantingMaterialEdit';
import { plantingMaterialFormConfig } from '../config/editConfig';

interface RequisitesTabProps {
  plantingMaterial: PlantingMaterialData | null;
  updatePlantingMaterial: (updates: Partial<PlantingMaterialData>) => void;
}

const RequisitesTab: React.FC<RequisitesTabProps> = ({ plantingMaterial, updatePlantingMaterial }) => {
  if (!plantingMaterial) return null;

  const handleInputChange = (field: keyof PlantingMaterialData, value: string | number | string[] | undefined) => {
    updatePlantingMaterial({ [field]: value });
  };

  const handleSoilTypeChange = (soilType: string) => {
    const currentSoils = Array.isArray(plantingMaterial.recommended_soil_types) 
      ? plantingMaterial.recommended_soil_types 
      : [];
    let newSoils: string[];
    
    if (currentSoils.includes(soilType)) {
      newSoils = currentSoils.filter(soil => soil !== soilType);
    } else {
      newSoils = [...currentSoils, soilType];
    }
    
    updatePlantingMaterial({ recommended_soil_types: newSoils });
  };

  const handleArrayFieldChange = (field: 'disease_resistance' | 'pest_resistance', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updatePlantingMaterial({ [field]: items });
  };

  return (
    <Form>
      <Row className="g-2">
        {/* Агрономические характеристики */}
        <Col lg={12}>
          <div className="mb-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-plant-line me-2"></i>
              Агрономические характеристики
            </h6>
          </div>
        </Col>

        {/* Срок созревания */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="maturityDaysInput" className="form-label">Срок созревания (дни)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="maturityDaysInput"
              placeholder="90"
              min="1"
              max="365"
              value={plantingMaterial.maturity_days || ''}
              onChange={(e) => handleInputChange('maturity_days', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Потенциальная урожайность */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="potentialYieldInput" className="form-label">Потенциальная урожайность (ц/га)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="potentialYieldInput"
              placeholder="50.5"
              step="0.1"
              min="0"
              value={plantingMaterial.potential_yield || ''}
              onChange={(e) => handleInputChange('potential_yield', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Потребность в воде */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="waterRequirementSelect" className="form-label">Потребность в воде</Label>
            <select 
              className="form-select" 
              id="waterRequirementSelect"
              value={plantingMaterial.water_requirement || ''}
              onChange={(e) => handleInputChange('water_requirement', e.target.value)}
            >
              <option value="">Не указано</option>
              {plantingMaterialFormConfig.waterRequirements.map(req => (
                <option key={req.value} value={req.value}>
                  {req.label}
                </option>
              ))}
            </select>
          </div>
        </Col>

        {/* Посевные характеристики */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-seedling-line me-2"></i>
              Посевные характеристики
            </h6>
          </div>
        </Col>

        {/* Норма высева */}
        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="plantingRateInput" className="form-label">Норма высева (кг/га)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="plantingRateInput"
              placeholder="150.5"
              step="0.1"
              min="0"
              value={plantingMaterial.planting_rate || ''}
              onChange={(e) => handleInputChange('planting_rate', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Глубина посева */}
        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="plantingDepthInput" className="form-label">Глубина посева (см)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="plantingDepthInput"
              placeholder="3.5"
              step="0.1"
              min="0"
              value={plantingMaterial.planting_depth || ''}
              onChange={(e) => handleInputChange('planting_depth', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Междурядье */}
        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="rowSpacingInput" className="form-label">Междурядье (см)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="rowSpacingInput"
              placeholder="15.0"
              step="0.1"
              min="0"
              value={plantingMaterial.row_spacing || ''}
              onChange={(e) => handleInputChange('row_spacing', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Расстояние между растениями */}
        <Col lg={3}>
          <div className="mb-3">
            <Label htmlFor="plantSpacingInput" className="form-label">Расстояние между растениями (см)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="plantSpacingInput"
              placeholder="5.0"
              step="0.1"
              min="0"
              value={plantingMaterial.plant_spacing || ''}
              onChange={(e) => handleInputChange('plant_spacing', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Требования к почве */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-landscape-line me-2"></i>
              Требования к почве
            </h6>
          </div>
        </Col>

        {/* pH диапазон */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="phMinInput" className="form-label">pH минимальный</Label>
            <Input 
              type="number" 
              className="form-control"
              id="phMinInput"
              placeholder="6.0"
              step="0.1"
              min="0"
              max="14"
              value={plantingMaterial.ph_range_min || ''}
              onChange={(e) => handleInputChange('ph_range_min', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="phMaxInput" className="form-label">pH максимальный</Label>
            <Input 
              type="number" 
              className="form-control"
              id="phMaxInput"
              placeholder="7.5"
              step="0.1"
              min="0"
              max="14"
              value={plantingMaterial.ph_range_max || ''}
              onChange={(e) => handleInputChange('ph_range_max', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Рекомендуемые типы почв */}
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">Рекомендуемые типы почв</Label>
            <div className="d-flex flex-wrap gap-2">
              {plantingMaterialFormConfig.soilTypes.map(soil => (
                <div key={soil.value} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`soil_${soil.value}`}
                    checked={Array.isArray(plantingMaterial.recommended_soil_types) 
                      ? plantingMaterial.recommended_soil_types.includes(soil.value) 
                      : false}
                    onChange={() => handleSoilTypeChange(soil.value)}
                  />
                  <Label className="form-check-label" htmlFor={`soil_${soil.value}`}>
                    {soil.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Устойчивость */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-shield-line me-2"></i>
              Устойчивость
            </h6>
          </div>
        </Col>

        {/* Морозостойкость */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="frostResistanceInput" className="form-label">Морозостойкость (1-10)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="frostResistanceInput"
              placeholder="5"
              min="1"
              max="10"
              value={plantingMaterial.frost_resistance || ''}
              onChange={(e) => handleInputChange('frost_resistance', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Засухоустойчивость */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="droughtToleranceInput" className="form-label">Засухоустойчивость (1-10)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="droughtToleranceInput"
              placeholder="7"
              min="1"
              max="10"
              value={plantingMaterial.drought_tolerance || ''}
              onChange={(e) => handleInputChange('drought_tolerance', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Срок хранения */}
        <Col lg={4}>
          <div className="mb-3">
            <Label htmlFor="shelfLifeInput" className="form-label">Срок хранения (месяцы)</Label>
            <Input 
              type="number" 
              className="form-control"
              id="shelfLifeInput"
              placeholder="24"
              min="1"
              max="120"
              value={plantingMaterial.shelf_life_months || ''}
              onChange={(e) => handleInputChange('shelf_life_months', parseInt(e.target.value) || undefined)}
            />
          </div>
        </Col>

        {/* Устойчивость к болезням */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="diseaseResistanceInput" className="form-label">Устойчивость к болезням</Label>
            <Input 
              type="text" 
              className="form-control"
              id="diseaseResistanceInput"
              placeholder="мучнистая роса, фитофтороз (через запятую)"
              value={Array.isArray(plantingMaterial.disease_resistance) 
                ? plantingMaterial.disease_resistance.join(', ') 
                : (plantingMaterial.disease_resistance || '')}
              onChange={(e) => handleArrayFieldChange('disease_resistance', e.target.value)}
            />
            <div className="form-text">Перечислите болезни через запятую</div>
          </div>
        </Col>

        {/* Устойчивость к вредителям */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="pestResistanceInput" className="form-label">Устойчивость к вредителям</Label>
            <Input 
              type="text" 
              className="form-control"
              id="pestResistanceInput"
              placeholder="тля, колорадский жук (через запятую)"
              value={Array.isArray(plantingMaterial.pest_resistance) 
                ? plantingMaterial.pest_resistance.join(', ') 
                : (plantingMaterial.pest_resistance || '')}
              onChange={(e) => handleArrayFieldChange('pest_resistance', e.target.value)}
            />
            <div className="form-text">Перечислите вредителей через запятую</div>
          </div>
        </Col>

        {/* Периоды */}
        <Col lg={12}>
          <div className="mb-4 mt-4">
            <h6 className="text-primary border-bottom pb-2 mb-3">
              <i className="ri-calendar-line me-2"></i>
              Периоды посева и сбора
            </h6>
          </div>
        </Col>

        {/* Период посева */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="plantingStartInput" className="form-label">Начало посева</Label>
            <Input 
              type="text" 
              className="form-control"
              id="plantingStartInput"
              placeholder="03-01 (ММ-ДД)"
              value={plantingMaterial.planting_period_start || ''}
              onChange={(e) => handleInputChange('planting_period_start', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="plantingEndInput" className="form-label">Окончание посева</Label>
            <Input 
              type="text" 
              className="form-control"
              id="plantingEndInput"
              placeholder="05-31 (ММ-ДД)"
              value={plantingMaterial.planting_period_end || ''}
              onChange={(e) => handleInputChange('planting_period_end', e.target.value)}
            />
          </div>
        </Col>

        {/* Период сбора */}
        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="harvestStartInput" className="form-label">Начало сбора</Label>
            <Input 
              type="text" 
              className="form-control"
              id="harvestStartInput"
              placeholder="08-01 (ММ-ДД)"
              value={plantingMaterial.harvest_period_start || ''}
              onChange={(e) => handleInputChange('harvest_period_start', e.target.value)}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <Label htmlFor="harvestEndInput" className="form-label">Окончание сбора</Label>
            <Input 
              type="text" 
              className="form-control"
              id="harvestEndInput"
              placeholder="09-30 (ММ-ДД)"
              value={plantingMaterial.harvest_period_end || ''}
              onChange={(e) => handleInputChange('harvest_period_end', e.target.value)}
            />
          </div>
        </Col>

        {/* Рекомендации по выращиванию */}
        <Col lg={12}>
          <div className="mb-3">
            <Label htmlFor="cultivationNotesTextarea" className="form-label">Рекомендации по выращиванию</Label>
            <textarea 
              className="form-control"
              id="cultivationNotesTextarea"
              rows={3} 
              placeholder="Особенности выращивания, рекомендации по уходу..."
              value={plantingMaterial.cultivation_notes || ''}
              onChange={(e) => handleInputChange('cultivation_notes', e.target.value)}
            />
          </div>
        </Col>

        {/* Требования к хранению */}
        <Col lg={12}>
          <div className="mb-3 pb-2">
            <Label htmlFor="storageRequirementsTextarea" className="form-label">Требования к хранению</Label>
            <textarea 
              className="form-control"
              id="storageRequirementsTextarea"
              rows={3} 
              placeholder="Условия хранения семян, температура, влажность..."
              value={plantingMaterial.storage_requirements || ''}
              onChange={(e) => handleInputChange('storage_requirements', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default RequisitesTab;