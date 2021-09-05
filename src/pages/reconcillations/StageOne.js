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
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { observer } from "mobx-react-lite";
import StepOneForm from "../../components/recon/StepOneForm";
import NoAccess from "../../widgets/NoAccess";
import Utils from "../../shared/localStorage";
import { ProgressSpinner } from "primereact/progressspinner";
import Assistant from "../../helpers/Assistant";

const StageOne = () => {
  let acl;
  let reconOne, reconUpload;

  const obj = Utils.get("acl");
  if (obj && obj !== "") {
    acl = JSON.parse(obj);
  }

  reconUpload = acl && acl.reconcillation && acl.reconcillation.upload;
  reconOne = acl && acl.reconcillation && acl.reconcillation.approval_one;

  const toast = useRef(null);
  const dt = useRef(null);
  const [upload, setUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [approval, setApproval] = useState(false);
  const [rowData, setRowData] = useState();
  const [globalFilter, setGlobalFilter] = useState("");
  const store = useContext(ReconStore);
  const {
    loading,
    pristineRecord,
    uploadStatement,
    error,
    action,
    pristine,
    message,
    resetProperty,
    sending,
    saveApproval,
  } = store;
  useEffect(() => {
    pristineRecord();
  }, []);
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const myUploader = (event) => {
    //event.files == files to upload
    const fd = new FormData();
    fd.append("file", event.files[0]);
    setUploading(true);
    uploadStatement(fd);
  };
  useEffect(() => {
    if (action === "accountUploaded" || action === "approved") {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: message,
      });
      setUploading(false);
      setApproval(false);
      setUpload(false);
    }
    return () => {
      setUploading(false);
      resetProperty("message", "");
      resetProperty("action", "");
      setApproval(false);
      setUpload(false);
    };
  }, [action]);
  useEffect(() => {
    if (
      error === true &&
      (action === "uploadError" || action === "approvedError")
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error Message",
        detail: message,
      });

      setUploading(false);
    }
    return () => {
      setUploading(false);
      resetProperty("error", false);
      resetProperty("message", "");
      resetProperty("action", "");
      setApproval(false);
      setUpload(false);
    };
  }, [error]);

  const totalValue = pristine?.reduce((a, b) => a + parseFloat(b.credit_amount), 0) || 0;
  const tableHeader = (
    <div className="p-d-flex p-jc-between">
      Stage One List
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
      {reconUpload ? (
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={(e) => editData(e, data)}
        />
      ) : null}
      {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"  onClick={(e) => deleteData(e, data.id)}/> */}
    </span>
  );
  const leftToolbarTemplate = () => {
    return <React.Fragment>Stage One Management</React.Fragment>;
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-mr-2 p-d-inline-block"
          onClick={(e) => setUpload(true)}
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
  const remarkBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <div className="p-text-wrap" style={{ width: "10rem" }}>
          {row.remarks}
        </div>
        {/* {row.remarks && row.remarks.length > 33
          ? row.remarks.slice(0, 33) + " . . ."
          : row.remarks} */}
      </React.Fragment>
    );
  };

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Total Value" colSpan={2} />
        <Column header={Assistant.formatCurrency(totalValue)} colSpan={4} />
      </Row>
      <Row>
        <Column header="Total Pending" colSpan={2} />
        <Column header={pristine.length} colSpan={4} />
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
        {reconOne ? (
          <>
            <DataTable
              ref={dt}
              value={pristine}
              paginator
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              rowsPerPageOptions={[10, 25, 50]}
              className="p-datatable-customers p-datatable-responsive"
              rows={10}
              dataKey="id"
              rowHover
              columnResizeMode="expand"
              resizableColumns
              scrollable
              globalFilter={globalFilter}
              emptyMessage="No record found."
              loading={loading}
              header={tableHeader}
              headerColumnGroup={headerGroup}
            >
              {/* <Column headerStyle={{ width: "3em" }}></Column> */}
              <Column field="value_date" header="Value Date" sortable></Column>
              <Column
                body={remarkBodyTemplate}
                header="Remarks"
                field="remarks"
                sortable
              ></Column>
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
          <NoAccess page="stage one" />
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

        <div className="card">
          <h5>Excel File only</h5>
          <FileUpload
            name="demo[]"
            url="./upload"
            customUpload
            uploadHandler={myUploader}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            maxFileSize={2000000}
            emptyTemplate={
              <p className="p-m-0">Drag and drop files to here to upload.</p>
            }
          />
        </div>
        {uploading ? (
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="8"
            fill="#EEEEEE"
            animationDuration=".5s"
          />
        ) : null}
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

export default observer(StageOne);
