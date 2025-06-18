import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { ErrorToast } from '../../../components/Common/MessageToast/ErrorToast';
import { SuccessToast } from '../../../components/Common/MessageToast/SuccessToast';
import { EntityEditActions } from '../../../components/Common/DataManagement/EntityEditActions';
import { useEquipmentEdit } from './hooks/useEquipmentEdit';
import BasicInfoTab from './components/BasicInfoTab';
import RequisitesTab from './components/RequisitesTab';
import AdditionalTab from './components/AdditionalTab';

const EquipmentEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    
    const equipmentId = id === 'new' ? undefined : (id ? parseInt(id) : undefined);
    const isNewEquipment = id === 'new';
    
    const {
        equipment,
        isLoading,
        hasChanges,
        error,
        isSaving,
        isGenerating,
        updateEquipment,
        saveChanges,
        resetEquipment,
        generateTestData,
        clearError,
        saveErrorData,
        clearSaveError,
        handleSuccess
    } = useEquipmentEdit(equipmentId);

    // Состояние валидации для всех табов
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [tabsWithErrors, setTabsWithErrors] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        console.log('🔍 saveErrorData изменилось:', saveErrorData);
    }, [saveErrorData]);

    document.title = isNewEquipment 
        ? "Новая техника | Агро ПО"
        : `Редактирование: ${equipment?.name || 'Техника'} | Агро ПО`;

    const tabChange = (tab: string) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const [successToast, setSuccessToast] = useState<{
        message: string;
        details?: string;
        isVisible: boolean;
    } | null>(null);

    // Валидация всех полей
    const validateAllFields = () => {
        const errors: {[key: string]: string} = {};
        const tabErrors: {[key: string]: boolean} = {};

        if (!equipment) {
            errors.general = 'Нет данных для валидации';
            return { errors, tabErrors };
        }

        // Валидация обязательных полей (Таб 1 - Основная информация)
        if (!equipment.name?.trim()) {
            errors.name = 'Наименование техники обязательно';
            tabErrors['1'] = true;
        }

        if (!equipment.category) {
            errors.category = 'Категория техники обязательна';
            tabErrors['1'] = true;
        }

        // Валидация числовых полей (Таб 2 - Характеристики)
        if (equipment.engine_power !== undefined && equipment.engine_power !== null) {
            if (equipment.engine_power < 0 || equipment.engine_power > 9999.99) {
                errors.engine_power = 'Мощность двигателя должна быть от 0 до 9999.99 л.с.';
                tabErrors['2'] = true;
            }
        }

        if (equipment.fuel_consumption !== undefined && equipment.fuel_consumption !== null) {
            if (equipment.fuel_consumption < 0 || equipment.fuel_consumption > 9999.99) {
                errors.fuel_consumption = 'Расход топлива должен быть от 0 до 9999.99 л/ч';
                tabErrors['2'] = true;
            }
        }

        if (equipment.working_width !== undefined && equipment.working_width !== null) {
            if (equipment.working_width < 0 || equipment.working_width > 9999.99) {
                errors.working_width = 'Рабочая ширина должна быть от 0 до 9999.99 м';
                tabErrors['2'] = true;
            }
        }

        if (equipment.working_speed_min !== undefined && equipment.working_speed_max !== undefined &&
            equipment.working_speed_min !== null && equipment.working_speed_max !== null) {
            if (equipment.working_speed_min > equipment.working_speed_max) {
                errors.working_speed = 'Минимальная скорость не может быть больше максимальной';
                tabErrors['2'] = true;
            }
        }

        if (equipment.capacity !== undefined && equipment.capacity !== null) {
            if (equipment.capacity < 0 || equipment.capacity > 99999999.99) {
                errors.capacity = 'Производительность должна быть от 0 до 99999999.99 га/ч';
                tabErrors['2'] = true;
            }
        }

        // Валидация размеров
        if (equipment.length_mm !== undefined && equipment.length_mm !== null) {
            if (equipment.length_mm < 1 || equipment.length_mm > 99999999) {
                errors.length_mm = 'Длина должна быть от 1 до 99999999 мм';
                tabErrors['2'] = true;
            }
        }

        if (equipment.weight_kg !== undefined && equipment.weight_kg !== null) {
            if (equipment.weight_kg < 1 || equipment.weight_kg > 99999999) {
                errors.weight_kg = 'Вес должен быть от 1 до 99999999 кг';
                tabErrors['2'] = true;
            }
        }

        // Валидация экономических показателей
        if (equipment.purchase_price !== undefined && equipment.purchase_price !== null) {
            if (equipment.purchase_price < 0) {
                errors.purchase_price = 'Цена покупки не может быть отрицательной';
                tabErrors['2'] = true;
            }
        }

        if (equipment.depreciation_period_years !== undefined && equipment.depreciation_period_years !== null) {
            if (equipment.depreciation_period_years < 1 || equipment.depreciation_period_years > 50) {
                errors.depreciation_period_years = 'Срок амортизации должен быть от 1 до 50 лет';
                tabErrors['2'] = true;
            }
        }

        return { errors, tabErrors };
    };

    const handleSave = async () => {
        console.log('🔄 handleSave вызван');
        
        // Проводим валидацию перед сохранением
        const { errors, tabErrors } = validateAllFields();
        setValidationErrors(errors);
        setTabsWithErrors(tabErrors);

        if (Object.keys(errors).length > 0) {
            // Если есть ошибки валидации, показываем их
            const errorMessages = Object.entries(errors).map(([field, message]) => message);
            const tabsWithErrorsList = Object.keys(tabErrors).map(tabId => {
                const tabNames: {[key: string]: string} = {
                    '1': 'Основная информация',
                    '2': 'Характеристики',
                    '3': 'Дополнительная информация'
                };
                return tabNames[tabId] || `Таб ${tabId}`;
            });

            console.log('❌ Ошибки валидации:', errors);
            setSuccessToast({
                message: 'Ошибки валидации',
                details: `Проверьте данные на вкладках: ${tabsWithErrorsList.join(', ')}. ${errorMessages.join('. ')}`,
                isVisible: true
            });
            return;
        }

        try {
            console.log('📤 Вызываем saveChanges...');
            const success = await saveChanges();
            
            if (success) {
                console.log('🎉 Техника успешно сохранена!');
                // Очищаем ошибки валидации при успешном сохранении
                setValidationErrors({});
                setTabsWithErrors({});
                // Показываем успешное уведомление
                setSuccessToast({
                    message: 'Техника сохранена',
                    details: 'Данные техники успешно сохранены',
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
                navigate('/assets/equipment');
            }
        } else {
            navigate('/assets/equipment');
        }
    };

    if (isLoading) {
        return (
            <div className="page-content">
                <Container fluid>
                    <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                        <p className="mt-2">Загрузка данных техники...</p>
                    </div>
                </Container>
                
                <ErrorToast 
                    errorData={saveErrorData} 
                    onClose={clearSaveError} 
                />
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Хлебные крошки и заголовок */}
                    <Row>
                        <Col>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0">
                                    {isNewEquipment ? 'Новая техника' : 'Редактирование техники'}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <a href="#" onClick={() => navigate('/assets/equipment')}>
                                                Техника
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {isNewEquipment ? 'Создание' : 'Редактирование'}
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
                                                className={classnames({ 
                                                    active: activeTab === "1",
                                                    'text-danger': tabsWithErrors['1']
                                                })}
                                                onClick={() => tabChange("1")}>
                                                <i className="ri-settings-line"></i>
                                                Основная информация
                                                {tabsWithErrors['1'] && <i className="ri-error-warning-line ms-1 text-danger"></i>}
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ 
                                                    active: activeTab === "2",
                                                    'text-danger': tabsWithErrors['2']
                                                })}
                                                onClick={() => tabChange("2")}>
                                                <i className="ri-tools-line"></i>
                                                Характеристики
                                                {tabsWithErrors['2'] && <i className="ri-error-warning-line ms-1 text-danger"></i>}
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ 
                                                    active: activeTab === "3",
                                                    'text-danger': tabsWithErrors['3']
                                                })}
                                                onClick={() => tabChange("3")}>
                                                <i className="ri-star-line"></i>
                                                Дополнительно
                                                {tabsWithErrors['3'] && <i className="ri-error-warning-line ms-1 text-danger"></i>}
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <BasicInfoTab
                                                equipment={equipment}
                                                updateEquipment={updateEquipment}
                                                validationErrors={validationErrors}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <RequisitesTab
                                                equipment={equipment}
                                                updateEquipment={updateEquipment}
                                                validationErrors={validationErrors}
                                            />
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <AdditionalTab
                                                equipment={equipment}
                                                updateEquipment={updateEquipment}
                                                validationErrors={validationErrors}
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
                                                onReset={resetEquipment}
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

export default EquipmentEdit; 
