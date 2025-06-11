
// Типы для ошибок
// В начале файла ErrorDisplay.tsx замени локальные типы на импорты:
import React, { useState } from 'react';
import { AlertTriangle, X, ExternalLink, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardHeader, CardBody } from 'reactstrap';
import { SaveErrorData, ValidationError, FailedOperation } from '../../../types/validation.types';
import { generateErrorReport } from '../../../utils/errorReporting.utils';

interface ErrorDisplayProps {
  errorData: SaveErrorData | null; // Изменить тип
  onClose: () => void;
}

// Компонент для отображения краткой ошибки
export const ErrorToast: React.FC<ErrorDisplayProps> = ({ errorData, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  if (!errorData || !errorData.failed?.length) {
    return null;
  }

  const totalErrors = errorData.failed.reduce(
    (sum, op) => sum + (op.validationErrors?.length || 0), 
    0
  );

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Добавить эту функцию:
const copyErrorsToClipboard = async () => {
  const errorReport = generateErrorReport(errorData!, errorData?.requestInfo);
  try {
    await navigator.clipboard.writeText(errorReport);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  } catch (err) {
    console.error('Не удалось скопировать в буфер обмена:', err);
  }
};

  return (
    <>
      {/* Alert Toast */}
      <Alert 
        color="danger" 
        isOpen={true} 
        toggle={onClose}
        className="position-fixed"
        style={{ 
          top: '20px', 
          right: '20px', 
          zIndex: 9999,
          maxWidth: '400px'
        }}
      >
        <h5 className="alert-heading">⚠️ Ошибка сохранения данных</h5>
        <p className="mb-2">
          Найдено {totalErrors} ошибок валидации в {errorData.failed.length} операциях.
        </p>
        <Button 
          color="danger" 
          size="sm" 
          outline
          onClick={toggleModal}
        >
          Подробнее об ошибках →
        </Button>
      </Alert>

      {/* Детальное модальное окно */}
      <Modal 
        isOpen={showModal} 
        toggle={toggleModal} 
        size="xl"
        scrollable
      >
        <ModalHeader toggle={toggleModal}>
          ⚠️ Детальная информация об ошибках
        </ModalHeader>
        <ModalBody>
          <Alert color="warning">
            <strong>Найдено:</strong> {errorData.failed.length} неудачных операций с {totalErrors} ошибками валидации
          </Alert>

          {errorData.failed.map((operation, index) => (
            <div key={operation.tempId} className="card mb-3">
              <div className="card-header bg-light">
                <h6 className="mb-0">
                  Операция {index + 1}: {operation.operation.toUpperCase()} → {operation.table}
                </h6>
                <small className="text-muted">ID: {operation.tempId}</small>
              </div>
              <div className="card-body">
                {operation.validationErrors?.map((error, errorIndex) => (
                  <Alert key={errorIndex} color="danger" className="mb-2">
                    <div className="d-flex align-items-start">
                      <span className="me-2">{getErrorIcon(error.error)}</span>
                      <div className="flex-grow-1">
                        <strong>Поле:</strong> <code>{error.field}</code><br/>
                        <strong>Ошибка:</strong> {error.message}<br/>
                        {error.expected && (
                          <><strong>Ожидается:</strong> <span className="text-success">{error.expected}</span><br/></>
                        )}
                        {error.received && (
                          <><strong>Получено:</strong> <span className="text-warning">{error.received}</span><br/></>
                        )}
                        {error.value !== undefined && (
                          <><strong>Значение:</strong> <code>{JSON.stringify(error.value)}</code></>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={copyErrorsToClipboard}>
            {copiedToClipboard ? '✅ Скопировано!' : '📋 Копировать отчет'}
          </Button>
          <Button color="primary" onClick={toggleModal}>
            Закрыть
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

// Вспомогательные функции
const getErrorIcon = (errorType: string) => {
  switch (errorType) {
    case 'FIELD_NOT_FOUND': return '🔍';
    case 'INVALID_TYPE': return '⚠️';
    case 'REQUIRED': return '❗';
    default: return '❌';
  }
};


// Модальное окно с детальной информацией об ошибках
const ErrorDetailsModal: React.FC<ErrorDisplayProps> = ({ errorData, onClose }) => {
  const [expandedOperations, setExpandedOperations] = useState<Set<string>>(new Set());
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const toggleOperation = (tempId: string) => {
    const newExpanded = new Set(expandedOperations);
    if (newExpanded.has(tempId)) {
      newExpanded.delete(tempId);
    } else {
      newExpanded.add(tempId);
    }
    setExpandedOperations(newExpanded);
  };

  const copyErrorsToClipboard = async () => {
    const errorReport = generateErrorReport(errorData!);
    try {
      await navigator.clipboard.writeText(errorReport);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Не удалось скопировать в буфер обмена:', err);
    }
  };

  const getErrorTypeColor = (errorType: string) => {
    switch (errorType) {
      case 'FIELD_NOT_FOUND': return 'text-purple-600 bg-purple-50';
      case 'INVALID_TYPE': return 'text-orange-600 bg-orange-50';
      case 'REQUIRED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case 'FIELD_NOT_FOUND': return '🔍';
      case 'INVALID_TYPE': return '⚠️';
      case 'REQUIRED': return '❗';
      default: return '❌';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-red-800">
                  Детальная информация об ошибках
                </h2>
                <p className="text-sm text-red-600">
                  {errorData?.failed.length} неудачных операций
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyErrorsToClipboard}
                className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Copy className="h-4 w-4 mr-1" />
                {copiedToClipboard ? 'Скопировано!' : 'Копировать отчет'}
              </button>
              <button
                onClick={onClose}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Содержимое */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {errorData?.failed.map((operation, opIndex) => (
            <div key={operation.tempId} className="mb-6 border border-gray-200 rounded-lg">
              {/* Заголовок операции */}
              <div 
                className="bg-gray-50 px-4 py-3 cursor-pointer border-b border-gray-200"
                onClick={() => toggleOperation(operation.tempId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {expandedOperations.has(operation.tempId) ? 
                      <ChevronDown className="h-4 w-4 text-gray-500 mr-2" /> :
                      <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
                    }
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {operation.operation.toUpperCase()} → {operation.table}
                      </h3>
                      <p className="text-xs text-gray-600">
                        ID: {operation.tempId} | Ошибок: {operation.validationErrors?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Шаг {operation.executionOrder}
                  </div>
                </div>
              </div>

              {/* Детали операции */}
              {expandedOperations.has(operation.tempId) && (
                <div className="p-4">
                  {/* Общая ошибка */}
                  {operation.error && operation.error !== 'Unknown error' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <h4 className="text-sm font-medium text-red-800 mb-1">Общая ошибка:</h4>
                      <p className="text-sm text-red-600">{operation.error}</p>
                    </div>
                  )}

                  {/* Ошибки валидации */}
                  {operation.validationErrors && operation.validationErrors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Ошибки валидации ({operation.validationErrors.length}):
                      </h4>
                      <div className="space-y-3">
                        {operation.validationErrors.map((error, errorIndex) => (
                          <div key={errorIndex} className="border border-gray-200 rounded p-3">
                            <div className="flex items-start">
                              <span className="text-lg mr-2">
                                {getErrorIcon(error.error)}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mr-2">
                                    {error.field}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded font-medium ${getErrorTypeColor(error.error)}`}>
                                    {error.error}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-2">
                                  {error.message}
                                </p>

                                {/* Дополнительная информация */}
                                <div className="text-xs text-gray-600 space-y-1">
                                  {error.value !== undefined && (
                                    <div>
                                      <span className="font-medium">Значение:</span>{' '}
                                      <code className="bg-gray-100 px-1 rounded">
                                        {typeof error.value === 'object' ? JSON.stringify(error.value) : String(error.value)}
                                      </code>
                                    </div>
                                  )}
                                  {error.expected && (
                                    <div>
                                      <span className="font-medium">Ожидается:</span>{' '}
                                      <code className="bg-green-100 px-1 rounded">{error.expected}</code>
                                    </div>
                                  )}
                                  {error.received && (
                                    <div>
                                      <span className="font-medium">Получено:</span>{' '}
                                      <code className="bg-red-100 px-1 rounded">{error.received}</code>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Футер с действиями */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 Совет: Скопируйте этот отчет и отправьте разработчикам для быстрого решения проблемы
            </div>
            <div className="flex space-x-3">
              <button
                onClick={copyErrorsToClipboard}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
              >
                Копировать отчет
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Пример использования
export const ErrorDisplayExample: React.FC = () => {
  const [errorData, setErrorData] = useState<SaveErrorData | null>(null);

  // Пример данных об ошибке (как от бэкенда)
  const exampleErrorData: SaveErrorData = {
    failed: [
      {
        error: "Unknown error",
        executionOrder: 1,
        operation: "create",
        table: "reference_counterparties",
        tempId: "temp_counterparty_1",
        validationErrors: [
          {
            error: "FIELD_NOT_FOUND",
            field: "full_name2",
            message: "Field 'full_name2' does not exist in table 'reference_counterparties'",
            value: "ООО «Агро-Партнер»"
          },
          {
            field: 'counterparty_type',
            error: 'INVALID_TYPE',
            expected: 'string',
            received: 'object',
            value: ['supplier', 'customer'],
            message: "Field 'counterparty_type' expected string, got object"
          },
          {
            field: 'vat_rate',
            error: 'INVALID_TYPE',
            expected: 'string',
            received: 'number',
            value: 20,
            message: "Field 'vat_rate' expected string, got number"
          },
          {
            field: 'payment_terms',
            error: 'INVALID_TYPE',
            expected: 'string',
            received: 'number',
            value: 30,
            message: "Field 'payment_terms' expected string, got number"
          },
          {
            field: 'full_name',
            error: 'REQUIRED',
            message: "Field 'full_name' is required"
          }
        ]
      }
    ]
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Демо системы ошибок</h1>
      
      <button
        onClick={() => setErrorData(exampleErrorData)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mb-4"
      >
        Показать пример ошибки
      </button>

      <ErrorToast 
        errorData={errorData} 
        onClose={() => setErrorData(null)} 
      />
    </div>
  );
};