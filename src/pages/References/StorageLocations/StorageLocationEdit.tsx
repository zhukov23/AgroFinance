import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { ErrorToast } from '../../../components/Common/MessageToast/ErrorToast';
import { SuccessToast } from '../../../components/Common/MessageToast/SuccessToast';
import { EntityEditActions } from '../../../components/Common/DataManagement/EntityEditActions';
import { useStorageLocationEdit } from './hooks/useStorageLocationEdit';
import BasicInfoTab from './components/BasicInfoTab';
import RequisitesTab from './components/RequisitesTab';
import AdditionalTab from './components/AdditionalTab';

const StorageLocationEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    
    const locationId = id === 'new' ? undefined : (id ? parseInt(id) : undefined);
    const isNewLocation = id === 'new';
    
    const {
        storageLocation,
        isLoading,
        hasChanges,
        error,
        isSaving,
        isGenerating,
        updateStorageLocation,
        saveChanges,
        resetStorageLocation,
        generateTestData,
        clearError,
        saveErrorData,
        clearSaveError,
        handleSuccess
    } = useStorageLocationEdit(locationId);

    useEffect(() => {
        console.log('🔍 saveErrorData изменилось:', saveErrorData);
    }, [saveErrorData]);

    document.title = isNewLocation 
        ? "Новое место хранения | Агро ПО"
        : `Редактирование: ${storageLocation?.name || 'Место хранения'} | Агро ПО`;

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
            storageLocation: !!storageLocation, 
            isLoading, 
            isSaving, 
            hasChanges 
        });
        
        try {
            console.log('📤 Вызываем saveChanges...');
            const success = await saveChanges();
            console.log('📥 Результат saveChanges:', success);
            
            if (success) {
                console.log('🎉 Место хранения успешно сохранено!');
                // Показываем успешное уведомление
                setSuccessToast({
                    message: 'Место хранения сохранено',
                    details: 'Данные места хранения успешно сохранены',
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
                navigate('/references/storage-locations');
            }
        } else {
            navigate('/references/storage-locations');
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
                        <p className="mt-2">Загрузка данных места хранения...</p>
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
                                    {isNewLocation ? 'Новое место хранения' : 'Редактирование места хранения'}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <a href="#" onClick={() => navigate('/references/storage-locations')}>
                                                Места хранения
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {isNewLocation ? 'Создание' : 'Редактирование'}
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
                                                <i className="ri-building-line"></i>
                                                Основные данные
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => tabChange("2")}>
                                                <i className="ri-stack-line"></i>
                                                Характеристики
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "3" })}
                                                onClick={() => tabChange("3")}>
                                                <i className="ri-star-line"></i>
                                                Дополнительно
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <BasicInfoTab
                                                storageLocation={storageLocation}
                                                updateStorageLocation={updateStorageLocation}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <RequisitesTab
                                                storageLocation={storageLocation}
                                                updateStorageLocation={updateStorageLocation}
                                            />
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <AdditionalTab
                                                storageLocation={storageLocation}
                                                updateStorageLocation={updateStorageLocation}
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
                                                onReset={resetStorageLocation}
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

export default StorageLocationEdit; 
