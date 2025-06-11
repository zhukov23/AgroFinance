// src/pages/References/Counterparties/hooks/useBankAccountsManager.ts
// В начало файла добавь:
import { useCallback } from 'react';
import { useRelatedEntitiesManager } from '../../../../hooks/useRelatedEntitiesManager';
import { BankAccountData } from './useCounterpartyEdit';

/**
 * Специализированный хук для управления банковскими счетами контрагентов
 */
export const useBankAccountsManager = (counterpartyId?: number) => {
  const manager = useRelatedEntitiesManager<BankAccountData>({
    parentIdField: 'organization_id',
    defaultValues: {
      currency: 'RUB',
      is_active: true,
      purpose: 'main'
    }
  }, counterpartyId);

  const addBankAccount = useCallback((bankAccountData: Omit<BankAccountData, 'id' | 'organization_id'>) => {
    const entityData = {
      ...bankAccountData,
      organization_id: counterpartyId || 0
    } as Omit<BankAccountData, 'id' | 'parent_id'>;
    
    manager.addEntity(entityData);
  }, [manager, counterpartyId]);

  // Специальные свойства для банковских счетов
  const primaryBank = manager.getByField?.('is_primary', true);
  const additionalBanks = manager.filterByField?.('is_primary', false) || [];

  return {
    ...manager,
    // Переопределяем методы с правильными типами
    addBankAccount,
    primaryBank, // ← Добавляем это свойство
    additionalBanks, // ← Добавляем это свойство
    // Алиасы для совместимости
    bankAccounts: manager.entities,
    updateBankAccount: manager.updateEntity,
    removeBankAccount: manager.removeEntity,
    setPrimaryBank: manager.setPrimary!
  };
};