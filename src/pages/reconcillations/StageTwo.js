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
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { observer } from "mobx-react-lite";
import NoAccess from "../../widgets/NoAccess";
import StepTwoForm from "../../components/recon/StepTwoForm";
import Utils from "../../shared/localStorage";

const StageTwo = () => {
  let acl;
  let reconTwo;
  
  const obj = Utils.get("acl");
  if (obj && obj !== "") { 
    acl = JSON.parse(obj); 
  }
   
  reconTwo = acl && (acl.reconcillation && acl.reconcillation.approval_two);
  // reconReport = acl && acl.reconcillation && acl.reconcillation.report;
  // reconModify = acl && acl.reconcillation && acl.reconcillation.modify;
  
  const toast = useRef(null);
  const dt = useRef(null);
  const [upload, setUpload] = useState(false);
  const [approval, setApproval] = useState(false);
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
    <span className="p-buttonset">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success p-mr-2"
        onClick={(e) => editData(e, data)}
      />
      {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"  onClick={(e) => deleteData(e, data.id)}/> */}
    </span>
  );
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
              className="p-datatable-customers"
              rows={10}
              columnResizeMode="expand"
              dataKey="id"
              rowHover
              globalFilter={globalFilter}
              emptyMessage="No record found."
              loading={loading}
              header={tableHeader}
            >
              <Column headerStyle={{ width: "3em" }}></Column>
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
              <Column
                field="approved_one"
                header="Approved"
                sortable
                body={approvedTemplate}
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
