import { Button } from "primereact/button"; 
import { Calendar } from "primereact/calendar";
import { getPermissions } from "../helpers/permissions";
import useReconStore from "../stores/ReconStore";

export const useFinalStageActions = ({
  isLoading,
  exportCSV,
  exportPdf,
  exportExcel,
  handleSubmit,
}) => { 

  const { canReport } = getPermissions("reconcillation");
  const { finalDate, setFinalReportDate } = useReconStore();
  
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
        value={finalDate}
        onChange={(e) => setFinalReportDate(e.value)}
        selectionMode="range"
        readOnlyInput
        placeholder="Select Date"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        className="p-button-primary"
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={!canReport || !finalDate?.length || isLoading}
      />
    </>
  );

  return {
    leftToolbarTemplate,
    rightToolbarTemplate,
  };
};
