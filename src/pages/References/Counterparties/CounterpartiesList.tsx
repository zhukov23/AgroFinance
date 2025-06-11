import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import Table from '../../../components/Common/Table';
import { useNavigate } from 'react-router-dom';
import { useSyncData } from '../../../hooks/useSyncData';
import { 
  counterpartiesSyncConfig,
  counterpartiesColumns,
  tableConfig,
  type Counterparty
} from './config';

const CounterpartiesList: React.FC = () => {
  const navigate = useNavigate();
  
  // Используем useSyncData напрямую для полного контроля
  const {
    isInitialized,
    isLoading,
    error,
    loadTableData,
    sync,
    clearError
  } = useSyncData(counterpartiesSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [hasSynced, setHasSynced] = useState(false);

  // Загрузка данных из IndexedDB
  const loadCounterparties = async () => {
    if (!isInitialized) return;
    
    try {
      const data = await loadTableData('reference_counterparties');
      setCounterparties(data);
    } catch (error) {
      console.error('Ошибка загрузки контрагентов:', error);
    }
  };

  // Первоначальная загрузка при инициализации
  useEffect(() => {
    if (isInitialized) {
      loadCounterparties();
    }
  }, [isInitialized]);

  // Синхронизация при готовности системы
  useEffect(() => {
    if (isInitialized && !hasSynced && !isLoading) {
      console.log('🔄 Система инициализирована, выполняем синхронизацию контрагентов...');
      setHasSynced(true);
      
      sync().then(() => {
        console.log('✅ Синхронизация контрагентов завершена');
        loadCounterparties(); // Перезагружаем данные после синхронизации
      }).catch((error) => {
        console.error('❌ Ошибка синхронизации контрагентов:', error);
      });
    }
  }, [isInitialized, hasSynced, isLoading]);
  // Загрузка данных из IndexedDB

  // Синхронизация с обновлением данных
  const handleSync = async () => {
    try {
      await sync();
      await loadCounterparties();
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  };

  // Обработчик клика по строке таблицы
  const handleRowClick = (record: Counterparty) => {
    console.log('📋 Переход к редактированию контрагента:', record.full_name);
    navigate(`/references/counterparties/edit/${record.id}`);
  };

  // Обработчик создания нового контрагента
  const handleCreateNew = () => {
    console.log('🆕 Создание нового контрагента');
    navigate('/references/counterparties/edit/new');
  };
  // Установка заголовка страницы
  document.title = "Справочник контрагентов | Агро ПО";

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
                      <h5 className="card-title mb-0">Справочник контрагентов</h5>
                      <div className="text-muted small">
                        {isLoading ? 'Загрузка...' : `Всего записей: ${counterparties.length}`}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleCreateNew}
                        disabled={isLoading}
                      >
                        <i className="ri-add-line me-1"></i>
                        Добавить контрагента
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
                        onClick={() => loadCounterparties()}
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
                    data={counterparties}
                    columns={counterpartiesColumns}
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

export default CounterpartiesList;