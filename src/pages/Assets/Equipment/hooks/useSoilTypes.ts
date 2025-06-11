import { useState, useEffect } from 'react';
import { dbClient } from '../../../../dataSync/core/dbClient';
import { SoilType } from '../types';

export const useSoilTypes = () => {
  const [soilTypes, setSoilTypes] = useState<SoilType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSoilTypes = async () => {
    try {
      setLoading(true);
      await dbClient.init(['reference_soil_types']);
      const types = await dbClient.getTable('reference_soil_types');
      setSoilTypes(types);
    } catch (error) {
      console.error('Ошибка загрузки типов почв:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoilTypes();
  }, []);

  return { soilTypes, loading, refresh: loadSoilTypes };
};
