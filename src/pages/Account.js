/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect, useRef } from "react";
import AccountList from "../components/account/AccountList";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { observer } from "mobx-react-lite";
import AccountForm from "../components/account/AccountForm";
import ACLForm from "../components/account/ACL";
import NoAccess from "../widgets/NoAccess";
import useAccountStore from "../stores/AccountStore";
import { getPermissions, hasPageAccess } from "../helpers/permissions";

const Account = () =>
{
    const { canAdd, canView, canDel } = getPermissions("staffs");
    const pageAccess = hasPageAccess("staffs");

    const toast = useRef(null);

    const { accountModal, isAccountFormOpened, toggleAccountForm, error, action, message, removed, sending, resetProperty, title, setRole, removeStaff } = useAccountStore();

    const [modal, setModal] = useState(false);
    const [rowData, setRowData] = useState();

    const createNew = () => {
        accountModal("Add", "Add Staff", {}, true);
    };

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
                            <AccountList toggle={toggleAccountForm} setModal={setModal} rowData={setRowData} removeData={removeStaff} canAdd={canAdd} canDel={canDel} />
                        </div>
                    </>
                ) : (
                    <NoAccess page="branch" />
                )}
            </div>
            <Dialog visible={isAccountFormOpened} onHide={() => toggleAccountForm(false)} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "50vw" }} header={title} className="p-fluid">
                <AccountForm handleClose={toggleAccountForm} />
            </Dialog>
            <Dialog visible={modal} onHide={() => setModal(false)} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "50vw" }} modal header="Set Roles" className="p-fluid">
                <ACLForm error={error} action={action} message={message} sending={sending} reset={resetProperty} assignRole={setRole} toggle={setModal} initial_data={rowData} />
            </Dialog>
            <Toast ref={toast} position="top-right" />
        </Fragment>
    );
};

export default observer(Account);
