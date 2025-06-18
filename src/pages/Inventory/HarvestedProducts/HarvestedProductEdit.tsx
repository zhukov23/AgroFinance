import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { ErrorToast } from '../../../components/Common/MessageToast/ErrorToast';
import { SuccessToast } from '../../../components/Common/MessageToast/SuccessToast';
import { EntityEditActions } from '../../../components/Common/DataManagement/EntityEditActions';
import { useHarvestedProductEdit } from './hooks/useHarvestedProductEdit';
import BasicInfoTab from './components/BasicInfoTab';
import RequisitesTab from './components/RequisitesTab';
import AdditionalTab from './components/AdditionalTab';

const HarvestedProductEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1");
    
    const productId = id === 'new' ? undefined : (id ? parseInt(id) : undefined);
    const isNewProduct = id === 'new';
    
    const {
        harvestedProduct,
        isLoading,
        hasChanges,
        error,
        isSaving,
        isGenerating,
        updateHarvestedProduct,
        saveChanges,
        resetHarvestedProduct,
        generateTestData,
        clearError,
        saveErrorData,
        clearSaveError,
        handleSuccess
    } = useHarvestedProductEdit(productId);

    // Состояние валидации для всех табов
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [tabsWithErrors, setTabsWithErrors] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        console.log('🔍 saveErrorData изменилось:', saveErrorData);
    }, [saveErrorData]);

    document.title = isNewProduct 
        ? "Новая урожайная продукция | Агро ПО"
        : `Редактирование: ${harvestedProduct?.product_name || 'Урожайная продукция'} | Агро ПО`;

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

        if (!harvestedProduct) {
            errors.general = 'Нет данных для валидации';
            return { errors, tabErrors };
        }

        // Валидация обязательных полей (Таб 1 - Основная информация)
        if (!harvestedProduct.product_name?.trim()) {
            errors.product_name = 'Наименование продукции обязательно';
            tabErrors['1'] = true;
        }

        if (!harvestedProduct.harvest_date) {
            errors.harvest_date = 'Дата сбора урожая обязательна';
            tabErrors['1'] = true;
        }

        if (!harvestedProduct.quantity || harvestedProduct.quantity <= 0) {
            errors.quantity = 'Количество должно быть больше 0';
            tabErrors['1'] = true;
        }

        // Валидация диапазонов (Таб 2 - Качество)
        if (harvestedProduct.moisture_content !== undefined && harvestedProduct.moisture_content !== null) {
            if (harvestedProduct.moisture_content < 0 || harvestedProduct.moisture_content > 100) {
                errors.moisture_content = 'Влажность должна быть от 0 до 100%';
                tabErrors['2'] = true;
            }
        }

        if (harvestedProduct.protein_content !== undefined && harvestedProduct.protein_content !== null) {
            if (harvestedProduct.protein_content < 0 || harvestedProduct.protein_content > 100) {
                errors.protein_content = 'Белок должен быть от 0 до 100%';
                tabErrors['2'] = true;
            }
        }

        if (harvestedProduct.oil_content !== undefined && harvestedProduct.oil_content !== null) {
            if (harvestedProduct.oil_content < 0 || harvestedProduct.oil_content > 100) {
                errors.oil_content = 'Масличность должна быть от 0 до 100%';
                tabErrors['2'] = true;
            }
        }

        if (harvestedProduct.impurities !== undefined && harvestedProduct.impurities !== null) {
            if (harvestedProduct.impurities < 0 || harvestedProduct.impurities > 100) {
                errors.impurities = 'Примеси должны быть от 0 до 100%';
                tabErrors['2'] = true;
            }
        }

        // Валидация экономических показателей (Таб 3 - Экономика)
        if (harvestedProduct.production_cost !== undefined && harvestedProduct.production_cost !== null) {
            if (harvestedProduct.production_cost < 0) {
                errors.production_cost = 'Себестоимость не может быть отрицательной';
                tabErrors['3'] = true;
            }
        }

        if (harvestedProduct.current_market_price !== undefined && harvestedProduct.current_market_price !== null) {
            if (harvestedProduct.current_market_price < 0) {
                errors.current_market_price = 'Цена не может быть отрицательной';
                tabErrors['3'] = true;
            }
        }

        // Валидация движения товара (Таб 4 - Движение)
        const totalQuantity = harvestedProduct.quantity || 0;
        const soldQuantity = harvestedProduct.quantity_sold || 0;
        const processedQuantity = harvestedProduct.quantity_processed || 0;
        const reservedQuantity = harvestedProduct.quantity_reserved || 0;
        const damagedQuantity = harvestedProduct.quantity_damaged || 0;

        const totalUsed = soldQuantity + processedQuantity + reservedQuantity + damagedQuantity;
        
        if (totalUsed > totalQuantity) {
            errors.quantity_movement = `Общее количество использованной продукции (${totalUsed.toFixed(3)} т) превышает общее количество (${totalQuantity.toFixed(3)} т)`;
            tabErrors['4'] = true;
        }

        // Валидация рейтинга (Таб 5 - Дополнительно)
        if (harvestedProduct.rating !== undefined && harvestedProduct.rating !== null) {
            if (harvestedProduct.rating < 1 || harvestedProduct.rating > 5) {
                errors.rating = 'Рейтинг должен быть от 1 до 5';
                tabErrors['5'] = true;
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
const tabNames = {
    '1': 'Основная информация',
    '2': 'Характеристики', 
    '3': 'Дополнительная информация'
} as const;
return tabNames[tabId as keyof typeof tabNames] || `Таб ${tabId}`;
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
                console.log('🎉 Урожайная продукция успешно сохранена!');
                // Очищаем ошибки валидации при успешном сохранении
                setValidationErrors({});
                setTabsWithErrors({});
                // Показываем успешное уведомление
                setSuccessToast({
                    message: 'Урожайная продукция сохранена',
                    details: 'Данные урожайной продукции успешно сохранены',
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
                navigate('/inventory/harvested-products');
            }
        } else {
            navigate('/inventory/harvested-products');
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
                        <p className="mt-2">Загрузка данных урожайной продукции...</p>
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
                                    {isNewProduct ? 'Новая урожайная продукция' : 'Редактирование урожайной продукции'}
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <a href="#" onClick={() => navigate('/inventory/harvested-products')}>
                                                Урожайная продукция
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {isNewProduct ? 'Создание' : 'Редактирование'}
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
           <i className="ri-plant-line"></i>
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
           <i className="ri-seedling-line"></i>
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
</Nav>                                </CardHeader>
                                
                                <CardBody className="p-4">
<TabContent activeTab={activeTab}>
   <TabPane tabId="1">
       <BasicInfoTab
           harvestedProduct={harvestedProduct}
           updateHarvestedProduct={updateHarvestedProduct}
           validationErrors={validationErrors}
       />
   </TabPane>
   <TabPane tabId="2">
       <RequisitesTab
           harvestedProduct={harvestedProduct}
           updateHarvestedProduct={updateHarvestedProduct}
           validationErrors={validationErrors}
       />
   </TabPane>
   <TabPane tabId="3">
       <AdditionalTab
           harvestedProduct={harvestedProduct}
           updateHarvestedProduct={updateHarvestedProduct}
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
                                                onReset={resetHarvestedProduct}
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

export default HarvestedProductEdit; 
