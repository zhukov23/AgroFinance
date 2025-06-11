import React, { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';
import { CheckCircle, X } from 'lucide-react';

export interface SuccessToastProps {
  message?: string;
  details?: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideDelay?: number; // Автоскрытие в миллисекундах
}

/**
 * Компонент для отображения уведомлений об успешных операциях
 */
export const SuccessToast: React.FC<SuccessToastProps> = ({
  message = 'Операция выполнена успешно',
  details,
  isVisible,
  onClose,
  autoHideDelay = 3000
}) => {
  const [show, setShow] = useState(isVisible);

  // Автоскрытие
  useEffect(() => {
    if (isVisible && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Даем время на анимацию
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDelay, onClose]);

  // Синхронизируем внешний isVisible с внутренним show
  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  if (!show) return null;

  return (
    <Alert 
      color="success" 
      isOpen={show} 
      toggle={() => {
        setShow(false);
        setTimeout(onClose, 300);
      }}
      className="position-fixed"
      style={{ 
        top: '20px', 
        right: '20px', 
        zIndex: 9999,
        maxWidth: '400px',
        minWidth: '300px'
      }}
    >
      <div className="d-flex align-items-start">
        <CheckCircle className="text-success me-2 mt-1" size={20} />
        <div className="flex-grow-1">
          <h6 className="alert-heading mb-1">✅ {message}</h6>
          {details && (
            <p className="mb-0 small text-success-emphasis">
              {details}
            </p>
          )}
        </div>
        <button
          type="button"
          className="btn-close btn-close-success"
          aria-label="Закрыть"
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
        />
      </div>
    </Alert>
  );
};

/**
 * Хук для управления успешными уведомлениями
 */
export const useSuccessToast = () => {
  const [successData, setSuccessData] = useState<{
    message: string;
    details?: string;
    isVisible: boolean;
  } | null>(null);

  const showSuccess = (message: string, details?: string) => {
    setSuccessData({
      message,
      details,
      isVisible: true
    });
  };

  const hideSuccess = () => {
    setSuccessData(null);
  };

  return {
    successData,
    showSuccess,
    hideSuccess
  };
};