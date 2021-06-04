/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from "primereact/dropdown";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { observer } from "mobx-react-lite";
import NoAccess from "../widgets/NoAccess"; 
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import ProductsStores from "../stores/ProductsStores";
import categories from "../shared/categories.json";
import dataHero from "data-hero";
import SubCategoryStore from "../stores/SubCategoryStore";
import BrandStore from "../stores/BrandStore";
import Utils from "../shared/localStorage";
const schema = {
  category: {
    isEmpty: false,
    min: 1,
    message: "category is required",
  },
};

const Product = () => {
  let acl;
  let pageAccess, canAdd, canView;

  const obj = Utils.get("acl");
  if (obj && obj !== "") {
    acl = JSON.parse(obj);
  }

  canAdd = acl && acl.product && acl.product.add;
  canView = acl && acl.product && acl.product.view;
  pageAccess = canAdd && canView;

  const toast = useRef(null);
  const dt = useRef(null);
  const [open, setOpen] = useState(false);
  const [approval, setApproval] = useState(false);
  const [rowData, setRowData] = useState();
  const [globalFilter, setGlobalFilter] = useState("");
  const store = useContext(ProductsStores);
  const subStore = useContext(SubCategoryStore);
  const brandStore = useContext(BrandStore);
  const {
    loading,
    getProducts,
    addProduct,
    error,
    action,
    allProduct,
    message,
    resetProperty,
    sending,
  } = store;
  const { getSubByCategory, subcategorySelect } = subStore;
  const { getBrands, brandSelect } = brandStore;
  useEffect(() => {
    getProducts();
    getBrands();
  }, []);
  const [formState, setFormState] = useState({
    values: {
      id: "",
      sub_id: "",
      best: false,
      branded: false,
      arrival: false,
      featured: false,
      brand_id: "",
      category: "",
      description: "",
    },
    touched: {},
    errors: {},
  });
  const { touched, errors, values, isValid } = formState;
  useEffect(() => {
    const errors = dataHero.validate(schema, values);
    setFormState((formState) => ({
      ...formState,
      isValid: errors.category.error ? false : true,
      errors: errors || {},
    }));
  }, [values]);
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const myUploader = (event) => {
    //event.files == files to open
    console.log(event.files);
    const fd = new FormData();
    fd.append("file", event.files);
     for(const element in values) {
      fd.append(element, values[element]);
     }
    addProduct(fd);
  }; 
  useEffect(() => {
    if (action === "productAdded" || action === "approved") {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: message,
      });
      setApproval(false);
      setOpen(false);
    }
    return () => {
      resetProperty("message", "");
      resetProperty("action", "");
      setApproval(false);
      setOpen(false);
    };
  }, [action]);
  useEffect(() => {
    if (
      error === true &&
      (action === "productError" || action === "approvedError")
    ) {
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
      setOpen(false);
    };
  }, [error]);
  const tableHeader = (
    <div className="p-d-flex p-jc-between">
      Product List
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

  const descTemplate = (data) => {
    return (
      <>
        <span className={`product-badge status-${data.description}`}>
          {data.description}
        </span>
      </>
    );
  };

  const actionTemplate = (data) => (
    <span className="p-buttonset">
      {canAdd ? (
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
    return <React.Fragment>Product Management</React.Fragment>;
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Create New"
          icon="pi pi-plus"
          className="p-mr-2 p-d-inline-block"
          onClick={(e) => setOpen(true)}
        />
        <Button
          label="Export"
          icon="pi pi-open"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const editData = (e, row) => {
    e.persist();
    setRowData(row);
    setOpen(true);
  };
  const onSelectChange = (e, field) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [field]: e.value,
      },
      touched: {
        ...formState.touched,
        [field]: true,
      },
    }));
    getSubByCategory(e.value);
  };
  const handleSpecialChange = (event, field) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [field]: event.checked,
      },
    }));
  };

  const handleContentChange = (e) => {
    setFormState((state) => ({
      ...state,
      values: {
        ...state.values,
        description: e,
      },
      touched: {
        ...state.touched,
        description: true,
      },
    }));
  };
  const hasError = (field) => touched[field] && errors[field].error;

  return (
    <Fragment>
      <Toast ref={toast} position="top-right" />
      <div className="card">
        <Toolbar
          className="p-mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>
        {pageAccess ? (
          <>
            <DataTable
              ref={dt}
              value={allProduct}
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
              <Column field="category" header="category" sortable></Column>
              <Column field="subName" header="Sub Category" sortable></Column>
              <Column field="brandName" header="Brand" sortable></Column>

              <Column
                field="description"
                header="Description"
                sortable
                body={descTemplate}
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
          <NoAccess page="product" />
        )}{" "}
      </div>
      <Dialog
        visible={open}
        onHide={(e) => setOpen(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
        header="Product Upload"
      >
        <Tooltip
          target=".custom-choose-btn"
          content="Choose"
          position="bottom"
        />
        <Tooltip target=".custom-open-btn" content="open" position="bottom" />
        <Tooltip
          target=".custom-cancel-btn"
          content="Clear"
          position="bottom"
        />

        <div className="card">
          {/* <h5>Images only</h5> */}
          <div className="p-field">
            <label htmlFor="name">Category</label>
            <Dropdown
              value={values.category}
              options={categories.data}
              onChange={(event) => onSelectChange(event, "category")}
              filter
              showClear
              filterBy="name"
              placeholder="Select a Category"
            />

            <small id="name-help" className="p-error p-d-block">
              {hasError("name") ? errors.name && errors.name.message : null}
            </small>
          </div>
          <div className="p-field">
            <label htmlFor="name">Sub Category</label>
            <Dropdown
              value={values.sub_id}
              options={subcategorySelect}
              onChange={(event) => onSelectChange(event, "sub_id")}
              filter
              showClear
              filterBy="sub_id"
              placeholder="Select One"
            />
          </div>
          <div className="p-field">
            <label htmlFor="name">Description</label>
            <SunEditor
              onChange={handleContentChange}
              name="description"
              setContents={values.description}
              showToolbar={true}
              setOptions={{
                buttonList: [
                  // default
                  ["undo", "redo"],
                  [
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "fontColor",
                    "blockquote",
                    "bold",
                    "underline",
                    "italic",
                    "list",
                  ],
                  ["table", "link", "image", "video"],
                  ["fullScreen"],
                  ["image", "video", "audio"],
                  [
                    "strike",
                    "subscript",
                    "superscript",
                    "hiliteColor",
                    "textStyle",
                    "removeFormat",
                    "outdent",
                    "indent",
                    "align",
                    "horizontalRule",
                    "lineHeight",
                    "table",
                    "link",
                    "fullScreen",
                    "showBlocks",
                    "codeView",
                  ],
                  ["preview", "print", "save", "template"],
                ],
              }}
            />
          </div>
          <div className="p-field">
            <label htmlFor="name"> Brand</label>
            <Dropdown
              value={values.brand_id}
              options={brandSelect}
              onChange={(event) => onSelectChange(event, "brand_id")}
              filter
              showClear
              filterBy="sub_id"
              placeholder="Select One"
            />
          </div>

          <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
            <div className="p-field-checkbox">
              <Checkbox
                inputId="branded"
                name="branded"
                checked={values.branded || false}
                onChange={(event) => handleSpecialChange(event, "branded")}
              />
              <label htmlFor="branded">Branded</label>
            </div>
            <div className="p-field-checkbox">
              <Checkbox
                inputId="best"
                name="best"
                checked={values.best || false}
                onChange={(event) => handleSpecialChange(event, "best")}
              />
              <label htmlFor="best">Best</label>
            </div>
            <div className="p-field-checkbox">
              <Checkbox
                inputId="arrival"
                name="arrival"
                checked={values.arrival || false}
                onChange={(event) => handleSpecialChange(event, "arrival")}
              />
              <label htmlFor="arrival">New arrival</label>
            </div>
            <div className="p-field-checkbox">
              <Checkbox
                inputId="featured"
                name="featured"
                checked={values.featured || false}
                onChange={(event) => handleSpecialChange(event, "featured")}
              />
              <label htmlFor="featured">Featured</label>
            </div>
          </div>

          <FileUpload
            name="demo[]"
            url="./open"
            customUpload
            uploadHandler={myUploader}
            accept="image/*"
            maxFileSize={1000000}
            multiple
            emptyTemplate={
              <p className="p-m-0">Drag and drop files to here to open.</p>
            }
          />
        </div>
      </Dialog>

      {/* <Dialog
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
      </Dialog> */}
    </Fragment>
  );
};

export default observer(Product);
