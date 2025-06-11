import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { useSoilTypes} from './hooks/useSoilTypes';
import { useEquipmentTypes } from './hooks/useEquipmentTypes';
 

//import images
import avatar1 from '../../../assets/images/users/avatar-1.jpg';

const EquipmentEdit = () => {
    document.title = "Profile Settings | Velzon - React Admin & Dashboard Template";

    const [activeTab, setActiveTab] = useState("1");
    const { equipmentTypes, loading } = useEquipmentTypes();
    const { soilTypes, loading: loadingSoilTypes } = useSoilTypes();


    const tabChange = (tab: any) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xxl={3}>
                            <Card>
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                            <img src={avatar1}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="user-profile" />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input id="profile-img-file-input" type="file"
                                                    className="profile-img-file-input" />
                                                <Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        <h5 className="fs-17 mb-1">Anna Adame</h5>
                                        <p className="text-muted mb-0">Lead Designer / Developer</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="d-flex align-items-center mb-5">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Complete Your Profile</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light text-primary fs-12"><i
                                                className="ri-edit-box-line align-bottom me-1"></i> Edit</Link>
                                        </div>
                                    </div>
                                    <div className="progress animated-progress custom-progress progress-label">
                                        <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "30%" }}>
                                            <div className="label">30%</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Portfolio</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light text-primary fs-12"><i
                                                className="ri-add-fill align-bottom me-1"></i> Add</Link>
                                        </div>
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-body text-body">
                                                <i className="ri-github-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="email" className="form-control" id="gitUsername" placeholder="Username"
                                            defaultValue="@daveadame" />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-primary">
                                                <i className="ri-global-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control" id="websiteInput"
                                            placeholder="www.example.com" defaultValue="www.velzon.com" />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-success">
                                                <i className="ri-dribbble-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control" id="dribbleName" placeholder="Username"
                                            defaultValue="@dave_adame" />
                                    </div>
                                    <div className="d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-danger">
                                                <i className="ri-pinterest-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control" id="pinterestName"
                                            placeholder="Username" defaultValue="Advance Dave" />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xxl={9}>
                            <Card>
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Основные данные
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button">
                                                <i className="far fa-user"></i>
                                                Характеристики
                                            </NavLink>
                                        </NavItem>
                                        <NavItem >
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "3" })}
                                                onClick={() => {
                                                    tabChange("3");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Дополнительно
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <Form>
                                                <Row>
                                                    {/* Наименование */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="nameInput" className="form-label">
                                                                Наименование оборудования <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="nameInput"
                                                                placeholder="Введите наименование оборудования" 
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Тип оборудования (FK) */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="equipmentTypeSelect" className="form-label">
                                                                Тип оборудования <span className="text-danger">*</span>
                                                            </Label>
                                                                <select className="form-select" id="equipmentTypeSelect" disabled={loading}>
                                                                <option value="">
                                                                    {loading ? 'Загрузка типов...' : 'Выберите тип оборудования'}
                                                                </option>
                                                                {equipmentTypes.map(type => (
                                                                    <option key={type.id} value={type.id}>
                                                                    {type.type_name}
                                                                    {type.type_code && ` (${type.type_code})`}
                                                                    </option>
                                                                ))}
                                                                </select>

                                                        </div>
                                                    </Col>

                                                    {/* Категория - убираем, берется из типа оборудования */}

                                                    {/* Производитель */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="manufacturerInput" className="form-label">
                                                                Производитель <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="manufacturerInput"
                                                                placeholder="John Deere, Claas, New Holland и т.д." 
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Модель */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="modelInput" className="form-label">
                                                                Модель <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="modelInput"
                                                                placeholder="Модель или серия" 
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Год выпуска */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="yearInput" className="form-label">
                                                                Год выпуска <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="yearInput"
                                                                placeholder="2020"
                                                                min="1950"
                                                                max="2030"
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Стоимость покупки */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="purchasePriceInput" className="form-label">
                                                                Стоимость покупки <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="purchasePriceInput"
                                                                placeholder="1500000"
                                                                step="0.01"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">Укажите стоимость в рублях</div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <Form>
                                                <Row>
                                                    {/* === ДВИГАТЕЛЬ === */}
                                                    <Col lg={12}>
                                                        <h6 className="mb-3 text-muted">🚗 Двигатель</h6>
                                                    </Col>

                                                    {/* Мощность двигателя */}
                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="enginePowerInput" className="form-label">Мощность</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="enginePowerInput"
                                                                placeholder="150"
                                                                step="0.1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">л.с.</div>
                                                        </div>
                                                    </Col>

                                                    {/* Объем двигателя */}
                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="engineVolumeInput" className="form-label">Объем</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="engineVolumeInput"
                                                                placeholder="4.5"
                                                                step="0.1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">литров</div>
                                                        </div>
                                                    </Col>

                                                    {/* Тип топлива */}
                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="fuelTypeSelect" className="form-label">Тип топлива</Label>
                                                            <select className="form-select" id="fuelTypeSelect">
                                                                <option value="">Выберите тип</option>
                                                                <option value="diesel">⛽ Дизель</option>
                                                                <option value="gasoline">⛽ Бензин</option>
                                                                <option value="electric">🔋 Электро</option>
                                                                <option value="hybrid">🔋⛽ Гибрид</option>
                                                                <option value="gas">🌿 Газ</option>
                                                            </select>
                                                        </div>
                                                    </Col>

                                                    {/* Расход топлива */}
                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="fuelConsumptionInput" className="form-label">Расход</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="fuelConsumptionInput"
                                                                placeholder="12.5"
                                                                step="0.1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">л/час</div>
                                                        </div>
                                                    </Col>

                                                    {/* === РАБОЧИЕ ПАРАМЕТРЫ === */}
                                                    <Col lg={12}>
                                                        <h6 className="mb-3 mt-4 text-muted">⚙️ Рабочие параметры</h6>
                                                    </Col>

                                                    {/* Рабочая ширина */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="workingWidthInput" className="form-label">Рабочая ширина</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="workingWidthInput"
                                                                placeholder="3.2"
                                                                step="0.1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">метров</div>
                                                        </div>
                                                    </Col>

                                                    {/* Минимальная скорость */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="workingSpeedMinInput" className="form-label">Скорость мин.</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="workingSpeedMinInput"
                                                                placeholder="5"
                                                                step="0.1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">км/час</div>
                                                        </div>
                                                    </Col>

                                                    {/* Максимальная скорость */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="workingSpeedMaxInput" className="form-label">Скорость макс.</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="workingSpeedMaxInput"
                                                                placeholder="12"
                                                                step="0.1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">км/час</div>
                                                        </div>
                                                    </Col>

                                                    {/* Объем/вместимость */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="capacityInput" className="form-label">Объем/Вместимость</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="capacityInput"
                                                                placeholder="5000"
                                                                step="1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">литров (для опрыскивателей, сеялок и т.д.)</div>
                                                        </div>
                                                    </Col>

                                                    {/* === ГАБАРИТЫ И ВЕС === */}
                                                    <Col lg={12}>
                                                        <h6 className="mb-3 mt-4 text-muted">📏 Габариты и вес</h6>
                                                    </Col>

                                                    {/* Длина */}
                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="lengthInput" className="form-label">Длина</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="lengthInput"
                                                                placeholder="8500"
                                                                step="1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">мм</div>
                                                        </div>
                                                    </Col>

                                                    {/* Ширина */}
                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="widthInput" className="form-label">Ширина</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="widthInput"
                                                                placeholder="2500"
                                                                step="1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">мм</div>
                                                        </div>
                                                    </Col>

                                                    {/* Высота */}
                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="heightInput" className="form-label">Высота</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="heightInput"
                                                                placeholder="3200"
                                                                step="1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">мм</div>
                                                        </div>
                                                    </Col>

                                                    {/* Вес */}
                                                    <Col lg={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="weightInput" className="form-label">Вес</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="weightInput"
                                                                placeholder="4500"
                                                                step="1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">кг</div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <Form>
                                                <Row>
                                                    {/* === ЭКОНОМИЧЕСКИЕ ПАРАМЕТРЫ === */}
                                                    <Col lg={12}>
                                                        <h6 className="mb-3 text-muted">💰 Экономические параметры</h6>
                                                    </Col>

                                                    {/* Срок амортизации */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="depreciationPeriodInput" className="form-label">Срок амортизации</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="depreciationPeriodInput"
                                                                placeholder="10"
                                                                min="1"
                                                                max="50"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">лет</div>
                                                        </div>
                                                    </Col>

                                                    {/* Стоимость обслуживания */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="maintenanceCostInput" className="form-label">Стоимость обслуживания</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="maintenanceCostInput"
                                                                placeholder="500"
                                                                step="0.01"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">руб/час</div>
                                                        </div>
                                                    </Col>

                                                    {/* === АГРОТЕХНИЧЕСКИЕ ПАРАМЕТРЫ === */}
                                                    <Col lg={12}>
                                                        <h6 className="mb-3 mt-4 text-muted">🌾 Агротехнические параметры</h6>
                                                    </Col>

                                                    {/* Подходящие культуры */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="suitableCropsInput" className="form-label">Подходящие культуры</Label>
                                                            <Input 
                                                                type="textarea" 
                                                                className="form-control" 
                                                                id="suitableCropsInput"
                                                                rows={3}
                                                                placeholder="пшеница, ячмень, рапс, подсолнечник..."
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">Укажите через запятую</div>
                                                        </div>
                                                    </Col>

                                                    {/* Типы почв */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label className="form-label">Типы почв</Label>
                                                            <div className="border rounded p-2" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                                {loadingSoilTypes ? (
                                                                    <div className="text-muted">Загрузка типов почв...</div>
                                                                ) : soilTypes.length === 0 ? (
                                                                    <div className="text-danger">Типы почв не найдены</div>
                                                                ) : (
                                                                    soilTypes.map(soil => (
                                                                        <div key={soil.id} className="form-check">
                                                                            <input 
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id={`soil-${soil.id}`}
                                                                                // checked={selectedSoilIds.includes(soil.id)} // TODO: добавить состояние
                                                                                // onChange={handleSoilChange} // TODO: добавить обработчик
                                                                            />
                                                                            <label className="form-check-label" htmlFor={`soil-${soil.id}`}>
                                                                                {soil.soil_name}
                                                                            </label>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                            <div className="form-text">Выберите подходящие типы почв</div>
                                                        </div>
                                                    </Col>

                                                    {/* Сезон использования */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="seasonUsageSelect" className="form-label">Сезон использования</Label>
                                                            <select className="form-select" id="seasonUsageSelect">
                                                                <option value="">Выберите сезон</option>
                                                                <option value="spring">🌱 Весна</option>
                                                                <option value="summer">☀️ Лето</option>
                                                                <option value="autumn">🍂 Осень</option>
                                                                <option value="winter">❄️ Зима</option>
                                                                <option value="year_round">🔄 Круглый год</option>
                                                                <option value="spring_summer">🌱☀️ Весна-Лето</option>
                                                                <option value="autumn_winter">🍂❄️ Осень-Зима</option>
                                                            </select>
                                                        </div>
                                                    </Col>

                                                    {/* Минимальный размер поля */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="minFieldSizeInput" className="form-label">Минимальный размер поля</Label>
                                                            <Input 
                                                                type="number" 
                                                                className="form-control" 
                                                                id="minFieldSizeInput"
                                                                placeholder="5"
                                                                step="0.1"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">гектаров</div>
                                                        </div>
                                                    </Col>

                                                    {/* === ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ === */}
                                                    <Col lg={12}>
                                                        <h6 className="mb-3 mt-4 text-muted">📝 Дополнительная информация</h6>
                                                    </Col>

                                                    {/* Код оборудования */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="equipmentCodeInput" className="form-label">Внутренний код</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="equipmentCodeInput"
                                                                placeholder="EQ-001"
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Подкатегория */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="subcategoryInput" className="form-label">Подкатегория</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="subcategoryInput"
                                                                placeholder="Универсальный, Специализированный..."
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Страна происхождения */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="countryOriginInput" className="form-label">Страна происхождения</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="countryOriginInput"
                                                                placeholder="Германия, США, Россия..."
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Описание */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="descriptionInput" className="form-label">Подробное описание</Label>
                                                            <Input 
                                                                type="textarea" 
                                                                className="form-control" 
                                                                id="descriptionInput"
                                                                rows={4}
                                                                placeholder="Подробное описание оборудования, особенности эксплуатации, рекомендации..."
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Сертификаты */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="certificationsInput" className="form-label">Сертификаты</Label>
                                                            <Input 
                                                                type="textarea" 
                                                                className="form-control" 
                                                                id="certificationsInput"
                                                                rows={3}
                                                                placeholder="CE, ISO 9001, ГОСТ..."
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">Укажите через запятую</div>
                                                        </div>
                                                    </Col>

                                                    {/* Навесное оборудование */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="attachmentsInput" className="form-label">Навесное оборудование</Label>
                                                            <Input 
                                                                type="textarea" 
                                                                className="form-control" 
                                                                id="attachmentsInput"
                                                                rows={3}
                                                                placeholder="Описание возможного навесного оборудования..."
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>

                                        </TabPane>

                                    </TabContent>
                                    {/* Кнопки управления */}
                                    <Col lg={12}>
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" className="btn btn-primary">
                                                <i className="ri-save-line align-bottom me-1"></i>
                                                Сохранить
                                            </button>
                                            <button type="button" className="btn btn-soft-success">
                                                <i className="ri-close-line align-bottom me-1"></i>
                                                Отмена
                                            </button>
                                            <button type="button" className="btn btn-soft-info">
                                                <i className="ri-file-download-line align-bottom me-1"></i>
                                                Экспорт
                                            </button>
                                        </div>
                                    </Col>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EquipmentEdit;