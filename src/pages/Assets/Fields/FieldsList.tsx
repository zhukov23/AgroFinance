import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import Table from '../../../components/Common/Table';
import { useNavigate } from 'react-router-dom';
import { useSyncData } from '../../../hooks/useSyncData';
import { 
  fieldsSyncConfig,
  fieldsColumns,
  tableConfig,
  type Field
} from './config';

const FieldsList: React.FC = () => {
  const navigate = useNavigate();
  
  // Используем useSyncData напрямую для полного контроля
  const {
    isInitialized,
    isLoading,
    error,
    loadTableData,
    sync,
    clearError
  } = useSyncData(fieldsSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  const [fields, setFields] = useState<Field[]>([]);
  const [hasSynced, setHasSynced] = useState(false);

  // Загрузка данных из IndexedDB
  const loadFields = async () => {
    if (!isInitialized) return;
    
    try {
      const data = await loadTableData('assets_fields');
      setFields(data);
    } catch (error) {
      console.error('Ошибка загрузки полей:', error);
    }
  };

  // Первоначальная загрузка при инициализации
  useEffect(() => {
    if (isInitialized) {
      loadFields();
    }
  }, [isInitialized]);

  // Синхронизация при готовности системы
  useEffect(() => {
    if (isInitialized && !hasSynced && !isLoading) {
      console.log('🔄 Система инициализирована, выполняем синхронизацию...');
      setHasSynced(true);
      
      sync().then(() => {
        console.log('✅ Синхронизация завершена');
        loadFields(); // Перезагружаем данные после синхронизации
      }).catch((error) => {
        console.error('❌ Ошибка синхронизации:', error);
      });
    }
  }, [isInitialized, hasSynced, isLoading]);

  const handleRowClick = (record: Field) => {
    console.log('🌾 Переход к редактированию поля:', record.field_name);
    navigate(`/assets/fields/edit/${record.id}`);
  };

  const handleCreateNew = () => {
    console.log('🆕 Создание нового поля');
    navigate('/assets/fields/edit/new');
  };

  const handleSync = async () => {
    try {
      await sync();
      await loadFields();
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  };

  // Установка заголовка страницы
  document.title = "Справочник полей | Агро ПО";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title mb-0">Справочник сельскохозяйственных полей</h5>
                      <div className="text-muted small">
                        {isLoading ? 'Загрузка...' : `Всего полей: ${fields.length}`}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleCreateNew}
                        disabled={isLoading}
                      >
                        <i className="ri-add-line me-1"></i>
                        Добавить поле
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleSync}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Синхронизация...
                          </>
                        ) : (
                          <>
                            <i className="ri-refresh-line me-1"></i>
                            Синхронизировать
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => loadFields()}
                        disabled={isLoading}
                      >
                        <i className="ri-download-line me-1"></i>
                        Обновить
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {/* Отображение ошибок */}
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="ri-error-warning-line me-2"></i>
                      <div>
                        <strong>Ошибка:</strong> {error}
                        <button
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={clearError}
                        >
                          Закрыть
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Основная таблица */}
                  <Table
                    data={fields}
                    columns={fieldsColumns}
                    config={tableConfig}
                    isLoading={isLoading}
                    onRowClick={handleRowClick}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FieldsList; 
