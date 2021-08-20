/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useContext } from "react";
import ReconStore from "../stores/ReconStore";
import { observer } from "mobx-react-lite";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import ProductStores from "../stores/ProductStores";
import AccountStore from "../stores/AccountStore";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const reconStore = useContext(ReconStore);
  const prodStore = useContext(ProductStores);
  const userStore = useContext(AccountStore);
  const {
    getAllData,
    pendingPristines,
    pendingFinales,
    completed,
    overdue, 
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
  const formatCurrency = (value) => {
      return value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };
  const totalOverdue = overdue && overdue.reduce((a, b) => a + b);  
  return (
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
          <span className="count revenue">{formatCurrency(3200)}</span>
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
             <Link to="/final-stage/open">  Stage One:{overdue[0] || 0}</Link>
            </span>
            <span className="p-button-rounded p-button-success p-ml-2">
              {" "}
            <Link to="/final-stage/final">  Stage Two: {overdue[1] || 0}</Link>
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
            <i className="pi pi-question-circle"></i>
            <span>Final Reconcillation</span>
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
              <Link to="/final-stage">{completed || 0}</Link>
            </span>
          </div>
        </div>
      </div>
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
                    <h1 style={{ fontSize: '16px' }}>Recent Sales</h1>
                    <DataTable value={products} className="p-datatable-customers" rows={5} style={{ marginBottom: '20px' }} paginator>
                        <Column header="Logo" body={(data) => <img src={`assets/demo/images/product/${data.image}`} alt={data.image} width="50" />}></Column>
                        <Column field="name" header="Name" sortable></Column>
                        <Column field="category" header="Category" sortable></Column>
                        <Column field="price" header="Price" sortable body={(data) => formatCurrency(data.price)}></Column>
                        <Column header="View" body={() => (
                            <>
                                <Button icon="pi pi-search" type="button" className="p-button-success p-mr-2 p-mb-1"></Button>
                                <Button icon="pi pi-times" type="button" className="p-button-danger p-mb-1"></Button>
                            </>
                        )}></Column>
                    </DataTable>
                </div>
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
  );
};
export default observer(Dashboard);
