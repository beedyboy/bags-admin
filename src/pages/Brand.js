/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import BrandList from "../components/brand/BrandList";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { observer } from "mobx-react-lite";
import BrandStore from "../stores/BrandStore";
import BrandForm from "../components/brand/BrandForm";
import NoAccess from "../widgets/NoAccess";
import Utils from "../shared/localStorage";

const Brand = (props) => {
  let acl;
  let canAdd,
  canView,
    canDel,
    pageAccess;  
  const obj = Utils.get("acl");
  if (obj && obj !== "") { 
    acl = JSON.parse(obj); 
  }
  canAdd = acl && acl.brands && acl.brands.add;
  canView = acl && acl.brands && acl.brands.view;
  canDel = acl && acl.brands && acl.brands.del;
  pageAccess = canAdd || canView || canDel;

  const toast = useRef(null);
  const store = useContext(BrandStore); 
  const {
    loading,
    getBrands,
    brands,
    error,
    checking,
    confirmName,
    exist,
    action,
    message,
    removed,
    removeBrand,
    resetProperty,
    sending,
    createBrand,
    updateBrand,
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
    getBrands();
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
    if (action === "newBrand") {
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
    };
  }, [action]);
  useEffect(() => {
    if (error === true && action === "newBrandError") {
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
  return (
    <Fragment>
      <div className="p-grid">
        {pageAccess ? (
          <>
            <div className="p-col-12 p-md-12 p-lg-12">
              <div className="p-d-flex p-jc-between">
                <div>Brands</div>
                {canAdd ? (
                  <Button label="Create New" onClick={(e) => createNew} />
                ) : null}{" "}
              </div>
            </div>
            <div className="p-col-12 p-md-12 p-lg-12">
              <BrandList
                data={brands}
                setMode={setMode}
                toggle={toggle}
                loading={loading}
                rowData={setRowData}
                removeData={removeBrand}
                canAdd={canAdd}
                canDel={canDel}
              />
            </div>
          </>
        ) : (
          <NoAccess page="branch" />
        )}{" "}
      </div>
      <Dialog
        visible={open}
        onHide={toggle}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <BrandForm
          mode={mode}
          action={action}
          error={error}
          exist={exist}
          message={message}
          sending={sending}
          checking={checking}
          confirm={confirmName}
          handleClose={toggle}
          initial_data={rowData}
          reset={resetProperty}
          createBrand={createBrand}
          updateBrand={updateBrand}
        />
      </Dialog>
      <Toast ref={toast} position="top-right" />
    </Fragment>
  );
};

export default observer(Brand);
