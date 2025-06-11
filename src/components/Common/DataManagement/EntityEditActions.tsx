// src/components/common/DataManagement/EntityEditActions.tsx

import React from 'react';
import { EntitySaveButton } from './EntitySaveButton';
import { TestDataButton } from './TestDataButton';

export interface EntityEditActionsProps {
  // Сохранение
  onSave: () => Promise<void> | void;
  isSaving?: boolean;
  hasChanges?: boolean;
  
  // Сброс изменений
  onReset?: () => void;
  
  // Тестовые данные
  onGenerateTestData?: () => Promise<void> | void;
  isGenerating?: boolean;
  
  // Отмена/закрытие
  onCancel?: () => void;
  
  // Общие настройки
  disabled?: boolean;
  className?: string;
  
  // Настройки отображения
  showSave?: boolean;
  showReset?: boolean;
  showTestData?: boolean;
  showCancel?: boolean;
}

/**
 * Универсальный компонент для кнопок управления редактированием сущности
 */
export const EntityEditActions: React.FC<EntityEditActionsProps> = ({
  onSave,
  isSaving = false,
  hasChanges = false,
  onReset,
  onGenerateTestData,
  isGenerating = false,
  onCancel,
  disabled = false,
  className = '',
  showSave = true,
  showReset = true,
  showTestData = true,
  showCancel = true
}) => {
  return (
    <div className={`hstack gap-2 justify-content-end mt-4 ${className}`}>
      {/* Кнопка сохранения */}
      {showSave && (
        <EntitySaveButton
          onSave={onSave}
          isSaving={isSaving}
          hasChanges={hasChanges}
          disabled={disabled}
        />
      )}
      
      {/* Кнопка сброса изменений */}
      {showReset && hasChanges && onReset && (
        <button 
          type="button" 
          className="btn btn-soft-warning"
          onClick={onReset}
          disabled={disabled || isSaving}
        >
          <i className="ri-refresh-line align-bottom me-1"></i>
          Сбросить
        </button>
      )}
      
      {/* Кнопка генерации тестовых данных */}
      {showTestData && onGenerateTestData && (
        <TestDataButton
          onGenerate={onGenerateTestData}
          isGenerating={isGenerating}
          hasChanges={hasChanges}
          disabled={disabled || isSaving}
        />
      )}
      
      {/* Кнопка отмены */}
      {showCancel && onCancel && (
        <button 
          type="button" 
          className="btn btn-soft-secondary"
          onClick={onCancel}
          disabled={disabled || isSaving}
        >
          <i className="ri-close-line align-bottom me-1"></i>
          Отмена
        </button>
      )}
    </div>
  );
};