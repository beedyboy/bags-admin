/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import ReconStore from "../../stores/ReconStore";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { observer } from "mobx-react-lite";
import NoAccess from "../../widgets/NoAccess";
import StepTwoForm from "../../components/recon/StepTwoForm";
import Utils from "../../shared/localStorage";
import Assistant from "../../helpers/Assistant";

const StageTwo = () => {
  let acl;
  let reconTwo;

  const obj = Utils.get("acl");
  if (obj && obj !== "") {
    acl = JSON.parse(obj);
  }

  reconTwo = acl && acl.reconcillation && acl.reconcillation.approval_two;
  // reconReport = acl && acl.reconcillation && acl.reconcillation.report;
  // reconModify = acl && acl.reconcillation && acl.reconcillation.modify;

  const toast = useRef(null);
  const dt = useRef(null);
  const [upload, setUpload] = useState(false);
  const [approval, setApproval] = useState(false);
  const [activeId, setActiveId] = useState(0);
  const [rowData, setRowData] = useState();
  const [globalFilter, setGlobalFilter] = useState("");

  const store = useContext(ReconStore);
  const {
    loading,
    finaleRecord,
    error,
    action,
    finales,
    message,
    resetProperty,
    sending,
    saveApproval,
    revertRecord,
    reverting,
    reverted,
  } = store;
  useEffect(() => {
    finaleRecord();
  }, []);
  const exportCSV = () => {
    dt.current.exportCSV();
  };

  useEffect(() => {
    if (action === "approved") {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: message,
      });
      setApproval(false);
    }
    return () => {
      resetProperty("message", "");
      resetProperty("action", "");
      setApproval(false);
    };
  }, [action]);
  useEffect(() => {
    if (error === true && action === "approvedError") {
      toast.current.show({
        severity: "error",
        summary: "Error Message",
        detail: message,
      });
    }
    return () => {
      resetProperty("error", false);
      resetProperty("message", "");
      resetProperty("action", "");
      setApproval(false);
    };
  }, [error]);

  useEffect(() => {
    if (reverted) {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: message,
      });
      setActiveId(0);
      finaleRecord();
    }
    return () => {
      resetProperty("message", "");
      resetProperty("reverted", false);
      setActiveId(0);
    };
  }, [reverted]);
  const totalValue = finales?.reduce((a, b) => a + b.credit_amount, 0) || 0;
  const tableHeader = (
    <div className="p-d-flex p-jc-between">
      Stage Two List
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

  const approvedTemplate = (data) => {
    return (
      <>
        <span className={`product-badge status-${data.approved_one}`}>
          {data.approved_one ? "Yes" : "No"}
        </span>
      </>
    );
  };

  const actionTemplate = (data) => (
    <span className="p-buttonset" id={data.id}>
      {reverting && activeId === data.id ? (
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
            onClick={(e) => confirm(e, data)}
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
        <Column header={finales.length} colSpan={4} />
      </Row>
      <Row>
        <Column field="value_date" header="Value Date" sortable></Column>
        <Column field="remarks" header="Remarks" sortable></Column>
        <Column field="credit_amount" header="Credit Amount" sortable></Column>
        <Column field="amount_used" header="Amount Used" sortable></Column>
        <Column field="balance" header="Balance" sortable></Column>
        <Column field="reference" header="Ref No" sortable></Column>
        <Column
          field="cancellation_number"
          header="Cancellation No"
          sortable
        ></Column>
        <Column
          field="approved_one"
          header="Approved"
          sortable
          body={approvedTemplate}
        ></Column>
        <Column
          field="reconcile_date_one"
          header="Stage One Approval Date"
          sortable
        ></Column>
        <Column
          headerStyle={{ width: "8rem", textAlign: "center" }}
          bodyStyle={{
            textAlign: "center",
            overflow: "visible",
            justifyContent: "center",
          }}
          body={actionTemplate}
        ></Column>
      </Row>
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
    setRowData(row);
    setApproval(true);
  };
  const revertData = (row) => {
    const values = {
      id: row.id,
      amount_used: Number(0),
      balance: Number(0),
      approved_one: false,
      approved_two: false,
    };
    setActiveId(row.id);
    revertRecord(values);
  };
  return (
    <Fragment>
      <Toast ref={toast} position="top-right" />
      <div className="card">
        {reconTwo ? (
          <>
            {" "}
            <Toolbar
              className="p-mb-4"
              left={leftToolbarTemplate}
              right={rightToolbarTemplate}
            ></Toolbar>
            <DataTable
              ref={dt}
              value={finales}
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
              loading={loading}
              header={tableHeader}
              headerColumnGroup={headerGroup}
            >
              <Column field="value_date" header="Value Date" sortable></Column>
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
                field="approved_one"
                header="Approved"
                sortable
                body={approvedTemplate}
              ></Column>
              <Column
                field="reconcile_date_one"
                header="Stage One Approval Date"
                sortable
              ></Column>
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
          </>
        ) : (
          <NoAccess page="stage two" />
        )}{" "}
      </div>
      <Dialog
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
      </Dialog>

      <Dialog
        visible={approval}
        onHide={(e) => setApproval(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
        header="Approve Record"
      >
        <StepTwoForm
          action={action}
          error={error}
          message={message}
          sending={sending}
          saveApproval={saveApproval}
          toggle={setApproval}
          initial_data={rowData}
          reset={resetProperty}
        />
      </Dialog>
    </Fragment>
  );
};

export default observer(StageTwo);
