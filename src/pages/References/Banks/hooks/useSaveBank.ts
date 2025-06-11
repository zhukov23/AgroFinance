// src/pages/References/Banks/hooks/useSaveBank.ts

import { useState } from 'react';
import { BankData } from './useBankEdit';
import { UniversalSaveService } from '../../../../services/UniversalSaveService';
import { bankSaveDependencies } from '../config/syncConfig';

export interface UseSaveBankReturn {
  isSaving: boolean;
  saveChanges: (bank: BankData) => Promise<boolean>;
}

export const useSaveBank = (): UseSaveBankReturn => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveService = new UniversalSaveService({
    apiBaseUrl: 'http://localhost:3000',
    validateSchema: true,
    validateDependencies: true,
    stopOnError: true
  });

  const saveChanges = async (bank: BankData): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      // Для банков используем простое сохранение без связанных таблиц
      return await saveService.saveEntity(
        bank,
        'reference_banks'
      );
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveChanges
  };
};