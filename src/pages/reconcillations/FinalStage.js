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
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { TabView, TabPanel } from "primereact/tabview";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { observer } from "mobx-react-lite";
import NoAccess from "../../widgets/NoAccess";
import FinalStepForm from "../../components/recon/FinalStepForm";
import Utils from "../../shared/localStorage";
import { useParams } from "react-router-dom";
import { StageTwoView, StageOneView } from "..";

const FinalStage = () => {
  let acl;
  let reconTwo;

  const obj = Utils.get("acl");
  if (obj && obj !== "") {
    acl = JSON.parse(obj);
  }

  reconTwo = acl && acl.reconcillation && acl.reconcillation.approval_two;
  // reconReport = acl && acl.reconcillation && acl.reconcillation.report;
  // reconModify = acl && acl.reconcillation && acl.reconcillation.modify;

  const params = useParams();
  const toast = useRef(null);
  const dt = useRef(null);
  const [upload, setUpload] = useState(false);
  const [approval, setApproval] = useState(false);
  const [activeId, setActiveId] = useState(0);
  const [rowData, setRowData] = useState();
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const store = useContext(ReconStore);
  const {
    loading,
    getAllData,
    error,
    action,
    reconcillations,
    message,
    resetProperty,
    sending,
    saveApproval,
    revertRecord,
    reverting,
    reverted,
  } = store;
  useEffect(() => {
    getAllData();
    switch (params && params.slug) {
      case "default":
        setActiveIndex(0);
        break;

      case "open":
        setActiveIndex(1);
        break;

      case "final":
        setActiveIndex(2);
        break;

      default:
        setActiveIndex(0);
        break;
    }
  }, [params.slug]);

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
      // finaleRecord();
    }
    return () => {
      resetProperty("message", "");
      resetProperty("reverted", false);
      setActiveId(0);
    };
  }, [reverted]);
  const tableHeader = (
    <div className="p-d-flex p-jc-between">
      Reconcillation Record
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
    return <React.Fragment>Reconcillation Final Stage</React.Fragment>;
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
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="All Record">
          {/* <div className="card"> */}
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
                  value={reconcillations}
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
                >
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
              <NoAccess page="final stage" />
            )}{" "}
          {/* </div> */}
        </TabPanel>
        <TabPanel header="Open Reconcillation">
          <StageOneView />
        </TabPanel>
        <TabPanel header="Final Reconcillation">
          {" "}
          <StageTwoView />
        </TabPanel>
      </TabView>
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
        <FinalStepForm
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

export default observer(FinalStage);