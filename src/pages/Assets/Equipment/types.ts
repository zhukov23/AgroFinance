export interface Equipment { /* Твой интерфейс Equipment */ }
export interface EquipmentType { /* Твой интерфейс EquipmentType */ }
export interface SoilType { /* Твой интерфейс SoilType */ }
export interface EquipmentSoilLink { /* Твой интерфейс EquipmentSoilLink */ }

export interface EquipmentType {
  id: number;
  type_name: string;
  type_code?: string;
  description?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SoilType {
  id: number;
  soil_name: string;
  soil_code?: string;
  description?: string;
  fertility_score?: number;
  ph_range?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface EquipmentSoilLink {
  id?: number;
  equipment_id: number;
  soil_type_id: number;
  created_at: string;
  updated_at: string;
}
