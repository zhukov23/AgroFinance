import { useState, useEffect } from 'react';
import { dbClient } from '../../../../dataSync/core/dbClient';
import { Equipment } from '../types';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await dbClient.getTable('assets_equipment');
      setEquipment(data);
    } catch (err) {
      setError('Ошибка загрузки техники');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEquipment(); }, []);

  return { equipment, loading, error, refresh: loadEquipment };
};
