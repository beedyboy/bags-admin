/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef } from "react";
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

const Account = () => {
    const { canAdd, canView } = getPermissions("staffs");
    const pageAccess = hasPageAccess("staffs");
    const toast = useRef(null);
    const { accountModal, isAccountFormOpened, toggleAccountForm, roleModalOpened, toggleRoleForm, message, removed, resetProperty, title, removeStaff } = useAccountStore();

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
                                <div>Staff Management </div>
                                {canAdd && <Button label="Create New" onClick={createNew} />}
                            </div>
                        </div>
                        {canView && (
                            <div className="p-col-12 p-md-12 p-lg-12">
                                <AccountList toggle={toggleAccountForm} removeData={removeStaff} />
                            </div>
                        )}
                    </>
                ) : (
                    <NoAccess page="branch" />
                )}
            </div>
            <Dialog visible={isAccountFormOpened} onHide={() => toggleAccountForm(false)} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "50vw" }} header={title} className="p-fluid">
                <AccountForm handleClose={toggleAccountForm} />
            </Dialog>
            <Dialog visible={roleModalOpened} onHide={toggleRoleForm} breakpoints={{ "960px": "75vw", "640px": "100vw" }} style={{ width: "50vw" }} modal header="Set Roles" className="p-fluid">
                <ACLForm />
            </Dialog>
            <Toast ref={toast} position="top-right" />
        </Fragment>
    );
};

export default observer(Account);
