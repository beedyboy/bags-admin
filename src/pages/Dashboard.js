/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, Fragment, useContext, useState } from "react";
import ReconStore from "../stores/ReconStore";
import { observer } from "mobx-react-lite";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip"; 
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button"; 
import { SelectButton } from 'primereact/selectbutton';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import ProductStores from "../stores/ProductStores";
import AccountStore from "../stores/AccountStore";
import { Link } from "react-router-dom";
import Assistant from "../helpers/Assistant";
// import moment from "moment";
// const dateFormat = "DD-MM-YYYY";
const Dashboard = () => {
  const [stat, setStat] = useState({
    open: false,
    closed: false,
  });
  const options = ['All', 'Filter'];
  const [optVal, setOptVal] = useState('All');
  const [dashDate, setDashDate] = useState(null);
  const reconStore = useContext(ReconStore);
  const prodStore = useContext(ProductStores);
  const userStore = useContext(AccountStore);
  const {
    getAllData,
    pendingPristines,
    pendingFinales,
    completed,
    overdue,
    filterProperty
  } = reconStore;
  const {
    stats: totalProduct,
    getProducts,
    loading: productLoading,
  } = prodStore;
  const { stats: totalUser, getUsers } = userStore;
 
  useEffect(() => {
    getProducts();
    getUsers();
    getAllData();
  }, []);
  const handleOptioon = (d) => { 
    setOptVal(d);
    if(d === "All") { 
      filterProperty("All", [])
    }  
  }
  const filterOption = () => {
    filterProperty(optVal, dashDate)
  }
  const totalOverdue = overdue && overdue.reduce((a, b) => a + b);
  const toggleStat = (e, field) => {
  setStat((formState) => ({
    ...formState,
    [field]: !formState[field]
  }))
  }
  return (
<Fragment>
 
    <div className="p-d-flex bg-indigo-200 p-flex-column p-p-5 p-mb-3">
    <div className="text-3xl text-gray-800 p-text-bold p-mb-2">Good Afternoon, Bags 👋</div>
    <div className="font-medium text-500 mb-3">Here is what’s happening in your store:</div> 
    </div>
    <div className="p-d-flex p-jc-between p-mb-4">
<div className="p-d-flex"> 
      <span className="p-p-2 p-text-bold">Dashboard Analysis! </span>
<SelectButton value={optVal} options={options} onChange={(e) => handleOptioon(e.value)} />

</div>
{optVal === "Filter"?
<div>
<Calendar
          id="range"
          value={dashDate}
          onChange={(e) => setDashDate(e.value)}
          selectionMode="range"
          showIcon
          readOnlyInput
          // dateFormat ={dateFormat}
        />
        <Button
          type="button"
          icon="pi pi-search"
          className="p-button-rounded p-ml-3"
          onClick={filterOption} 
        />
</div>
: null
}
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
          <span className="count revenue">{Assistant.formatCurrency(3200)}</span>
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
            <span className="count">
              {" "}
              <Link to="/stage-one">{pendingPristines || 0}</Link>
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
            {/* <i className="pi pi-question-circle"></i> */}
            <span>Stage Two Reconcillation</span>
            <span className="count">
              <Link to="/stage-two">{pendingFinales || 0}</Link>
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
            <span className="count">
              {/* <Link to="/final-stage">{completed || 0}</Link> */}
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
{stat.closed?
<>
      <div className="p-col-12 p-lg-12">
        <div className="card">
          <h1 style={{ fontSize: "16px" }}>Closed Reconcillation Data</h1>
          <DataTable value={completed} paginator rows={5}>
            <Column headerStyle={{ width: "3em" }}></Column>
            <Column field="value_date" header="Value Date" sortable></Column>
            <Column field="remarks" header="Remarks" sortable></Column>
            <Column
              field="credit_amount"
              header="Credit Amount"
              sortable
            ></Column>
            <Column field="amount_used" header="Amount Used" sortable></Column>
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
     </> : null }
      {/* 
            <div className="p-col-12 p-md-6 p-lg-4">
                <Panel header="Tasks" style={{ height: '100%' }}>
                    <ul className='task-list'>
                        <li>
                            <Checkbox name="task" value="reports" checked={tasksCheckbox.indexOf('reports') !== -1} onChange={onTaskCheckboxChange} />
                            <span className="task-name">Sales Reports</span>
                            <i className="pi pi-chart-bar" />
                        </li>
                        <li>
                            <Checkbox name="task" value="invoices" checked={tasksCheckbox.indexOf('invoices') !== -1} onChange={onTaskCheckboxChange} />
                            <span className="task-name">Pay Invoices</span>
                            <i className="pi pi-dollar" />
                        </li>
                        <li>
                            <Checkbox name="task" value="dinner" checked={tasksCheckbox.indexOf('dinner') !== -1} onChange={onTaskCheckboxChange} />
                            <span className="task-name">Dinner with Tony</span>
                            <i className="pi pi-user" />
                        </li>
                        <li>
                            <Checkbox name="task" value="meeting" checked={tasksCheckbox.indexOf('meeting') !== -1} onChange={onTaskCheckboxChange} />
                            <span className="task-name">Client Meeting</span>
                            <i className="pi pi-users" />
                        </li>
                        <li>
                            <Checkbox name="task" value="theme" checked={tasksCheckbox.indexOf('theme') !== -1} onChange={onTaskCheckboxChange} />
                            <span className="task-name">New Theme</span>
                            <i className="pi pi-globe" />
                        </li>
                        <li>
                            <Checkbox name="task" value="flight" checked={tasksCheckbox.indexOf('flight') !== -1} onChange={onTaskCheckboxChange} />
                            <span className="task-name">Flight Ticket</span>
                            <i className="pi pi-briefcase" />
                        </li>
                    </ul>
                </Panel>
            </div>

            <div className="p-col-12 p-md-6 p-lg-4 p-fluid contact-form">
                <Panel header="Contact Us">
                    <div className="p-grid">
                        <div className="p-col-12">
                            <Dropdown value={dropdownCity} onChange={(e) => setDropdownCity(e.value)} options={dropdownCities} optionLabel="name" placeholder="Select a City" />
                        </div>
                        <div className="p-col-12">
                            <InputText type="text" placeholder="Name" />
                        </div>
                        <div className="p-col-12">
                            <InputText type="text" placeholder="Age" />
                        </div>
                        <div className="p-col-12">
                            <InputText type="text" placeholder="Message" />
                        </div>
                        <div className="p-col-12">
                            <Button type="button" label="Send" icon="pi pi-envelope" />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="p-col-12 p-lg-4 contacts">
                <Panel header="Contacts">
                    <ul>
                        <li>
                            <button className="p-link">
                                <img src="assets/layout/images/avatar_1.png" width="35" alt="avatar1" />
                                <span className="name">Claire Williams</span>
                                <span className="email">clare@primereact.com</span>
                            </button>
                        </li>
                        <li>
                            <button className="p-link">
                                <img src="assets/layout/images/avatar_2.png" width="35" alt="avatar2" />
                                <span className="name">Jason Dourne</span>
                                <span className="email">jason@primereact.com</span>
                            </button>
                        </li>
                        <li>
                            <button className="p-link">
                                <img src="assets/layout/images/avatar_3.png" width="35" alt="avatar3" />
                                <span className="name">Jane Davidson</span>
                                <span className="email">jane@primereact.com</span>
                            </button>
                        </li>
                        <li>
                            <button className="p-link">
                                <img src="assets/layout/images/avatar_4.png" width="35" alt="avatar4" />
                                <span className="name">Tony Corleone</span>
                                <span className="email">tony@primereact.com</span>
                            </button>
                        </li>
                    </ul>
                </Panel>
            </div>

           
            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <Chart type="line" data={lineData} />
                </div>
            </div>
 

            <div className="p-col-12 p-lg-4">
                <Panel header="Activity" style={{ height: '100%' }}>
                    <div className="activity-header">
                        <div className="p-grid">
                            <div className="p-col-6">
                                <span style={{ fontWeight: 'bold' }}>Last Activity</span>
                                <p>Updated 1 minute ago</p>
                            </div>
                            <div className="p-col-6" style={{ textAlign: 'right' }}>
                                <Button label="Refresh" icon="pi pi-refresh" />
                            </div>
                        </div>
                    </div>

                    <ul className="activity-list">
                        <li>
                            <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
                                <h5 className="activity p-m-0">Income</h5>
                                <div className="count">$900</div>
                            </div>
                            <ProgressBar value={95} showValue={false} />
                        </li>
                        <li>
                            <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
                                <h5 className="activity p-m-0">Tax</h5>
                                <div className="count" style={{ backgroundColor: '#f9c851' }}>$250</div>
                            </div>
                            <ProgressBar value={24} showValue={false} />
                        </li>
                        <li>
                            <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
                                <h5 className="activity p-m-0">Invoices</h5>
                                <div className="count" style={{ backgroundColor: '#20d077' }}>$125</div>
                            </div>
                            <ProgressBar value={55} showValue={false} />
                        </li>
                        <li>
                            <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
                                <h5 className="activity p-m-0">Expenses</h5>
                                <div className="count" style={{ backgroundColor: '#f9c851' }}>$250</div>
                            </div>
                            <ProgressBar value={15} showValue={false} />
                        </li>
                        <li>
                            <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
                                <h5 className="activity p-m-0">Bonus</h5>
                                <div className="count" style={{ backgroundColor: '#007be5' }}>$350</div>
                            </div>
                            <ProgressBar value={5} showValue={false} />
                        </li>
                        <li>
                            <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
                                <h5 className="activity p-m-0">Revenue</h5>
                                <div className="count" style={{ backgroundColor: '#ef6262' }}>$500</div>
                            </div>
                            <ProgressBar value={25} showValue={false} />
                        </li>
                    </ul>
                </Panel>
            </div>
        */}
    </div>
    </Fragment>
  );
};
export default observer(Dashboard);
