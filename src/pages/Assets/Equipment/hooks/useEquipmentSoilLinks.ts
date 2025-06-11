import { dbClient } from '../../../../dataSync/core/dbClient';
import { EquipmentSoilLink } from '../types';

export const useEquipmentSoilLinks = () => {
  const addSoilLink = async (equipmentId: number, soilTypeId: number): Promise<void> => {
    const link: EquipmentSoilLink = {
      id: Date.now(), // временный ID, заменить на серверный если есть
      equipment_id: equipmentId,
      soil_type_id: soilTypeId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await dbClient.insert('link_equipment_soil_types', link);
  };

  const removeSoilLink = async (linkId: number): Promise<void> => {
    await dbClient.deleteRecord('link_equipment_soil_types', linkId);
  };

  const getSoilLinksForEquipment = async (equipmentId: number): Promise<EquipmentSoilLink[]> => {
    const links = await dbClient.getTable('link_equipment_soil_types');
    return links.filter((link: EquipmentSoilLink) => link.equipment_id === equipmentId);
  };

  return {
    addSoilLink,
    removeSoilLink,
    getSoilLinksForEquipment
  };
};
