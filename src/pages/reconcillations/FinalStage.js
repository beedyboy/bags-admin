import React, { Fragment } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import NoAccess from "../../widgets/NoAccess";
import { getPermissions } from "../../helpers/permissions";
import { useFinalStageColumns } from "../../hooks/useFinalStageColumns";
import { useFinalStageActions } from "../../hooks/useFinalStageActions";

const FinalStage = () => {
  const { canModify } = getPermissions("reconcillation");
  const {
    toast,
    dt,
    globalFilter,
    date2,
    setDate2,
    finalReport,
    isLoading,
    exportCSV,
    exportPdf,
    exportExcel,
    handleSubmit,
    columnComponents,
    tableHeader,
    actionTemplate,
    headerGroup,
    footerGroup,
  } = useFinalStageColumns();

  const { leftToolbarTemplate, rightToolbarTemplate } =
    useFinalStageActions({
      finalReport,
      date2,
      setDate2,
      exportCSV,
      exportPdf,
      exportExcel,
      handleSubmit,
    });

  return (
    <Fragment>
      <Toast ref={toast} position="top-right" />
      <div className="card">
        {canModify ? (
          <>
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
              loading={isLoading}
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
        )}
      </div>

      
      <Tooltip target=".export-buttons>button" position="bottom" />
    </Fragment>
  );
};

export default FinalStage;
