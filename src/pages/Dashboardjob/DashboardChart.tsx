import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';

interface DashboardChartProps {
    seriesData: number;
    colors: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ seriesData, colors }) => {
    const series = [seriesData];
    
    const options: ApexOptions = {
        chart: {
            type: "radialBar" as const,
            width: 105,
            sparkline: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: "70%",
                },
                track: {
                    margin: 1,
                },
                dataLabels: {
                    show: true,
                    name: {
                        show: false,
                    },
                    value: {
                        show: true,
                        fontSize: "16px",
                        fontWeight: 600,
                        offsetY: 8,
                    },
                },
            },
        },
        colors: [colors],
    };

    return (
        <React.Fragment>
            <ReactApexChart 
                dir="ltr"
                options={options as any}
                series={series}
                type="radialBar"
                id="total_jobs"
                width="105"
                className="apex-charts"
            />
        </React.Fragment>
    );
};

export default DashboardChart;