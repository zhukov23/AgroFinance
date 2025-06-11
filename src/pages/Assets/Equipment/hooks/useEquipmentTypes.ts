import { useState, useEffect } from 'react';
import { dbClient } from '../../../../dataSync/core/dbClient';
import { EquipmentType } from '../types';

export const useEquipmentTypes = () => {
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEquipmentTypes = async () => {
    try {
      setLoading(true);
      await dbClient.init(['assets_equipment_types']);
      const types = await dbClient.getTable('assets_equipment_types');
      setEquipmentTypes(types);
    } catch (error) {
      console.error('Ошибка загрузки типов оборудования:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipmentTypes();
  }, []);

  return { equipmentTypes, loading, refresh: loadEquipmentTypes };
};
