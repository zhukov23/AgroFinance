// src/pages/References/Pesticides/PesticideEdit.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { ErrorToast } from '../../../components/Common/MessageToast/ErrorToast';
import { SuccessToast } from '../../../components/Common/MessageToast/SuccessToast';
import { EntityEditActions } from '../../../components/Common/DataManagement/EntityEditActions';
import { usePesticideEdit } from './hooks/usePesticideEdit';
import BasicInfoTab from './components/BasicInfoTab';
import RequisitesTab from './components/RequisitesTab';
import AdditionalTab from './components/AdditionalTab';

const PesticideEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    
    const pesticideId = id === 'new' ? undefined : (id ? parseInt(id) : undefined);
    const isNewPesticide = id === 'new';
    
    const {
        pesticide,
        isLoading,
        hasChanges,
        error,
        isSaving,
        isGenerating,
        updatePesticide,
        saveChanges,
        resetPesticide,
        generateTestData,
        clearError,
        saveErrorData,
        clearSaveError,
        handleSuccess
    } = usePesticideEdit(pesticideId);

    // Состояние валидации для всех табов
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [tabsWithErrors, setTabsWithErrors] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        console.log('🔍 saveErrorData изменилось:', saveErrorData);
    }, [saveErrorData]);

    document.title = isNewPesticide 
        ? "Новый пестицид | Агро ПО"
        : `Редактирование: ${pesticide?.name || 'Пестицид'} | Агро ПО`;

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

        if (!pesticide) {
            errors.general = 'Нет данных для валидации';
            return { errors, tabErrors };
        }

        // Валидация обязательных полей (Таб 1 - Основная информация)
        if (!pesticide.name?.trim()) {
            errors.name = 'Название препарата обязательно';
            tabErrors['1'] = true;
        } else if (pesticide.name.trim().length < 2) {
            errors.name = 'Название должно содержать минимум 2 символа';
            tabErrors['1'] = true;
        }

        if (!pesticide.pesticide_type) {
            errors.pesticide_type = 'Тип пестицида обязателен';
            tabErrors['1'] = true;
        }

        if (!pesticide.hazard_class) {
            errors.hazard_class = 'Класс опасности обязателен';
            tabErrors['1'] = true;
        }

        if (!pesticide.physical_form) {
            errors.physical_form = 'Физическая форма обязательна';
            tabErrors['1'] = true;
        }

        // Валидация активных веществ
        if (!pesticide.active_substances || !Array.isArray(pesticide.active_substances) || pesticide.active_substances.length === 0) {
            errors.active_substances = 'Необходимо указать хотя бы одно активное вещество';
            tabErrors['1'] = true;
        } else {
            // Проверяем заполнение каждого активного вещества
            const invalidSubstances = pesticide.active_substances.some((substance: any) => 
                !substance.substance?.trim() || !substance.concentration || substance.concentration <= 0
            );
            if (invalidSubstances) {
                errors.active_substances = 'Все активные вещества должны быть корректно заполнены';
                tabErrors['1'] = true;
            }
        }

        // Валидация регистрационного номера
        if (pesticide.registration_number && !/^[A-Za-z0-9\-]*$/.test(pesticide.registration_number)) {
            errors.registration_number = 'Номер может содержать только буквы, цифры и дефисы';
            tabErrors['1'] = true;
        }

        // Валидация цены
        if (pesticide.base_price !== undefined && pesticide.base_price !== null) {
            if (pesticide.base_price <= 0) {
                errors.base_price = 'Цена должна быть больше 0';
                tabErrors['3'] = true;
            }
        }

        // Валидация размера упаковки
        if (pesticide.package_size !== undefined && pesticide.package_size !== null) {
            if (pesticide.package_size <= 0) {
                errors.package_size = 'Размер упаковки должен быть больше 0';
                tabErrors['3'] = true;
            }
        }

        // Валидация срока годности
        if (pesticide.shelf_life_months !== undefined && pesticide.shelf_life_months !== null) {
            if (pesticide.shelf_life_months <= 0) {
                errors.shelf_life_months = 'Срок годности должен быть больше 0';
                tabErrors['3'] = true;
            }
        }

        // Валидация дат регистрации
        if (pesticide.registration_date && pesticide.expiry_date) {
            const regDate = new Date(pesticide.registration_date);
            const expDate = new Date(pesticide.expiry_date);
            if (expDate <= regDate) {
                errors.expiry_date = 'Дата истечения должна быть позже даты регистрации';
                tabErrors['3'] = true;
            }
        }

        // Валидация дозировки
        if (pesticide.dosage_info && typeof pesticide.dosage_info === 'object') {
            const { min_dose, max_dose } = pesticide.dosage_info;
            if (min_dose !== undefined && max_dose !== undefined && min_dose > max_dose) {
                errors.dosage_info = 'Минимальная доза не может быть больше максимальной';
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
                    '2': 'Применение',
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
                console.log('🎉 Пестицид успешно сохранен!');
                // Очищаем ошибки валидации при успешном сохранении
                setValidationErrors({});
                setTabsWithErrors({});
                // Показываем успешное уведомление
                setSuccessToast({
                    message: 'Пестицид сохранен',
                    details: 'Данные пестицида успешно сохранены',
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
                navigate('/references/pesticides');
            }
        } else {
            navigate('/references/pesticides');
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
                        <p className="mt-2">Загрузка данных пестицида...</p>
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
                                    {isNewPesticide ? 'Новый пестицид' : 'Редактирование пестицида'}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <a href="#" onClick={() => navigate('/references/pesticides')}>
                                                Пестициды
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {isNewPesticide ? 'Создание' : 'Редактирование'}
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
                                                <i className="ri-flask-line"></i>
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
                                                <i className="ri-plant-line"></i>
                                                Применение
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
                                                <i className="ri-more-line"></i>
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
                                                pesticide={pesticide}
                                                updatePesticide={updatePesticide}
                                                validationErrors={validationErrors}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <RequisitesTab
                                                pesticide={pesticide}
                                                updatePesticide={updatePesticide}
                                                validationErrors={validationErrors}
                                            />
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <AdditionalTab
                                                pesticide={pesticide}
                                                updatePesticide={updatePesticide}
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
                                                onReset={resetPesticide}
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

export default PesticideEdit;