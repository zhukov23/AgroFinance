 import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { ErrorToast } from '../../../components/Common/MessageToast/ErrorToast';
import { SuccessToast } from '../../../components/Common/MessageToast/SuccessToast';
import { EntityEditActions } from '../../../components/Common/DataManagement/EntityEditActions';
import { usePlantingMaterialEdit } from './hooks/usePlantingMaterialEdit';
import BasicInfoTab from './components/BasicInfoTab';
import RequisitesTab from './components/RequisitesTab';
import AdditionalTab from './components/AdditionalTab';

const PlantingMaterialEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    
    const materialId = id === 'new' ? undefined : (id ? parseInt(id) : undefined);
    const isNewMaterial = id === 'new';
    
    const {
        plantingMaterial,
        isLoading,
        hasChanges,
        error,
        isSaving,
        isGenerating,
        updatePlantingMaterial,
        saveChanges,
        resetPlantingMaterial,
        generateTestData,
        clearError,
        saveErrorData,
        clearSaveError,
        handleSuccess
    } = usePlantingMaterialEdit(materialId);

    useEffect(() => {
        console.log('🔍 saveErrorData изменилось:', saveErrorData);
    }, [saveErrorData]);

    document.title = isNewMaterial 
        ? "Новый посевной материал | Агро ПО"
        : `Редактирование: ${plantingMaterial?.name || 'Посевной материал'} | Агро ПО`;

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
            plantingMaterial: !!plantingMaterial, 
            isLoading, 
            isSaving, 
            hasChanges 
        });
        
        try {
            console.log('📤 Вызываем saveChanges...');
            const success = await saveChanges();
            console.log('📥 Результат saveChanges:', success);
            
            if (success) {
                console.log('🎉 Посевной материал успешно сохранен!');
                // Показываем успешное уведомление
                setSuccessToast({
                    message: 'Посевной материал сохранен',
                    details: 'Данные посевного материала успешно сохранены',
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
                navigate('/references/planting-materials');
            }
        } else {
            navigate('/references/planting-materials');
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
                        <p className="mt-2">Загрузка данных посевного материала...</p>
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
                                    {isNewMaterial ? 'Новый посевной материал' : 'Редактирование посевного материала'}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <a href="#" onClick={() => navigate('/references/planting-materials')}>
                                                Посевной материал
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {isNewMaterial ? 'Создание' : 'Редактирование'}
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
                                                <i className="ri-plant-line"></i>
                                                Основные данные
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => tabChange("2")}>
                                                <i className="ri-seedling-line"></i>
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
                                                plantingMaterial={plantingMaterial}
                                                updatePlantingMaterial={updatePlantingMaterial}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <RequisitesTab
                                                plantingMaterial={plantingMaterial}
                                                updatePlantingMaterial={updatePlantingMaterial}
                                            />
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <AdditionalTab
                                                plantingMaterial={plantingMaterial}
                                                updatePlantingMaterial={updatePlantingMaterial}
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
                                                onReset={resetPlantingMaterial}
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

export default PlantingMaterialEdit;
