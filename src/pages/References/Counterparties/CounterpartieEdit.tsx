import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { ErrorToast } from '../../../components/Common/MessageToast/ErrorToast';
import { SuccessToast } from '../../../components/Common/MessageToast/SuccessToast';
import { EntityEditActions } from '../../../components/Common/DataManagement/EntityEditActions';
import { useCounterpartyEdit } from './hooks/useCounterpartyEdit';
import BasicInfoTab from './components/BasicInfoTab';
import RequisitesTab from './components/RequisitesTab';
import AdditionalTab from './components/AdditionalTab';

const CounterpartieEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    
    const counterpartyId = id === 'new' ? undefined : (id ? parseInt(id) : undefined);
    const isNewCounterparty = id === 'new';
    
    const {
        counterparty,
        primaryBank,
        additionalBanks,
        isLoading,
        hasChanges,
        error,
        isSaving,
        isGenerating,
        updateCounterparty,
        addBankAccount,
        updateBankAccount,
        removeBankAccount,
        setPrimaryBank,
        saveChanges,
        resetCounterparty,
        generateTestData,
        clearError,
        saveErrorData,
        clearSaveError,
        handleSuccess
    } = useCounterpartyEdit(counterpartyId);

    useEffect(() => {
        console.log('🔍 saveErrorData изменилось:', saveErrorData);
    }, [saveErrorData]);

    document.title = isNewCounterparty 
        ? "Новый контрагент | Агро ПО"
        : `Редактирование: ${counterparty?.full_name || 'Контрагент'} | Агро ПО`;

    const tabChange = (tab: string) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
const [successToast, setSuccessToast] = useState<{
    message: string;
    details?: string;
    isVisible: boolean;
} | null>(null);

    const handleSave = async () => {
    console.log('🔄 handleSave вызван');
    console.log('📊 Состояние:', { 
        counterparty: !!counterparty, 
        isLoading, 
        isSaving, 
        hasChanges 
    });
    
    try {
        console.log('📤 Вызываем saveChanges...');
        const success = await saveChanges();
        console.log('📥 Результат saveChanges:', success);
        
        if (success) {
            console.log('🎉 Контрагент успешно сохранен!');
            // Показываем успешное уведомление
                setSuccessToast({
        message: 'Контрагент сохранен',
        details: 'Данные контрагента и банковские счета успешно сохранены',
        isVisible: true
    });
        } else {
            console.log('❌ Сохранение не удалось');
        }
    } catch (error) {
        console.error('💥 Ошибка в handleSave:', error);
    }
};

    const handleCancel = () => {
        if (hasChanges) {
            if (window.confirm('У вас есть несохраненные изменения. Вы уверены, что хотите выйти?')) {
                navigate('/references/counterparties');
            }
        } else {
            navigate('/references/counterparties');
        }
    };

    if (isLoading) {
        console.log('🎨 Рендерим ErrorToast с данными:', saveErrorData);
        console.log('🎨 Тип saveErrorData:', typeof saveErrorData);
        console.log('🎨 saveErrorData?.failed?.length:', saveErrorData?.failed?.length);
        
        return (
            <div className="page-content">
                <Container fluid>
                    <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                        <p className="mt-2">Загрузка данных контрагента...</p>
                    </div>
                </Container>
                
                <ErrorToast 
                    errorData={saveErrorData} 
                    onClose={clearSaveError} 
                />
            </div>
        );
    }

    console.log('🎨 Основной рендер ErrorToast с данными:', saveErrorData);
    
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Хлебные крошки и заголовок */}
                    <Row>
                        <Col>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0">
                                    {isNewCounterparty ? 'Новый контрагент' : 'Редактирование контрагента'}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <a href="#" onClick={() => navigate('/references/counterparties')}>
                                                Контрагенты
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {isNewCounterparty ? 'Создание' : 'Редактирование'}
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Ошибки */}
                    {error && (
                        <Row>
                            <Col>
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <i className="ri-error-warning-line me-2"></i>
                                    <div>
                                        <strong>Ошибка:</strong> {error}
                                        <button className="btn btn-sm btn-outline-danger ms-2" onClick={clearError}>
                                            Закрыть
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}

                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => tabChange("1")}>
                                                <i className="fas fa-home"></i>
                                                Основные данные
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => tabChange("2")}>
                                                <i className="far fa-user"></i>
                                                Реквизиты
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "3" })}
                                                onClick={() => tabChange("3")}>
                                                <i className="far fa-envelope"></i>
                                                Дополнительно
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <BasicInfoTab
                                                counterparty={counterparty}
                                                updateCounterparty={updateCounterparty}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <RequisitesTab
                                                counterparty={counterparty}
                                                primaryBank={primaryBank}
                                                additionalBanks={additionalBanks}
                                                updateCounterparty={updateCounterparty}
                                                addBankAccount={addBankAccount}
                                                updateBankAccount={updateBankAccount}
                                                removeBankAccount={removeBankAccount}
                                                setPrimaryBank={setPrimaryBank}
                                            />
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <AdditionalTab
                                                counterparty={counterparty}
                                                updateCounterparty={updateCounterparty}
                                            />
                                        </TabPane>
                                    </TabContent>
                                    
                                    {/* Универсальные кнопки управления */}
                                    <Row>
                                        <Col lg={12}>
                                            <EntityEditActions
                                                onSave={handleSave}
                                                isSaving={isSaving}
                                                hasChanges={hasChanges}
                                                onReset={resetCounterparty}
                                                onGenerateTestData={generateTestData}
                                                isGenerating={isGenerating}
                                                onCancel={handleCancel}
                                                disabled={isLoading}
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            
            <ErrorToast 
                errorData={saveErrorData} 
                onClose={clearSaveError} 
            />
<SuccessToast 
    message={successToast?.message || ''}
    details={successToast?.details}
    isVisible={successToast?.isVisible || false}
    onClose={() => setSuccessToast(null)}
/>
        </React.Fragment>
    );
};

export default CounterpartieEdit;

