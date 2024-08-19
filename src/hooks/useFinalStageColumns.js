import { useState, useRef } from "react";
import { useGetFinalStageTransactions } from "./reconcillations";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { ColumnGroup } from "primereact/columngroup";
import { confirmDialog } from "primereact/confirmdialog";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { Row } from "primereact/row";
import { Button } from "primereact/button";
import moment from "moment";
import Assistant from "../helpers/Assistant";

export const useFinalStageColumns = () => {
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
  const [globalFilter, setGlobalFilter] = useState("");
  const [date2, setDate2] = useState(null);
  const [query, setQuery] = useState("");

  const { data: finalReport, isLoading } = useGetFinalStageTransactions(query);

  const exportColumns = columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const dateFormat = "DD-MM-YYYY";

  const handleSubmit = () => {
    const data = new URLSearchParams();
    data.append("start_date", moment(date2[0]).format(dateFormat));
    data.append("end_date", moment(date2[1]).format(dateFormat));
    setQuery(data);
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
      {/* {activeId === data.id ? (
        <ProgressBar mode="indeterminate" />
      ) : (
        <>
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-warning"
            onClick={(e) => confirm(e, data)}
          />
        </>
      )} */}
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
        <Column header="Ref No" rowSpan={2} />
        <Column header="Canc No" rowSpan={2} />
        <Column header="Reconcile Stage One" rowSpan={2} />
        <Column header="Reconcile Stage Two" rowSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const confirm = (event, data) => {
    confirmDialog({
      message: `Do you want to delete record from ${data.value_date}?`,
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
    //   accept: () => handleDelete(data.id),
    });
  };

  return {
    toast,
    dt,
    selectedColumns,
    globalFilter,
    date2,
    setSelectedColumn,
    setGlobalFilter,
    setDate2,
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
