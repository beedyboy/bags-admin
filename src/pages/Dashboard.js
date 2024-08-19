/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, Fragment, useContext, useState } from "react";
import ReconStore from "../stores/ReconStore";
import { observer } from "mobx-react-lite";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import ProductStores from "../stores/ProductStores";
import { Link } from "react-router-dom";
import Assistant from "../helpers/Assistant";
import useAuthStore from "../stores/AccountStore";
import Utils from "../shared/localStorage";
import { useGetDashboardStats } from "../hooks/dashboard";
// import moment from "moment";
const dateFormat = "dd-mm-yy";
const Dashboard = () => {
    const [stat, setStat] = useState({
        open: false,
        closed: false,
    });
    // const options = ["All", "Filter"];
    // const [optVal, setOptVal] = useState("All");
    // const [dashDate, setDashDate] = useState(null);
    // const reconStore = useContext(ReconStore);
    // const prodStore = useContext(ProductStores);
    // const {
    //     stats: totalUser,
    //     // getUsers,
    //     filterProperty: userFilterProperty,
    // } = useAuthStore();
    // const {
    //   getAllData,
    //   pendingPristines,
    //   pendingFinales,
    //   completed,
    //   overdue,
    //   filterProperty,
    // } = reconStore;
    // const {
    //   stats: totalProduct,
    //   getProducts,
    //   loading: productLoading,
    //   filterProperty: productFilterProperty,
    // } = prodStore;

    const { data } = useGetDashboardStats();

    console.log({ data });

    const handleOptioon = (d) => {
        // setOptVal(d);
        // if (d === "All") {
        //   filterProperty("All", []);
        //   productFilterProperty("All", []);
        //   userFilterProperty("All", []);
        // }
    };

    const filterOption = () => {
        // filterProperty(optVal, dashDate);
        // productFilterProperty(optVal, dashDate);
        // userFilterProperty(optVal, dashDate);
    };
    // const totalOverdue = overdue && overdue.reduce((a, b) => a + b);
    const toggleStat = (e, field) => {
        setStat((formState) => ({
            ...formState,
            [field]: !formState[field],
        }));
    };

    // const totalPristineValue = pendingPristines?.reduce((a, b) => a + parseFloat(b.credit_amount), 0) || 0;
    // const totalFinaleValue = pendingFinales?.reduce((a, b) => a + parseFloat(b.credit_amount), 0) || 0;
    // const totalCompleted = completed?.reduce((a, b) => a + parseFloat(b.credit_amount), 0) || 0;
    const date = new Date().getHours();

    const isAuthenticated = Utils.isAuthenticated();
    console.log({ isAuthenticated });
    return (
        <Fragment>
            <div className="p-d-flex bg-indigo-200 p-flex-column p-p-5 p-mb-3">
                <div className="text-3xl text-gray-800 p-text-bold p-mb-2">{date < 12 ? "Good Morning!" : date < 18 ? "Good Afternoon!" : "Good Night!"}, Bags 👋</div>
                <div className="font-medium text-500 mb-3">Here is what’s happening in your store:</div>
            </div>
            {/* <div className="p-d-flex p-jc-between p-mb-4">
        <div className="p-d-flex">
          <span className="p-p-2 p-text-bold">Dashboard Analysis! </span>
          <SelectButton
            value={optVal}
            options={options}
            onChange={(e) => handleOptioon(e.value)}
          />
        </div>
        {optVal === "Filter" ? (
          <div>
            <Calendar
              id="range"
              value={dashDate}
              onChange={(e) => setDashDate(e.value)}
              selectionMode="range"
              showIcon
              readOnlyInput
              onClearButtonClick={(e) => setDashDate(null)}
              showButtonBar={true}
              onTodayButtonClick={(e) => setDashDate(new Date())}
              dateFormat ={dateFormat}
            />
            <Button
              type="button"
              icon="pi pi-search"
              disabled={!dashDate}
              className="p-button-rounded p-ml-3"
              onClick={filterOption}
            />
          </div>
        ) : null}
      </div>
      <div className="p-grid p-fluid dashboard">
        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <span className="title">Users</span>
            <span className="detail">Number of users</span>
            <span className="count visitors">{totalUser || 0}</span>
          </div>
        </div>
        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <span className="title">Products</span>
            <span className="detail">Number of products</span>
            <span className="count purchases">
              {productLoading ? (
                <Skeleton width="100%" height="2rem" />
              ) : (
                totalProduct || 0
              )}
            </span>
          </div>
        </div>
        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <span className="title">Revenue</span>
            <span className="detail">Income for today</span>
            <span className="count revenue">
              N/A
              // { {Assistant.formatCurrency(3200)} }
            </span>
          </div>
        </div>

        <div className="p-col-12 p-md-6 p-xl-3">
          <div className="highlight-box">
            <div
              className="initials"
              style={{ backgroundColor: "#007be5", color: "#00448f" }}
            >
              <span>TO</span>
            </div>
            <div className="highlight-details ">
              <i className="pi pi-search"></i>
              <span>Total Overdue </span>
              <span className="count tooltip-button p-ml-2">
                {totalOverdue || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="p-d-flex p-ai-center">
          <Tooltip target=".tooltip-button" autoHide={false}>
            <div className="p-d-flex p-ai-center">
              <span className="p-button-rounded p-button-success p-ml-2">
                <Link to="/stage-one"> Stage One:{overdue[0] || 0}</Link>
              </span>
              <span className="p-button-rounded p-button-success p-ml-2">
                {" "}
                <Link to="/stage-two"> Stage Two: {overdue[1] || 0}</Link>
              </span>
            </div>
          </Tooltip>
        </div>

        <div className="p-col-12 p-md-6 p-xl-3">
          <div className="highlight-box">
            <div
              className="initials"
              style={{ backgroundColor: "#20d077", color: "#038d4a" }}
            >
              <span>OR</span>
            </div>
            <div className="highlight-details ">
              <i className="pi pi-filter"></i>
              <span>Open Reconcillation</span>
              <span className="amount or">  {Assistant.formatCurrency(totalPristineValue)}</span> 
              <span className="count">
                {" "}
                <Link to="/stage-one">{pendingPristines.length || 0}</Link>
              
              </span>
            </div>
          </div>
        </div>
        <div className="p-col-12 p-md-6 p-xl-3">
          <div className="highlight-box">
            <div
              className="initials"
              style={{ backgroundColor: "#ef6262", color: "#a83d3b" }}
            >
              <span>FR</span>
            </div>
            <div className="highlight-details ">
              <i className="pi pi-question-circle"></i>
              <span>Stage Two Reconcillation</span>
              <span className="amount fr">  {Assistant.formatCurrency(totalFinaleValue)}</span> 
              <span className="count">
                <Link to="/stage-two">{pendingFinales.length || 0}</Link>
              </span>
            </div>
          </div>
        </div>
        <div className="p-col-12 p-md-6 p-xl-3">
          <div className="highlight-box">
            <div
              className="initials"
              style={{ backgroundColor: "#f9c851", color: "#b58c2b" }}
            >
              <span>CR</span>
            </div>
            <div className="highlight-details ">
              <i className="pi pi-check"></i>
              <span>Closed Reconcillation</span>
              <span className="amount cr">  {Assistant.formatCurrency(totalCompleted)}</span> 
              <span className="count"> 
                <Button
                  type="button"
                  icon="pi pi-search"
                  label={completed.length || 0}
                  onClick={(e) => toggleStat(e, "closed")}
                  aria-haspopup
                  aria-controls="overlay_panel"
                  className="select-product-button"
                />
              </span>
            </div>
          </div>
        </div>
        {stat.closed ? (
          <>
            <div className="p-col-12 p-lg-12">
              <div className="card">
                <h1 style={{ fontSize: "16px" }}>Closed Reconcillation Data</h1>
                <DataTable value={completed} paginator rows={5}>
                  <Column headerStyle={{ width: "3em" }}></Column>
                  <Column
                    field="value_date"
                    header="Value Date"
                    sortable
                  ></Column>
                  <Column field="remarks" header="Remarks" sortable></Column>
                  <Column
                    field="credit_amount"
                    header="Credit Amount"
                    sortable
                  ></Column>
                  <Column
                    field="amount_used"
                    header="Amount Used"
                    sortable
                  ></Column>
                  <Column field="balance" header="Balance" sortable></Column>
                  <Column field="reference" header="Ref No" sortable></Column>
                  <Column
                    field="cancellation_number"
                    header="Cancellation No"
                    sortable
                  ></Column>
                  <Column
                    field="reconcile_date_one"
                    header="Stage One Approval Date"
                    sortable
                  ></Column>
                  <Column
                    field="reconcile_date_one"
                    header="Stage Two Approval Date"
                    sortable
                  ></Column>
                </DataTable>
              </div>
            </div>
          </>
        ) : null}
      </div> */}
        </Fragment>
    );
};
export default observer(Dashboard);
