import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { toJS } from "mobx";

const AccountList = ({
  data,
  setMode,
  loading,
  removeData,
  rowData,
  toggle,
  setModal,
  setTitle,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const tableHeader = (
    <div className="table-header">
      Staff List
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Global Search"
        />
      </span>
    </div>
  );

  const bodyTemplate = (data, props) => {
    return (
      <>
        <span className="p-column-title">{props.header}</span>
        {data.lastname} {data.firstname}
      </>
    );
  };

  const addressTemp = (data) => {
    return (
      <>
        <span className="p-column-title">Address</span>
        <span
          style={{ marginLeft: ".5em", verticalAlign: "middle" }}
          className="image-text"
        >
          {data.address}
        </span>
      </>
    );
  };

  const statusBodyTemplate = (data) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        <span className={`customer-badge status-${data.status}`}>
          {data.status}
        </span>
      </>
    );
  };

  const actionTemplate = (data) => (
    <span className="p-buttonset">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success p-mr-2"
        onClick={(e) => editData(e, data)}
      />
      <Button
        icon="pi pi-key"
        className="p-button-rounded p-button-success p-mr-2"
        onClick={(e) => setAcl(e, data)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-warning"
        onClick={(e) => deleteData(e, data.id)}
      />
    </span>
  );

  const setAcl = (e, row) => {
    e.persist();
    const d = toJS(row);
    rowData(d);
    setModal(true);
  };

  const editData = (e, row) => {
    e.persist();
    setMode("Edit");
    setTitle("Edit Staff");
    rowData(row);
    toggle(true);
  };

  const deleteData = (e, id) => {
    e.persist();
    removeData(id);
  };

  return (
    <div className="p-grid table-demo">
      <div className="p-col-12">
        <div className="card">
          {/* <h5>Default</h5> */}
          {/* <p>Pagination, sorting, filtering </p> */}
          <DataTable
            value={data}
            paginator
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            className="p-datatable-customers"
            rows={10}
            dataKey="id"
            rowHover
            globalFilter={globalFilter}
            emptyMessage="No account found."
            loading={loading}
            header={tableHeader}
          >
            <Column headerStyle={{ width: "3em" }}></Column>
            <Column
              // field="name"
              header="Fullname"
              sortable
              body={bodyTemplate}
            ></Column>
            <Column
              field="address"
              header="Address"
              sortable
              body={addressTemp}
            ></Column>
            <Column field="phone" header="Phone" sortable></Column>
            <Column
              field="status"
              header="Status"
              sortable
              body={statusBodyTemplate}
            ></Column>
            <Column
              headerStyle={{ width: "8rem", textAlign: "center" }}
              bodyStyle={{
                textAlign: "center",
                overflow: "visible",
                justifyContent: "start",
              }}
              body={actionTemplate}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default AccountList;
