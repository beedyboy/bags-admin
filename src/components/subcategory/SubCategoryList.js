import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button"; 
import { InputText } from "primereact/inputtext";  

 const SubCategoryList = ({
  data,
  setMode,
  loading,
  removeData,
  rowData,
  toggle,
}) => {
  const [globalFilter, setGlobalFilter] = useState(""); 
 
  const tableHeader = (
    <div className="table-header">
      List of Sub Categories
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
        {data[props.field]}
      </>
    );
  };

  const descBodyTemplate = (data) => {
    return (
      <>
        <span className="p-column-title">Description</span>
        <span
          style={{ marginLeft: ".5em", verticalAlign: "middle" }}
          className="image-text"
        >
          {data.description}
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
    <Button label="Edit" icon="pi pi-pencil" onClick={(e) => editData(e, data)} />
    <Button label="Delete" icon="pi pi-trash" onClick={(e) => deleteData(e, data.id)} /> 
</span>
  );

  const editData = (e, row) => {
    e.persist();
    setMode("Edit");
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
            className="p-datatable-customers"
            rows={10}
            dataKey="id"
            rowHover
            globalFilter={globalFilter}
            emptyMessage="No sub category found."
            loading={loading}
            header={tableHeader}
          >
            <Column 
              headerStyle={{ width: "3em" }}
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              body={bodyTemplate}
            ></Column>
            <Column
              field="description"
              header="Description"
              sortable
              body={descBodyTemplate}
            ></Column>
            <Column
              field="created_at"
              header="Created At"
              sortable
              body={bodyTemplate}
            ></Column>
            <Column
              field="status"
              header="Status"
              sortable
              body={statusBodyTemplate}
            ></Column>
            {/* <Column field="activity" header="Activity" sortable body={activityBody}></Column> */}
            <Column
              headerStyle={{ width: "8rem", textAlign: "center" }}
              bodyStyle={{
                textAlign: "center",
                overflow: "visible",
                justifyContent: "center",
              }}
              body={actionTemplate}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryList;