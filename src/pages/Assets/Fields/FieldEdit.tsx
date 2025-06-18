import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { ErrorToast } from '../../../components/Common/MessageToast/ErrorToast';
import { SuccessToast } from '../../../components/Common/MessageToast/SuccessToast';
import { EntityEditActions } from '../../../components/Common/DataManagement/EntityEditActions';
import { useFieldEdit } from './hooks/useFieldEdit';
import BasicInfoTab from './components/BasicInfoTab';
import RequisitesTab from './components/RequisitesTab';
import AdditionalTab from './components/AdditionalTab';

const FieldEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    
    const fieldId = id === 'new' ? undefined : (id ? parseInt(id) : undefined);
    const isNewField = id === 'new';
    
    const {
        field,
        isLoading,
        hasChanges,
        error,
        isSaving,
        isGenerating,
        updateField,
        saveChanges,
        resetField,
        generateTestData,
        clearError,
        saveErrorData,
        clearSaveError,
        handleSuccess
    } = useFieldEdit(fieldId);

    // Состояние валидации для всех табов
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [tabsWithErrors, setTabsWithErrors] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        console.log('🔍 saveErrorData изменилось:', saveErrorData);
    }, [saveErrorData]);

    document.title = isNewField 
        ? "Новое поле | Агро ПО"
        : `Редактирование: ${field?.field_name || 'Поле'} | Агро ПО`;

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

        if (!field) {
            errors.general = 'Нет данных для валидации';
            return { errors, tabErrors };
        }

        // Валидация обязательных полей (Таб 1 - Основная информация)
        if (!field.field_name?.trim()) {
            errors.field_name = 'Название поля обязательно';
            tabErrors['1'] = true;
        }

        if (!field.area_hectares || field.area_hectares <= 0) {
            errors.area_hectares = 'Площадь поля должна быть больше 0';
            tabErrors['1'] = true;
        }

        if (!field.soil_type) {
            errors.soil_type = 'Тип почвы обязателен';
            tabErrors['1'] = true;
        }

        // Валидация кода поля
        if (field.field_code && !/^[A-Za-z0-9\-_]*$/.test(field.field_code)) {
            errors.field_code = 'Код может содержать только буквы, цифры, дефисы и подчеркивания';
            tabErrors['1'] = true;
        }

        // Валидация кадастрового номера
        if (field.cadastral_number && !/^\d{2}:\d{2}:\d{7}:\d{1,4}$/.test(field.cadastral_number)) {
            errors.cadastral_number = 'Формат: XX:XX:XXXXXXX:XXXX (например: 50:21:0010305:44)';
            tabErrors['1'] = true;
        }

        // Валидация качества почвы
        if (field.soil_quality_score !== undefined && field.soil_quality_score !== null) {
            if (field.soil_quality_score < 1 || field.soil_quality_score > 10) {
                errors.soil_quality_score = 'Качество почвы должно быть от 1 до 10';
                tabErrors['2'] = true;
            }
        }

        // Валидация координат в location
        if (field.location && typeof field.location === 'object') {
            const { lat, lng } = field.location;
            if (lat !== undefined && (lat < -90 || lat > 90)) {
                errors.location_lat = 'Широта должна быть от -90 до 90';
                tabErrors['2'] = true;
            }
            if (lng !== undefined && (lng < -180 || lng > 180)) {
                errors.location_lng = 'Долгота должна быть от -180 до 180';
                tabErrors['2'] = true;
            }
        }

        // Валидация pH в soil_analysis
        if (field.soil_analysis && typeof field.soil_analysis === 'object') {
            const { ph } = field.soil_analysis;
            if (ph !== undefined && (ph < 0 || ph > 14)) {
                errors.soil_ph = 'pH должен быть от 0 до 14';
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
                console.log('🎉 Поле успешно сохранено!');
                // Очищаем ошибки валидации при успешном сохранении
                setValidationErrors({});
                setTabsWithErrors({});
                // Показываем успешное уведомление
                setSuccessToast({
                    message: 'Поле сохранено',
                    details: 'Данные поля успешно сохранены',
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
                navigate('/assets/fields');
            }
        } else {
            navigate('/assets/fields');
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
                        <p className="mt-2">Загрузка данных поля...</p>
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
                                    {isNewField ? 'Новое поле' : 'Редактирование поля'}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <a href="#" onClick={() => navigate('/assets/fields')}>
                                                Поля
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {isNewField ? 'Создание' : 'Редактирование'}
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
                                                <i className="ri-map-line"></i>
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
                                                <i className="ri-landscape-line"></i>
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
                                                field={field}
                                                updateField={updateField}
                                                validationErrors={validationErrors}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <RequisitesTab
                                                field={field}
                                                updateField={updateField}
                                                validationErrors={validationErrors}
                                            />
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <AdditionalTab
                                                field={field}
                                                updateField={updateField}
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
                                                onReset={resetField}
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

export default FieldEdit; 
