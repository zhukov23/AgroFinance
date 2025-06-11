import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { useSyncMonitor } from '../hooks/useSyncMonitor'; // Новый хук

const Footer = () => {
  const {
    activeSyncs,        // Активные синхронизации на странице
    hasActiveSyncs,     // Есть ли вообще синхронизации
    overallStatus,      // Общий статус (success/error/loading/idle)
    lastUpdateTime      // Время последнего обновления
  } = useSyncMonitor();

  // Не показываем статус если нет активных синхронизаций
  if (!hasActiveSyncs) {
    return (
      <footer className="footer">
        <Container fluid>
          <Row>
            <Col sm={6}>
              {new Date().getFullYear()} © Агро ПО.
            </Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                <small className="text-muted">v1.0.0</small>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }

  const getStatusDisplay = () => {
    switch (overallStatus) {
      case 'loading':
        return { icon: '🔄', text: 'Синхронизация данных...', color: '#fbbf24' };
      case 'error':
        return { icon: '❌', text: 'Ошибка синхронизации', color: '#ef4444' };
      case 'success':
        return { icon: '✅', text: 'Данные актуальны', color: '#10b981' };
      default:
        return { icon: '⏸️', text: 'Ожидание синхронизации', color: '#6b7280' };
    }
  };

  const status = getStatusDisplay();

  return (
    <footer className="footer">
      <Container fluid>
        <Row className="align-items-center">
          <Col sm={4}>
            © Дорф - АгроФинанс.
          </Col>
          
          {/* Компактный статус синхронизации */}
          <Col sm={4}>
            <div className="text-center">
              <button
                className="btn btn-sm p-1 border-0"
                style={{ 
                  backgroundColor: `${status.color}15`,
                  borderRadius: '20px'
                }}
                data-bs-toggle="collapse"
                data-bs-target="#syncDetails"
              >
                <div className="d-flex align-items-center px-2">
                  <span className="me-1">{status.icon}</span>
                  <span style={{ color: status.color, fontSize: '12px', fontWeight: '500' }}>
                    {status.text}
                  </span>
                  <span className="ms-1 text-muted" style={{ fontSize: '11px' }}>
                    ({activeSyncs.length})
                  </span>
                </div>
              </button>
            </div>
          </Col>

          <Col sm={4}>
            <div className="text-sm-end d-none d-sm-block">
              {lastUpdateTime && (
                <small className="text-muted">
                  {new Date().getFullYear()}
                </small>
              )}
            </div>
          </Col>
        </Row>

        {/* Раскрывающаяся детальная панель */}
        <Row>
          <Col>
            <div className="collapse mt-2" id="syncDetails">
              <div className="card card-body p-2" style={{ fontSize: '12px' }}>
                {activeSyncs.map(sync => (
                  <div key={sync.id} className="d-flex justify-content-between align-items-center py-1">
                    <span>
                      <strong>{sync.displayName || sync.tableName}</strong>
                    </span>
                    <span className={`badge bg-${sync.status === 'success' ? 'success' : sync.status === 'error' ? 'danger' : 'warning'}`}>
                      {sync.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;