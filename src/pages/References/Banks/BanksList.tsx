import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import Table from '../../../components/Common/Table';
import { useNavigate } from 'react-router-dom';
import { useSyncData } from '../../../hooks/useSyncData';
import { 
  banksSyncConfig,
  banksColumns,
  tableConfig,
  type Bank
} from './config';

const BanksList: React.FC = () => {
  const navigate = useNavigate();
  
  // Используем useSyncData напрямую для полного контроля
  const {
    isInitialized,
    isLoading,
    error,
    loadTableData,
    sync,
    clearError
  } = useSyncData(banksSyncConfig, {
    autoInitialize: true,
    autoSync: false
  });

  const [banks, setBanks] = useState<Bank[]>([]);
  const [hasSynced, setHasSynced] = useState(false);

  // Загрузка данных из IndexedDB
  const loadBanks = async () => {
    if (!isInitialized) return;
    
    try {
      const data = await loadTableData('reference_banks');
      setBanks(data);
    } catch (error) {
      console.error('Ошибка загрузки банков:', error);
    }
  };

  // Первоначальная загрузка при инициализации
  useEffect(() => {
    if (isInitialized) {
      loadBanks();
    }
  }, [isInitialized]);

  // Синхронизация при готовности системы
  useEffect(() => {
    if (isInitialized && !hasSynced && !isLoading) {
      console.log('🔄 Система инициализирована, выполняем синхронизацию...');
      setHasSynced(true);
      
      sync().then(() => {
        console.log('✅ Синхронизация завершена');
        loadBanks(); // Перезагружаем данные после синхронизации
      }).catch((error) => {
        console.error('❌ Ошибка синхронизации:', error);
      });
    }
  }, [isInitialized, hasSynced, isLoading]);

  const handleRowClick = (record: Bank) => {
    console.log('🏦 Переход к редактированию банка:', record.name);
    navigate(`/references/banks/edit/${record.id}`);
  };

  const handleCreateNew = () => {
    console.log('🆕 Создание нового банка');
    navigate('/references/banks/edit/new');
  };

  const handleSync = async () => {
    try {
      await sync();
      await loadBanks();
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  };

  // Установка заголовка страницы
  document.title = "Справочник банков | Агро ПО";

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
                      <h5 className="card-title mb-0">Справочник банков</h5>
                      <div className="text-muted small">
                        {isLoading ? 'Загрузка...' : `Всего записей: ${banks.length}`}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleCreateNew}
                        disabled={isLoading}
                      >
                        <i className="ri-add-line me-1"></i>
                        Добавить банк
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
                        onClick={() => loadBanks()}
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
                    data={banks}
                    columns={banksColumns}
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

export default BanksList;