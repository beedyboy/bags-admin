/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import { Skeleton } from "primereact/skeleton";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Link } from "react-router-dom";
import Assistant from "../helpers/Assistant";
import { useGetClosedRecords, useGetDashboardStats } from "../hooks/dashboard";
import useDashboardStore from "../stores/DashboardStore";

const dateFormat = "dd-mm-yy";

const GreetingMessage = ({ currentHour }) => <div className="text-3xl text-gray-800 font-bold mb-2">{currentHour < 12 ? "Good Morning!" : currentHour < 18 ? "Good Afternoon!" : "Good Night!"}, Bags 👋</div>;

const SummaryCard = ({ title, detail, count, icon, bgColor, color }) => (
    <div className="p-col-12 p-lg-4">
        <div className="card summary">
            <span className="title">{title}</span>
            <span className="detail">{detail}</span>
            <span className={`count ${icon}`} style={{ color, backgroundColor: bgColor }}>
                {count}
            </span>
        </div>
    </div>
);

const HighlightBox = ({ loading, initials, title, amount, count, icon, bgColor, color, link, onClick }) => (
    <div className="p-col-12">
        <div className="highlight-box">
            <div className="initials" style={{ backgroundColor: bgColor, color }}>
                <span>{initials}</span>
            </div>
            {loading ? (
                <div style={{ flex: "1" }}>
                    <Skeleton width="100%" className="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                </div>
            ) : (
                <div className="highlight-details">
                    <i className={icon}></i>
                    <span>{title}</span>
                    <span className="amount">{Assistant.formatCurrency(amount)}</span>
                    <span className="count">{link ? <Link to={link}>{count}</Link> : <Button type="button" icon="pi pi-search" label={count} onClick={onClick} aria-haspopup aria-controls="overlay_panel" className="select-product-button" />}</span>
                </div>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const { stats, isFiltering, setShowClosedData, showClosedData, dashDate, setDashDate, filterOptions, selectedFilter, setSelectedFilter } = useDashboardStore();

    const { isLoading } = useGetDashboardStats(dashDate);
    const { data: closedRecords } = useGetClosedRecords(dashDate);

    const currentHour = new Date().getHours();

    return (
        <Fragment>
            <div className="p-d-flex bg-indigo-200 flex-column p-p-5 p-mb-3">
                <GreetingMessage currentHour={currentHour} />
                <div className="font-medium text-500 mb-3">Here is what’s happening in your store:</div>
            </div>

            <div className="p-d-flex p-jc-between p-mb-4">
                <div className="p-d-flex">
                    <span className="p-p-2 font-bold">Dashboard Analysis!</span>
                    <SelectButton value={selectedFilter} options={filterOptions} onChange={(e) => setSelectedFilter(e.value)} />
                </div>
                {isFiltering && (
                    <div>
                        <Calendar id="range" value={dashDate} onChange={(e) => setDashDate(e.value)} selectionMode="range" showIcon readOnlyInput onClearButtonClick={() => setDashDate(null)} showButtonBar onTodayButtonClick={() => setDashDate(new Date())} dateFormat={dateFormat} />
                        {/* <Button type="button" icon="pi pi-search" disabled={!dashDate} className="p-button-rounded ml-3" onClick={setIsFiltering} /> */}
                    </div>
                )}
            </div>

            <div className="p-grid p-fluid dashboard">
                <SummaryCard title="Users" detail="Number of users" count={stats.totalAccounts} icon="visitors" />
                <SummaryCard title="Products" detail="Number of products" count={0} icon="purchases" />
                <SummaryCard title="Revenue" detail="Income for today" count="N/A" icon="revenue" />
            </div>

            <div className="p-grid p-fluid dashboard">
                {/* First Row - 2 Cards */}
                <div className="p-col-12 p-md-6">
                    <HighlightBox initials="TO" title="Total Overdue" loading={isLoading} amount={stats.totalOverdueReconciliationAmount} count={stats.totalOverdueReconciliation} icon="pi pi-search" bgColor="#007be5" color="#00448f" />
                </div>

                <div className="p-col-12 p-md-6">
                    <HighlightBox initials="OR" title="Open Reconciliation" loading={isLoading} amount={stats.totalStageOneAmount} count={stats.totalOpenedReconciliation} icon="pi pi-filter" bgColor="#20d077" color="#038d4a" link="/stage-one" />
                </div>

                {/* Second Row - 3 Cards */}
                <div className="p-col-12 p-md-4">
                    <HighlightBox initials="PUR" title="Partially Used Reconciliation" loading={isLoading} amount={stats.totalPartiallyUsedReconciliationAmount} count={stats.totalPartiallyUsedReconciliation} icon="pi pi-filter" bgColor="#20d077" color="#038d4a" link="/stage-two" />
                </div>

                <div className="p-col-12 p-md-4">
                    <HighlightBox initials="FR" title="Stage Two Reconciliation" loading={isLoading} amount={stats.totalStageTwoAmount} count={stats.totalOpenedStageTwoReconciliations} icon="pi pi-question-circle" bgColor="#ef6262" color="#a83d3b" link="/stage-two" />
                </div>

                <div className="p-col-12 p-md-4">
                    <HighlightBox initials="CR" title="Closed Reconciliation" loading={isLoading} amount={stats.totalFinalStageAmount} count={stats.totalClosedReconciliation} icon="pi pi-check" bgColor="#f9c851" color="#b58c2b" onClick={setShowClosedData} />
                </div>
            </div>

            <div className="p-grid p-fluid dashboard">
                {showClosedData && (
                    <div className="p-col-12 p-lg-12">
                        <div className="card">
                            <h1 style={{ fontSize: "16px" }}>Closed Reconciliation Data</h1>
                            <DataTable value={closedRecords} paginator rows={5}>
                                <Column headerStyle={{ width: "3em" }} />
                                <Column field="value_date" header="Value Date" sortable />
                                <Column field="remarks" header="Remarks" sortable />
                                <Column field="credit_amount" header="Credit Amount" sortable />
                                <Column field="amount_used" header="Amount Used" sortable />
                                <Column field="balance" header="Balance" sortable />
                                <Column field="reference" header="Ref No" sortable />
                                <Column field="cancellation_number" header="Cancellation No" sortable />
                                <Column field="reconcile_date_one" header="Stage One Approval Date" sortable />
                                <Column field="reconcile_date_one" header="Stage Two Approval Date" sortable />
                            </DataTable>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default Dashboard;
