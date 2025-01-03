import Utils from "../shared/localStorage";


export const getPermissions = (pageName) =>
{
    const aclString = Utils.get("acl");
    if (!aclString) return { add: false, view: false, del: false, modify: false, cashier: false, upload: false, approval_one: false, approval_two: false, report: false };
    const acl = JSON.parse(aclString);
    // if (acl.length === 0) return { add: false, view: false, del: false, modify: false, cashier: false, upload: false, approval_one: false, approval_two: false, report: false };

    const permissions = acl[0][pageName] || {};
    
    return {
        canAdd: permissions.add || false,
        canView: permissions.view || false,
        canDel: permissions.del || false,
        canModify: permissions.modify || false,
        canUpload: permissions.upload || false,
        canApproveStageOne: permissions.approval_one || false,
        canApproveStageTwo: permissions.approval_two || false,
        canReport: permissions.report || false,
        cashier: permissions.cashier || false,
        // cardReport: permissions.cashier || false,
    };
};

export const hasPageAccess = (pageName) => {
    const permissions = getPermissions(pageName);
    return permissions.canAdd || permissions.canView || permissions.canDel || permissions.canModify;
};
