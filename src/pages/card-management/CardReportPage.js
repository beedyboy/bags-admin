import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useCardReport, useCardsActivitiesReport } from "../../hooks/useCard";
import { getPermissions } from "../../helpers/permissions";
import NoAccess from "../../widgets/NoAccess";
import { cardStats } from "../../shared/card";

const CardReportPage = () => {
    const { canReport } = getPermissions("card");
    const [activityType, setActivityType] = useState(null); 

    const [filters, setFilters] = useState({
        dateRange: null,
        transactionType: null,
    });

    const {
        data: reportData = {
            activeCards: 0,
            inactiveCards: 0,
            totalFundsLoaded: 0,
            totalFundsSpent: 0,
            totalFundsRemaining: 0,
            activityTrends: {},
        },
        isLoading,
        error,
    } = useCardReport(filters);

    const { data: transactionData } = useCardsActivitiesReport(filters);

    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    };    

    const activityTrends = {
        // labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        // datasets: [
        //     {
        //         label: "Funds Loaded",
        //         data: [100000, 120000, 150000, 130000],
        //         borderColor: "#42A5F5",
        //         backgroundColor: "rgba(66,165,245,0.2)",
        //         fill: true,
        //         tension: 0.4,
        //     },
        //     {
        //         label: "Funds Spent",
        //         data: [80000, 90000, 110000, 100000],
        //         borderColor: "#FFA726",
        //         backgroundColor: "rgba(255,167,38,0.2)",
        //         fill: true,
        //         tension: 0.4,
        //     },
        // ],
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Dataset 1",
                fill: false,
                borderColor: "blue",
                yAxisID: "y",
                tension: 0.4,
                data: [65, 59, 80, 81, 56, 55, 10],
            },
            {
                label: "Dataset 2",
                fill: false,
                borderColor: "green",
                yAxisID: "y1",
                tension: 0.4,
                data: [28, 48, 40, 19, 86, 27, 90],
            },
        ],
    };

    const dt = React.useRef(null);

    const activityTypes = [
        { label: "Load", value: "load" },
        { label: "Fund Request", value: "fund_request" },
        { label: "Purchase", value: "purchase" },
    ];

    const chartOptions = {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: "green",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "blue",
                },
                grid: {
                    color: "red",
                },
            },
            y: {
                type: "linear",
                display: true,
                position: "left",
                ticks: {
                    color: "blue",
                },
                grid: {
                    color: "red",
                },
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                ticks: {
                    color: "yellow",
                },
                grid: {
                    drawOnChartArea: false,
                    color: "red",
                },
            },
        },
    };

    if (!canReport) {
        return <NoAccess page="report" />;
    }
    return (
        <div className="p-m-4">
            <h2 className="p-text-center">Card Insights and Reports</h2>
            <p className="p-text-center p-text-secondary">Get a detailed overview of your cards' performance, activities, and trends.</p>

            <Divider />

            {/* Filters Section */}
            <div className="p-grid p-justify-between p-mb-4">
                <div className="p-col-12 p-md-4">
                    <label htmlFor="dateRange" className="p-text-bold">
                        Date Range
                    </label>
                    <Calendar id="dateRange" value={filters.dateRange} onChange={(e) => handleFilterChange({ dateRange: e.value })} readOnlyInput  selectionMode="range" placeholder="Select Date Range" className="p-mt-2" />
                </div>
                <div className="p-col-12 p-md-3">
                    <label htmlFor="transactionType" className="p-text-bold">
                        Activity Type
                    </label>
                    <Dropdown 
                        id="transactionType" 
                        value={activityType} 
                        options={activityTypes} 
                        onChange={(e) => {
                            setActivityType(e.value);
                            handleFilterChange({ transactionType: e.value });
                        }} 
                        placeholder="Select Activity Type" 
                        className="p-mt-2" 
                    />
                </div>
            </div>

            <Divider />

            {/* Insights Section */}
            <div className="p-grid p-mb-3">
                {cardStats.map((stat, index) => (
                    <div key={index} className="p-col-12 p-md-2">
                        <Card className="p-card-stats">
                            <h5 className="p-text-center">{stat.title}</h5>
                            <p className="p-text-center p-text-bold" style={{ fontSize: "1.5rem" }}>
                                {stat.isCurrency ? `₦${reportData[stat.valueKey]?.toLocaleString()}` : reportData[stat.valueKey]}
                            </p>
                        </Card>
                    </div>
                ))}
                
            </div>

            <Divider />

            {/* Trends Section */}
            <div className="p-card p-p-4 p-mb-4">
                <h4>Activity Trends</h4>
                <Chart type="line" data={activityTrends} options={chartOptions} />
            </div>

            {/* Transactions Table */}
            <div className="p-card p-p-4">
                <h4>Transaction History</h4>
                <DataTable ref={dt} value={transactionData} paginator rows={10} responsiveLayout="scroll" className="p-mb-4">
                    <Column field="timestamp" header="Date" sortable />
                    <Column field="activity_type" header="Type" sortable />
                    <Column field="amount" header="Amount (₦)" sortable />
                    <Column field="description" header="Description" />
                    <Column field="status" header="Status" sortable />
                </DataTable>
                <div className="p-d-flex p-jc-end p-mt-3">
                    <Button label="Export CSV" icon="pi pi-file" className="p-mr-2 p-button-outlined" onClick={() => dt.current.exportCSV()} />
                    <Button label="Export PDF" icon="pi pi-file-pdf" className="p-button-danger p-button-outlined" onClick={() => dt.current.exportPDF()} />
                </div>
            </div>
        </div>
    );
};

export default CardReportPage;
