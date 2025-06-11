// src/components/common/DataManagement/TestDataButton.tsx

import React from 'react';

export interface TestDataButtonProps {
  onGenerate: () => Promise<void> | void;
  disabled?: boolean;
  isGenerating?: boolean;
  hasChanges?: boolean;
  confirmMessage?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: string;
}

/**
 * Универсальная кнопка для генерации тестовых данных
 */
export const TestDataButton: React.FC<TestDataButtonProps> = ({
  onGenerate,
  disabled = false,
  isGenerating = false,
  hasChanges = false,
  confirmMessage = 'Форма содержит изменения. Заменить данные сгенерированными?',
  children,
  className = '',
  icon = 'ri-magic-line'
}) => {
  const handleClick = async () => {
    if (disabled || isGenerating) return;

    // Подтверждение при наличии изменений
    if (hasChanges) {
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    
    await onGenerate();
  };

  const isDisabled = disabled || isGenerating;
  const buttonClass = `btn btn-soft-info ${className}`;

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {isGenerating ? (
        <>
          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          Генерация...
        </>
      ) : (
        <>
          <i className={`${icon} align-bottom me-1`}></i>
          {children || '🎯 Тестовые данные'}
        </>
      )}
    </button>
  );
};