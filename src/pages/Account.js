/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import AccountList from "../components/account/AccountList";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { observer } from "mobx-react-lite";
import AccountStore from "../stores/AccountStore";
import AccountForm from "../components/account/AccountForm";

const Account = () => {
  const toast = useRef(null);
  const [title, setTitle] = useState("Add Staff");
  const store = useContext(AccountStore);
  const {
    loading,
    getSubCategories,
    users,
    error,
    checking,
    confirmRow,
    exist,
    action,
    message,
    removed,
    removeAccount,
    resetProperty,
    sending,
    addSubCat,
    updateSubCat,
  } = store;
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
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
    if (action === "newStaff") {
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
    if (error === true && action === "newStaffError") {
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
            <div>Staff Management</div>
            <Button label="Create New" onClick={createNew} />
          </div>
        </div>
        <div className="p-col-12 p-md-12 p-lg-12">
          <AccountList
            data={users}
            setMode={setMode}
            toggle={toggle}
            setTitle={setTitle}
            loading={loading}
            rowData={setRowData}
            removeData={removeAccount}
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
        <AccountForm
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

export default observer(Account);
