/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect, useContext, useRef } from "react";
import AccountList from "../components/account/AccountList";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { observer } from "mobx-react-lite";
import AccountStore from "../stores/AccountStore";
import AccountForm from "../components/account/AccountForm";
import ACLForm from "../components/account/ACL";
import NoAccess from "../widgets/NoAccess";
import Utils from "../shared/localStorage";

const Account = () => {
    let acl;
    let canAdd, canView, canDel, pageAccess;
    const obj = Utils.get("acl");
    // acl = Utils.get("acl");
    if (obj && obj !== "") {
        acl = JSON.parse(obj);
    }

    canAdd = acl && acl.staff && acl.staff.add;
    canView = acl && acl.staff && acl.staff.view;
    canDel = acl && acl.staff && acl.staff.del;
    pageAccess = canAdd || canView || canDel;

    const toast = useRef(null);
    const [title, setTitle] = useState("Add Staff");
    const store = useContext(AccountStore);
    const { error, loading, exist, action, message, removed, sending, users, checking, confirmEmail, resetProperty, getUsers, addStaff, updateStaff, setRole, removeStaff } = store;
    const [open, setOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [mode, setMode] = useState("");
    const [rowData, setRowData] = useState();
    const createNew = () => {
        setMode("Add");
        setOpen(true);
    };
    useEffect(() => {
        getUsers();
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
            setOpen(false);
        }
        return () => {
            resetProperty("message", "");
            resetProperty("action", "");
            setOpen(false);
        };
    }, [action]);
    useEffect(() => {
        if (action === "hasRole") {
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: message,
            });
            setModal(false);
        }
        return () => {
            resetProperty("message", "");
            resetProperty("action", "");
            setModal(false);
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
            setOpen(false);
        };
    }, [error]);
    useEffect(() => {
        if (error === true && action === "hasRoleError") {
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
            setModal(false);
        };
    }, [error]);
    return (
        <Fragment>
            <div className="p-grid">
                {pageAccess ? (
                    <>
                        <div className="p-col-12 p-md-12 p-lg-12">
                            <div className="p-d-flex p-jc-between">
                                <div>Staff Management</div>
                                <Button label="Create New" onClick={createNew} />
                            </div>
                        </div>
                        <div className="p-col-12 p-md-12 p-lg-12">
                            <AccountList data={users} toggle={setOpen} setMode={setMode} loading={loading} setModal={setModal} setTitle={setTitle} rowData={setRowData} removeData={removeStaff} canAdd={canAdd} canDel={canDel} />
                        </div>
                    </>
                ) : (
                    <NoAccess page="branch" />
                )}
            </div>
            <Dialog visible={open} onHide={(e) => setOpen(false)} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "50vw" }} header={title} className="p-fluid">
                <AccountForm mode={mode} action={action} error={error} exist={exist} message={message} sending={sending} checking={checking} confirm={confirmEmail} handleClose={setOpen} initial_data={rowData} reset={resetProperty} addStaff={addStaff} updateStaff={updateStaff} />
            </Dialog>
            <Dialog visible={modal} onHide={(e) => setModal(false)} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "50vw" }} modal header="Set Roles" className="p-fluid">
                <ACLForm error={error} action={action} message={message} sending={sending} reset={resetProperty} assignRole={setRole} toggle={setModal} initial_data={rowData} />
            </Dialog>
            <Toast ref={toast} position="top-right" />
        </Fragment>
    );
};

export default observer(Account);
