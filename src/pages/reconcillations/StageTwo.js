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
import { FileUpload } from "primereact/fileupload";
import { observer } from "mobx-react-lite";
import StepOneForm from "../../components/recon/StepOneForm";

const StageTwo = () => {
  const toast = useRef(null);
  const dt = useRef(null);
  const [upload, setUpload] = useState(false);
  const [approval, setApproval] = useState(false);
  const [rowData, setRowData] = useState();
  const [globalFilter, setGlobalFilter] = useState("");
  const store = useContext(ReconStore);
  const {
    loading,
    filterRecord,
    uploadStatement,
    error,
    action,
    finales,
    message,
    resetProperty,
    sending,
    saveApproval,
  } = store;
  useEffect(() => {
    filterRecord("approved_two", false, "finales");
  }, []);
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const myUploader = (event) => {
    //event.files == files to upload
    const fd = new FormData();
    fd.append("file", event.files[0]);
    uploadStatement(fd);
  };
  useEffect(() => {
    if (action === "accountUploaded") {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: message,
      });
      setApproval(false);
      setUpload(false);
    }
    return () => {
      resetProperty("message", "");
      resetProperty("action", "");
      setApproval(false);
      setUpload(false);
    };
  }, [action]);
  useEffect(() => {
    if (error === true && action === "uploadError") {
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
      setUpload(false);
    };
  }, [error]);
  const tableHeader = (
    <div className="table-header">
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
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={(e) => setUpload(true)}
        />
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="p-mr-2 p-d-inline-block"
        />
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
          <Column field="amount_used" header="Amount Used" sortable></Column>
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

        <div className="card">
          <h5>Advanced</h5>
          <FileUpload
            name="demo[]"
            url="./upload"
            customUpload
            uploadHandler={myUploader}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            maxFileSize={1000000}
            emptyTemplate={
              <p className="p-m-0">Drag and drop files to here to upload.</p>
            }
          />
        </div>
      </Dialog>

      <Dialog
        visible={approval}
        onHide={(e) => setApproval(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
        header="Approve Record"
      >
        <StepOneForm
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
