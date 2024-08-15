/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useState,
  useRef,
} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import NoAccess from "../../widgets/NoAccess";
import StepTwoForm from "../../components/recon/StepTwoForm";
import Assistant from "../../helpers/Assistant";
import { getPermissions } from "../../helpers/permissions";
import { useGetStageTwoTransactions, useOverturn } from "../../hooks/reconcillations";
import useReconStore from "../../stores/ReconStore";

const StageTwo = () =>
{
  
  const { canApproveStageTwo } = getPermissions("reconcillation");
  
  const { data: stageTwoData, isLoading } = useGetStageTwoTransactions();
  const {  isLoading: isReverting  } = useOverturn();
  const { modifyStepTwoData, toggleStepTwoForm, isStepTwoFormOpened } = useReconStore();



  const approvedTemplate = (data) => {
    return (
      <>
        <span className={`table-badge status-${data.approved_one}`}>
          {data.approved_one ? "Yes" : "No"}
        </span>
      </>
    );
  };

  const columns = [
    { field: "value_date", header: "Value Date" },
    { field: "remarks", header: "Remarks" },
    { field: "credit_amount", header: "Credit Amount" },
    { field: "amount_used", header: "Amount Used" },
    { field: "balance", header: "Balance" },
    { field: "reference", header: "Ref No" },
    {
      field: "cancellation_number",
      header: "Canc No",
    },
    {
      field: "approved_one",
      header: "Approved",
      template: approvedTemplate,
    },
    {
      field: "reconcile_date_one",
      header: "Stage One Approval Date",
    },
  ];
  const toast = useRef(null);
  const dt = useRef(null);
  const [selectedColumns, setSelectedColumn] = useState(columns);
  const [activeId, setActiveId] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");

  // useEffect(() => {
  //   finaleRecord();
  // }, []);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setSelectedColumn(orderedSelectedColumns);
  };
  const columnComponents = selectedColumns.map((col) => {
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        body={col.template ?? false}
        sortable
      />
    );
  });

  const totalValue = stageTwoData?.reduce((a, b) => a + b.credit_amount, 0) || 0;
  const tableHeader = (
    <div className="p-d-flex p-jc-between">
      Stage Two List
        <div style={{ textAlign: "left" }}>
          <MultiSelect
            value={selectedColumns}
            options={columns}
            optionLabel="header"
            onChange={onColumnToggle}
            style={{ width: "20em" }}
          />
        </div>
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

  const actionTemplate = (data) => (
    <span className="p-buttonset" id={data.id}>
      {isReverting && activeId === data.id ? (
        <ProgressBar mode="indeterminate" />
      ) : (
        <>
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-success p-mr-2"
            onClick={(e) => editData(e, data)}
          />
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-warning"
            // onClick={(e) => confirm(e, data)}
          />
        </>
      )}
    </span>
  );

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Total Value" colSpan={2} />
        <Column header={Assistant.formatCurrency(totalValue)} colSpan={4} />
      </Row>
      <Row>
        <Column header="Total Pending" colSpan={2} />
        <Column header={`${stageTwoData?.length} item(s)`} colSpan={4} />
      </Row> 
        <Row>{columnComponents}</Row> 
    </ColumnGroup>
  );

  const confirm = (e, row) => {
    e.persist();
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => revertData(row),
      // reject: () => rejectFunc()
    });
  };
  const leftToolbarTemplate = () => {
    return <React.Fragment>Stage Two Management</React.Fragment>;
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const editData = (e, row) => {
    e.persist();
    modifyStepTwoData(row, true);
  };
  const revertData = (row) => {
    const values = {
      id: row.id,
      amount_used: Number(0),
      balance: Number(0),
      approved_one: false,
      approved_two: false,
    };
    // setActiveId(row.id);
    // revertRecord(values);
  };
  return (
    <Fragment>
      <Toast ref={toast} position="top-right" />
      <div className="card">
        {!canApproveStageTwo ? (
          <>
            {" "}
            <Toolbar
              className="p-mb-4"
              left={leftToolbarTemplate}
              right={rightToolbarTemplate}
            ></Toolbar>
            <DataTable
              ref={dt}
              value={stageTwoData}
              paginator
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              rowsPerPageOptions={[10, 25, 50]}
              className="p-datatable-customers"
              rows={10}
              columnResizeMode="expand"
              resizableColumns
              dataKey="id"
              rowHover
              globalFilter={globalFilter}
              emptyMessage="No record found."
              loading={isLoading}
              header={tableHeader}
              headerColumnGroup={headerGroup}
            >
              {columnComponents}
              <Column
                headerStyle={{ width: "8rem", textAlign: "center" }}
                header="Code"
                bodyStyle={{
                  textAlign: "center",
                  overflow: "visible",
                  justifyContent: "center",
                }}
                body={actionTemplate}
              />
             
            </DataTable>
          </>
        ) : (
          <NoAccess page="stage two" />
        )}{" "}
      </div>
      {/* <Dialog
        visible={upload}
        onHide={(e) => setUpload(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
        header="Upload Statement"
      >
        <Tooltip
          target=".custom-choose-btn"
          content="Choose"
          position="bottom"
        />
        <Tooltip
          target=".custom-upload-btn"
          content="Upload"
          position="bottom"
        />
        <Tooltip
          target=".custom-cancel-btn"
          content="Clear"
          position="bottom"
        />
      </Dialog> */}

      <Dialog
        visible={isStepTwoFormOpened}
        onHide={toggleStepTwoForm}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
        header="Approve Record"
      >
        <StepTwoForm />
      </Dialog>
    </Fragment>
  );
};

export default StageTwo;
