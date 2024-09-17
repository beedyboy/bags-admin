import { useState, useRef } from "react";
import { useGetFinalStageTransactions, useOverturn } from "./reconcillations";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { ColumnGroup } from "primereact/columngroup";
import { confirmDialog } from "primereact/confirmdialog";
import { Column } from "primereact/column";
import { Row } from "primereact/row";
import moment from "moment";
import Assistant from "../helpers/Assistant";
import useReconStore from "../stores/ReconStore";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";

export const useFinalStageColumns = () => {
  const columns = [
    { field: "value_date", header: "Value Date" },
    { field: "remarks", header: "Remarks" },
    { field: "credit_amount", header: "Credit Amount" },
    { field: "amount_used", header: "Amount Used" },
    { field: "balance", header: "Balance" },
    { field: "way_bill_number", header: "Waybill No" },
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
  const [globalFilter, setGlobalFilter] = useState("");


  const { finalDate, finalReportQuery, setFinalReportQuery, setRevertId, revertId } = useReconStore();
  const {  isPending: isReverting, mutate  } = useOverturn("final");
  const { data: finalReport, isLoading, refetch } = useGetFinalStageTransactions(finalReportQuery);

  const exportColumns = columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const dateFormat = "DD-MM-YYYY";

  const handleSubmit = () => {
    const data = new URLSearchParams();
    data.append("start_date", moment(finalDate[0]).format(dateFormat));
    if (finalDate[1]) {
      data.append("end_date", moment(finalDate[1]).format(dateFormat));
    }
    setFinalReportQuery(data.toString());
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportPdf = () => {
    const fileName =
      moment(finalDate[0]).format(dateFormat) +
      " to " +
      moment(finalDate[1]).format(dateFormat);
    Assistant.exportPdf(finalReport, exportColumns, fileName);
  };

  const exportExcel = () => {
    const fileName =
      moment(finalDate[0]).format(dateFormat) +
      " to " +
      moment(finalDate[1]).format(dateFormat);
    Assistant.exportExcel(finalReport, fileName);
  };

  const totalRecon =
    finalReport?.reduce((a, b) => a + b.amount_used, 0) || 0;
  const totalValue =
    finalReport?.reduce((a, b) => a + b.credit_amount, 0) || 0;

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setSelectedColumn(orderedSelectedColumns);
  };

  const columnComponents = selectedColumns.map((col) => (
    <Column
      key={col.field}
      field={col.field}
      header={col.header}
      body={col.template ?? false}
      sortable
    />
  ));

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
      {isReverting && revertId && data.id === parseInt(revertId) ? (
        <ProgressBar mode="indeterminate" />
      ) : (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-warning"
            onClick={(e) => confirm(e, data)}
          />
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
        <Column footer={totalValue.toFixed(2)} />
        <Column footer={totalRecon.toFixed(2)} />
      </Row>
    </ColumnGroup>
  );

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Value Date" rowSpan={2} />
        <Column header="Remarks" rowSpan={2} />
        <Column header="Credit Amount" colSpan={1} />
        <Column header="Amount Used" colSpan={1} />
        <Column header="Balance" rowSpan={2} />
        <Column header="way_bill_number" rowSpan={2} />
        <Column header="Ref No" rowSpan={2} />
        <Column header="Canc No" rowSpan={2} />
        <Column header="Reconcile Stage One" rowSpan={2} />
        <Column header="Reconcile Stage Two" rowSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const confirm = (e, row) => {
    e.persist();
    confirmDialog({
      message: `Do you want to delete record for ${row.reference}?`,
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => revertData(row),
    });
  };

  const revertData = (row) =>
    {
      setRevertId(row.id);
    mutate(row.id, {
      onSuccess: () => {
        refetch(); 
      },
    });
  };
  
  return {
    toast,
    dt,
    selectedColumns,
    globalFilter,
    setSelectedColumn,
    setGlobalFilter,
    finalReport,
    isLoading,
    exportCSV,
    exportPdf,
    exportExcel,
    handleSubmit,
    totalRecon,
    totalValue,
    onColumnToggle,
    columnComponents,
    tableHeader,
    actionTemplate,
    headerGroup,
    footerGroup,
    confirm,
  };
};
