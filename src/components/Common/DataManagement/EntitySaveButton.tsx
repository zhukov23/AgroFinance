// src/components/common/DataManagement/EntitySaveButton.tsx

import React from 'react';

export interface EntitySaveButtonProps {
  onSave: () => Promise<void> | void;
  disabled?: boolean;
  isSaving?: boolean;
  hasChanges?: boolean;
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'success' | 'warning';
}

/**
 * Универсальная кнопка для сохранения сущностей
 */
export const EntitySaveButton: React.FC<EntitySaveButtonProps> = ({
  onSave,
  disabled = false,
  isSaving = false,
  hasChanges = true,
  children,
  className = '',
  variant = 'primary'
}) => {
  const handleClick = async () => {
    if (!disabled && !isSaving) {
      await onSave();
    }
  };

  const isDisabled = disabled || isSaving || !hasChanges;
  const buttonClass = `btn btn-${variant} ${className}`;

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {isSaving ? (
        <>
          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          Сохранение...
        </>
      ) : (
        children || 'Сохранить'
      )}
    </button>
  );
};