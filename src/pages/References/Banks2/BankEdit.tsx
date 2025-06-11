import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";

//import images
import avatar1 from '../../../assets/images/users/avatar-1.jpg';

const BankEdit = () => {
    document.title = "Profile Settings | Velzon - React Admin & Dashboard Template";

    const [activeTab, setActiveTab] = useState("1");

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
                                                Реквизиты
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
                                                    {/* Полное наименование */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="bankFullNameInput" className="form-label">
                                                                Полное наименование банка <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="bankFullNameInput"
                                                                placeholder="Публичное акционерное общество..." 
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Краткое наименование */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="bankShortNameInput" className="form-label">
                                                                Краткое наименование <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="bankShortNameInput"
                                                                placeholder="Сбербанк, ВТБ, Альфа-Банк" 
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Статус банка */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="bankStatusSelect" className="form-label">
                                                                Статус <span className="text-danger">*</span>
                                                            </Label>
                                                            <select className="form-select" id="bankStatusSelect">
                                                                <option value="">Выберите статус</option>
                                                                <option value="active">✅ Активный</option>
                                                                <option value="suspended">⚠️ Приостановлен</option>
                                                                <option value="inactive">❌ Неактивный</option>
                                                            </select>
                                                        </div>
                                                    </Col>

                                                    {/* Телефон */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="bankPhoneInput" className="form-label">Телефон</Label>
                                                            <Input 
                                                                type="tel" 
                                                                className="form-control" 
                                                                id="bankPhoneInput"
                                                                placeholder="+7 (495) 500-55-50"
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Email */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="bankEmailInput" className="form-label">Email</Label>
                                                            <Input 
                                                                type="email" 
                                                                className="form-control" 
                                                                id="bankEmailInput"
                                                                placeholder="info@bank.ru"
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Адрес */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="bankAddressInput" className="form-label">Адрес</Label>
                                                            <Input 
                                                                type="textarea" 
                                                                className="form-control" 
                                                                id="bankAddressInput"
                                                                placeholder="г. Москва, ул. Примерная, д. 1"
                                                                rows={3}
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                </Row>
                                            </Form>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <Form>
                                                <Row>
                                                    {/* БИК */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="bikInput" className="form-label">
                                                                БИК <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control font-monospace" 
                                                                id="bikInput"
                                                                placeholder="044525225"
                                                                maxLength={9}
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">Банковский идентификационный код (9 цифр)</div>
                                                        </div>
                                                    </Col>

                                                    {/* SWIFT код */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="swiftInput" className="form-label">SWIFT код</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control font-monospace" 
                                                                id="swiftInput"
                                                                placeholder="SABRRUMM"
                                                                maxLength={11}
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">Международный банковский код (8-11 символов)</div>
                                                        </div>
                                                    </Col>

                                                    {/* Корреспондентский счет */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="corrAccountInput" className="form-label">
                                                                Корреспондентский счет <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control font-monospace" 
                                                                id="corrAccountInput"
                                                                placeholder="30101810400000000225"
                                                                maxLength={20}
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">Корреспондентский счет в Банке России (20 цифр)</div>
                                                        </div>
                                                    </Col>

                                                    {/* Регистрационный номер */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="regNumberInput" className="form-label">Регистрационный номер</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="regNumberInput"
                                                                placeholder="1481"
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Номер лицензии */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="licenseNumberInput" className="form-label">Номер лицензии</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="licenseNumberInput"
                                                                placeholder="1481"
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Дата выдачи лицензии */}
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="licenseDateInput" className="form-label">Дата выдачи лицензии</Label>
                                                            <Input 
                                                                type="date" 
                                                                className="form-control" 
                                                                id="licenseDateInput"
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Регион ЦБ РФ */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="regionSelect" className="form-label">Территориальное учреждение Банка России</Label>
                                                            <select className="form-select" id="regionSelect">
                                                                <option value="">Выберите территориальное учреждение</option>
                                                                <option value="central">Центральный банк РФ (г. Москва)</option>
                                                                <option value="northwest">Северо-Западный банк (г. Санкт-Петербург)</option>
                                                                <option value="volga">Волго-Вятский банк (г. Нижний Новгород)</option>
                                                                <option value="southern">Южный банк (г. Краснодар)</option>
                                                                <option value="ural">Уральский банк (г. Екатеринбург)</option>
                                                                <option value="siberian">Сибирский банк (г. Новосибирск)</option>
                                                                <option value="far_east">Дальневосточный банк (г. Владивосток)</option>
                                                            </select>
                                                        </div>
                                                    </Col>

                                                </Row>
                                            </Form>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <Form>
                                                <Row>
                                                    {/* Веб-сайт */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="websiteInput" className="form-label">Веб-сайт</Label>
                                                            <Input 
                                                                type="url" 
                                                                className="form-control" 
                                                                id="websiteInput"
                                                                placeholder="https://www.bank.ru"
                                                                defaultValue="" 
                                                            />
                                                        </div>
                                                    </Col>

                                                    {/* Рейтинг */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="ratingSelect" className="form-label">Рейтинг банка</Label>
                                                            <select className="form-select" id="ratingSelect">
                                                                <option value="">Не указан</option>
                                                                <option value="excellent">⭐ Отличный</option>
                                                                <option value="good">✅ Хороший</option>
                                                                <option value="average">⚠️ Средний</option>
                                                                <option value="poor">❌ Плохой</option>
                                                            </select>
                                                        </div>
                                                    </Col>

                                                    {/* Активность */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label className="form-label">Активность</Label>
                                                            <div className="form-check form-switch form-check-md">
                                                                <Input 
                                                                    className="form-check-input" 
                                                                    type="checkbox" 
                                                                    id="isActiveSwitch"
                                                                    defaultChecked={true}
                                                                />
                                                                <Label className="form-check-label" htmlFor="isActiveSwitch">
                                                                    Банк активен
                                                                </Label>
                                                            </div>
                                                            <div className="form-text">Отключите, если банк больше не используется</div>
                                                        </div>
                                                    </Col>

                                                    {/* Уведомления */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label className="form-label">Уведомления</Label>
                                                            <div className="form-check form-switch form-check-md">
                                                                <Input 
                                                                    className="form-check-input" 
                                                                    type="checkbox" 
                                                                    id="notificationsSwitch"
                                                                    defaultChecked={false}
                                                                />
                                                                <Label className="form-check-label" htmlFor="notificationsSwitch">
                                                                    Получать уведомления об изменениях
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    {/* Примечания */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="notesTextarea" className="form-label">Примечания</Label>
                                                            <Input 
                                                                type="textarea" 
                                                                className="form-control" 
                                                                id="notesTextarea"
                                                                placeholder="Дополнительная информация о банке..."
                                                                rows={4}
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">Внутренние заметки, комментарии, особенности работы с банком</div>
                                                        </div>
                                                    </Col>

                                                    {/* Теги */}
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="tagsInput" className="form-label">Теги</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="tagsInput"
                                                                placeholder="основной, партнер, международный"
                                                                defaultValue="" 
                                                            />
                                                            <div className="form-text">Ключевые слова для поиска и группировки (через запятую)</div>
                                                        </div>
                                                    </Col>

                                                    {/* Дата создания и обновления (только для чтения) */}
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="createdAtInput" className="form-label">Дата создания</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="createdAtInput"
                                                                defaultValue="15.01.2020 09:30"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="updatedAtInput" className="form-label">Последнее обновление</Label>
                                                            <Input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="updatedAtInput"
                                                                defaultValue="20.05.2025 14:22"
                                                                readOnly
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

export default BankEdit;