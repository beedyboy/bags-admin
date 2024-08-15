/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { FileUpload } from "primereact/fileupload";
import StepOneForm from "../../components/recon/StepOneForm";
import NoAccess from "../../widgets/NoAccess";
import { ProgressSpinner } from "primereact/progressspinner";
import Assistant from "../../helpers/Assistant";
import { useGetStageOneTransactions, useUploadStatement } from "../../hooks/reconcillations";
import { getPermissions, hasPageAccess } from "../../helpers/permissions";
import useReconStore from "../../stores/ReconStore";

const StageOne = () => {
    const { canAdd, canApproveStageOne, canUpload } = getPermissions("reconcillation");
    const pageAccess = hasPageAccess("staffs");

    const { data: stageOneData, isLoading } = useGetStageOneTransactions();

    const approvedTemplate = (data) => {
        return (
            <>
                <span className={`table-badge status-${data.approved_one}`}>{data.approved_one ? "Yes" : "No"}</span>
            </>
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
    const columns = [
        { field: "value_date", header: "Value Date" },
        { field: "remarks", header: "Remarks", template: remarkBodyTemplate },
        { field: "credit_amount", header: "Credit Amount" },
        { field: "amount_used", header: "Amount Used" },
        { field: "balance", header: "Balance" },
        { field: "reference", header: "Ref No" },
        {
            field: "cancellation_number",
            header: "Canc No",
        },
        {
            field: "approved_one",
            header: "Approved",
            template: approvedTemplate,
        },
    ];
    const dt = useRef(null);
    const [selectedColumns, setSelectedColumn] = useState(columns);
  
  
  const [globalFilter, setGlobalFilter] = useState("");
  
    const { modifyStepOneData, toggleUpload, upload, toggleStepOneForm, isStepOneFormOpened } = useReconStore();
 
    const { mutate: uploadStatement, isLoading: isUploading } = useUploadStatement();

    const handleUpload = (event) => {
        const data = new FormData();
        data.append("file", event.files[0]);
        uploadStatement(data);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
        setSelectedColumn(orderedSelectedColumns);
    };
    const columnComponents = selectedColumns.map((col) => {
        return <Column key={col.field} field={col.field} header={col.header} body={col.template ?? false} sortable />;
    });


    const totalValue = stageOneData?.reduce((a, b) => a + parseFloat(b.credit_amount), 0) || 0;
    const tableHeader = (
        <div className="p-d-flex p-jc-between">
            Stage One List
            <div style={{ textAlign: "left" }}>
                <MultiSelect value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{ width: "20em" }} />
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
            </span>
        </div>
    );

    const actionTemplate = (data) => (
        <span className="p-buttonset">
            {canUpload ? <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={(e) => editData(e, data)} /> : null}
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"  onClick={(e) => deleteData(e, data.id)}/> */}
        </span>
    );
    const leftToolbarTemplate = () => {
        return <React.Fragment>Stage One Management</React.Fragment>;
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-mr-2 p-d-inline-block" onClick={toggleUpload} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
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
                <Column header={`${stageOneData?.length} item(s)`} colSpan={4} />
            </Row>
            <Row>{columnComponents}</Row>
        </ColumnGroup>
    );

    const editData = (e, row) => {
        e.persist();
        modifyStepOneData(row, true);
    };

    return (
        <Fragment>
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                {canApproveStageOne ? (
                    <>
                        <DataTable
                            ref={dt}
                            value={stageOneData}
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
                            loading={isLoading}
                            header={tableHeader}
                            headerColumnGroup={headerGroup}
                        >
                            {/* <Column headerStyle={{ width: "3em" }}></Column> */}
                            {columnComponents}
                            <Column
                                headerStyle={{ width: "8rem", textAlign: "center" }}
                                header="Code"
                                bodyStyle={{
                                    textAlign: "center",
                                    overflow: "visible",
                                    justifyContent: "center",
                                }}
                                body={actionTemplate}
                            />
                        </DataTable>
                    </>
                ) : (
                    <NoAccess page="stage one" />
                )}{" "}
            </div>
            <Dialog visible={upload} onHide={toggleUpload} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "50vw" }} header="Upload Statement">
                <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                <div className="card">
                    <h5>Excel File only</h5>
                    <FileUpload name="demo[]" url="./upload" customUpload uploadHandler={handleUpload} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" maxFileSize={2000000} emptyTemplate={<p className="p-m-0">Drag and drop files to here to upload.</p>} />
                </div>
                {isUploading ? <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" /> : null}
            </Dialog>

            <Dialog visible={isStepOneFormOpened} onHide={toggleStepOneForm} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "50vw" }} header="Approve Record">
                <StepOneForm />
            </Dialog>
        </Fragment>
    );
};

export default StageOne;
