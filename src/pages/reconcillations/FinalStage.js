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
import { MultiSelect } from "primereact/multiselect";
import { ColumnGroup } from "primereact/columngroup";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { observer } from "mobx-react-lite";
import NoAccess from "../../widgets/NoAccess";
import Utils from "../../shared/localStorage";
import moment from "moment";
import Assistant from "../../helpers/Assistant";

const FinalStage = () => {
  let acl;
  let reconReport, reconModify;

  const obj = Utils.get("acl");
  if (obj && obj !== "") {
    acl = JSON.parse(obj);
  }

  reconReport = acl && acl.reconcillation && acl.reconcillation.report;
  reconModify = acl && acl.reconcillation && acl.reconcillation.modify;

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
      field: "reconcile_date_one",
      header: "Reconcile Stage One",
    },
    {
      field: "reconcile_date_two",
      header: "Reconcile Stage Two",
    },
  ];
  const toast = useRef(null);
  const dt = useRef(null);
  const [selectedColumns, setSelectedColumn] = useState(columns);
  const [upload, setUpload] = useState(false);
  const [activeId, setActiveId] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [date2, setDate2] = useState(null);
  const store = useContext(ReconStore);
  const {
    loading,
    getFinalReport,
    error,
    action,
    finalReport,
    message,
    resetProperty,
    sending,
    revertRecord,
    reverting,
    reverted,
  } = store;

  const exportColumns = columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  const dateFormat = "DD-MM-YYYY";
  const handleSubmit = (e) => {
    // e.preventDefault();
    const data = {
      start_date: moment(date2[0]).format(dateFormat),
      end_date: moment(date2[1]).format(dateFormat),
    };
    getFinalReport(data);
  };
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const exportPdf = () => {
    const fileName =
      moment(date2[0]).format(dateFormat) +
      " to " +
      moment(date2[1]).format(dateFormat);
    Assistant.exportPdf(finalReport, exportColumns, fileName);
  };
  const exportExcel = () => {
    const fileName =
      moment(date2[0]).format(dateFormat) +
      " to " +
      moment(date2[1]).format(dateFormat);
    Assistant.exportExcel(finalReport, fileName);
  };
  useEffect(() => {
    if (action === "approved") {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: message,
      });
    }
    return () => {
      resetProperty("message", "");
      resetProperty("action", "");
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
      handleSubmit();
    }
    return () => {
      resetProperty("message", "");
      resetProperty("reverted", false);
      setActiveId(0);
    };
  }, [reverted]);

  const totalRecon = finalReport?.reduce((a, b) => a + b.amount_used, 0) || 0;
  const totalValue = finalReport?.reduce((a, b) => a + b.credit_amount, 0) || 0;

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

  const tableHeader = (
    <div className="p-d-flex p-jc-between">
      Reconcillation Record
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
      {reverting && activeId === data.id ? (
        <ProgressBar mode="indeterminate" />
      ) : (
        <>
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-warning"
            onClick={(e) => confirm(e, data)}
          />
        </>
      )}
    </span>
  );
  let footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Totals:"
          colSpan={2}
          footerStyle={{ textAlign: "right" }}
        />
        <Column footer={Assistant.formatCurrency(totalValue)} />
        <Column footer={Assistant.formatCurrency(totalRecon)} />
      </Row>
    </ColumnGroup>
  );

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Total Value" colSpan={2} />
        <Column header={Assistant.formatCurrency(totalValue)} colSpan={4} />
      </Row>
      <Row>
        <Column header="Credit Amount" colSpan={2} />
        <Column header={Assistant.formatCurrency(totalRecon)} colSpan={4} />
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
    return (
      <React.Fragment>
        <Calendar
          id="range"
          value={date2}
          onChange={(e) => setDate2(e.value)}
          selectionMode="range"
          showIcon
          readOnlyInput
        />
        <Button
          type="button"
          icon="pi pi-search"
          className="p-button-rounded p-ml-3"
          onClick={handleSubmit}
          disabled={
            date2 === null ||
            (date2[0] === null && date2[1] === null) ||
            sending
          }
        />
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        {reconReport ? (
          <div className="p-d-flex p-ai-center export-buttons">
            {finalReport.length > 0 ? (
              <>
                <Button
                  type="button"
                  icon="pi pi-file-o"
                  onClick={() => exportCSV(false)}
                  className="p-mr-2"
                  data-pr-tooltip="CSV"
                />
                <Button
                  type="button"
                  icon="pi pi-file-excel"
                  onClick={exportExcel}
                  className="p-button-success p-mr-2"
                  data-pr-tooltip="XLS"
                />
                <Button
                  type="button"
                  icon="pi pi-file-pdf"
                  onClick={exportPdf}
                  className="p-button-warning p-mr-2"
                  data-pr-tooltip="PDF"
                />
              </>
            ) : null}
          </div>
        ) : null}
      </React.Fragment>
    );
  };

  // const editData = (e, row) => {
  //   e.persist();
  //   setRowData(row);
  // };
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
        {reconModify ? (
          <>
            {" "}
            <Toolbar
              className="p-mb-4"
              left={leftToolbarTemplate}
              right={rightToolbarTemplate}
            ></Toolbar>
            <DataTable
              ref={dt}
              value={finalReport}
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
              footerColumnGroup={footerGroup}
            >
              {columnComponents}
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
      <Tooltip target=".export-buttons>button" position="bottom" />
    </Fragment>
  );
};

export default observer(FinalStage);
