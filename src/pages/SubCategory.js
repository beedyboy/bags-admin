/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import SubCategoryList from "../components/subcategory/SubCategoryList";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { observer } from "mobx-react-lite";
import SubCategoryStore from "../stores/SubCategoryStore";
import SubCategoryForm from "../components/subcategory/SubCategoryForm";

const SubCategory = () => {
  const toast = useRef(null);
  const [title, setTitle] = useState("Add SubCategory");
  const store = useContext(SubCategoryStore);
  const {
    loading,
    getSubCategories,
    subcategory,
    error,
    checking,
    confirmRow,
    exist,
    action,
    message,
    removed,
    removeSubCategory,
    resetProperty,
    sending,
    addSubCat,
    updateSubCat,
  } = store;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [rowData, setRowData] = useState();
  const createNew = () => {
    setMode("Add");
    setOpen(!open);
  };
  const toggle = () => {
    setOpen(!open);
  };
  useEffect(() => {
    getSubCategories();
  }, []);

  useEffect(() => {
    if (removed === true) {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: message,
      });
    }
    return () => {
      resetProperty("removed", false);
      resetProperty("message", "");
    };
  }, [removed]);
  useEffect(() => {
    if (action === "newSubCategory") {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: message,
      });
      toggle();
    }
    return () => {
      resetProperty("message", "");
      resetProperty("action", "");
      toggle();
    };
  }, [action]);
  useEffect(() => {
    if (error === true && action === "newSubCategoryError") {
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
      toggle();
    };
  }, [error]);
  return (
    <Fragment>
      <div className="p-grid">
        <div className="p-col-12 p-md-12 p-lg-12">
          <div className="p-d-flex p-jc-between">
            <div>SubCategory Management</div>
            <Button label="Create New" onClick={createNew} />
          </div>
        </div>
        <div className="p-col-12 p-md-12 p-lg-12">
          <SubCategoryList
            data={subcategory}
            setMode={setMode}
            toggle={toggle}
            setTitle={setTitle}
            loading={loading}
            rowData={setRowData}
            removeData={removeSubCategory}
          />
        </div>
      </div>
      <Dialog
        visible={open}
        onHide={toggle}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
        modal
        header={title}
        className="p-fluid"
      >
        <SubCategoryForm
          mode={mode}
          action={action}
          error={error}
          exist={exist}
          message={message}
          sending={sending}
          checking={checking}
          confirm={confirmRow}
          handleClose={toggle}
          initial_data={rowData}
          reset={resetProperty}
          addSubCat={addSubCat}
          updateSubCat={updateSubCat}
        />
      </Dialog>
      <Toast ref={toast} position="top-right" />
    </Fragment>
  );
};

export default observer(SubCategory);
