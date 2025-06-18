// src/pages/References/Counterparties/hooks/useSaveCounterparty.ts

import { useState } from 'react';
import { CounterpartyData, BankAccountData } from './useCounterpartyEdit';
import { UniversalSaveService } from '../../../../services/UniversalSaveService';
import { counterpartySaveDependencies } from '../config/syncConfig';
import {DEFAULT_API_BASE_URL} from '../../../../dataSync/index';
export interface UseSaveCounterpartyReturn {
  isSaving: boolean;
  saveChanges: (counterparty: CounterpartyData, bankAccounts: BankAccountData[]) => Promise<boolean>;
}

export const useSaveCounterparty = (): UseSaveCounterpartyReturn => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveService = new UniversalSaveService({
    apiBaseUrl: DEFAULT_API_BASE_URL,
    validateSchema: true,
    validateDependencies: true,
    stopOnError: true
  });

  const saveChanges = async (
    counterparty: CounterpartyData, 
    bankAccounts: BankAccountData[]
  ): Promise<boolean> => {
    
    setIsSaving(true);
    
    try {
      // Используем пошаговое сохранение
      return await saveService.saveEntityWithSteps(
        counterparty,
        bankAccounts,
        'reference_counterparties',
        'link_counterparties_bank_accounts',
        counterpartySaveDependencies
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