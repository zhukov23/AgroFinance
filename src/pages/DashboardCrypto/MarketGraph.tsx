import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { MarkerCharts } from './DashboardCryptoCharts';
import { useSelector, useDispatch } from "react-redux";
import { getMarketChartsData } from '../../slices/thunks';
import { createSelector } from 'reselect';

const MarketGraph = () => {
    const dispatch = useDispatch<any>();

    const [chartData, setchartData] = useState<any>([]);

    const marketgraphData = createSelector(
        (state: any) => state.DashboardCrypto,
        (marketData) => marketData.marketData
    );
    // Inside your component
    const marketData = useSelector(marketgraphData);

    useEffect(() => {
        setchartData(marketData);
    }, [marketData]);

    const onChangeChartPeriod = (pType: any) => {
        dispatch(getMarketChartsData(pType));
    };

    useEffect(() => {
        dispatch(getMarketChartsData("all"));
    }, [dispatch]);
    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader className="border-0 align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">Market Graph</h4>
                            <div className="d-flex gap-1">
                                <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("hour"); }}>
                                    1H
                                </button>
                                <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("week"); }}>
                                    7D
                                </button>
                                <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("month"); }}>
                                    1M
                                </button>
                                <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("year"); }}>
                                    1Y
                                </button>
                                <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => { onChangeChartPeriod("all"); }}>
                                    ALL
                                </button>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0">
                            <div className="bg-light-subtle border-top-dashed border border-start-0 border-end-0 border-bottom-dashed py-3 px-4">
                                <Row className="align-items-center">
                                    <Col xs={6}>
                                        <div className="d-flex flex-wrap gap-4 align-items-center">
                                            <h5 className="fs-19 mb-0">0.014756</h5>
                                            <p className="fw-medium text-muted mb-0">$75.69 <span className="text-success fs-13 ms-1">+1.99%</span></p>
                                            <p className="fw-medium text-muted mb-0">High <span className="text-body fs-13 ms-1">0.014578</span></p>
                                            <p className="fw-medium text-muted mb-0">Low <span className="text-body fs-13 ms-1">0.0175489</span></p>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-end text-end flex-wrap gap-4 ms-auto">
                                                <div className="pe-3">
                                                    <h6 className="mb-2 text-truncate text-muted">Total Balance</h6>
                                                    <h5 className="mb-0">$72.8k</h5>

                                                </div>
                                                <div className="pe-3">
                                                    <h6 className="mb-2 text-muted">Profit</h6>
                                                    <h5 className="text-success mb-0">+$49.7k</h5>
                                                </div>
                                                <div className="pe-3">
                                                    <h6 className="mb-2 text-muted">Loss</h6>
                                                    <h5 className="text-danger mb-0">-$23.1k</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                        <div className="card-body p-0 pb-3">
                            <div id="Market_chart" className="apex-charts" dir="ltr">
                                <MarkerCharts series={chartData} dataColors='["--vz-success", "--vz-danger"]' />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default MarketGraph;