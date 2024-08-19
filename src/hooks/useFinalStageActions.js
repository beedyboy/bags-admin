import { Button } from "primereact/button"; 
import { Calendar } from "primereact/calendar";
import { getPermissions } from "../helpers/permissions";

export const useFinalStageActions = ({
  finalReport,
  date2,
  setDate2,
  exportCSV,
  exportPdf,
  exportExcel,
  handleSubmit,
}) => { 

  const { canReport } = getPermissions("reconcillation");
  const leftToolbarTemplate = () => (
    <>
      <Button
        label="CSV"
        icon="pi pi-file-excel"
        className="p-mr-2 p-button-info"
        onClick={exportCSV}
        disabled={!canReport}
      />
      <Button
        label="PDF"
        icon="pi pi-file-pdf"
        className="p-mr-2 p-button-danger"
        onClick={exportPdf}
        disabled={!canReport}
      />
      <Button
        label="Excel"
        icon="pi pi-file-excel"
        className="p-button-success"
        onClick={exportExcel}
        disabled={!canReport}
      />
    </>
  );

  const rightToolbarTemplate = () => (
    <>
      <Calendar
        value={date2}
        onChange={(e) => setDate2(e.value)}
        selectionMode="range"
        readOnlyInput
        placeholder="Select Date"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        className="p-button-primary"
        onClick={handleSubmit}
        disabled={!canReport || !date2}
      />
    </>
  );

  return {
    leftToolbarTemplate,
    rightToolbarTemplate,
  };
};
