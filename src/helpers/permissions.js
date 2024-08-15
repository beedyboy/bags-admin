import Utils from "../shared/localStorage";


export const getPermissions = (pageName) => {
    const acl = JSON.parse(Utils.get("acl") || "[]");
    if (acl.length === 0) return { add: false, view: false, del: false, modify: false };

    const permissions = acl[0][pageName] || {};
    
    return {
        canAdd: permissions.add || false,
        canView: permissions.view || false,
        canDel: permissions.del || false,
        canModify: permissions.modify || false,
        canUpload: permissions.upload || false,
        canApproveStageOne: permissions.approval_one || false,
        canApproveStageTwo: permissions.approval_two || false,
    };
};

export const hasPageAccess = (pageName) => {
    const permissions = getPermissions(pageName);
    return permissions.canAdd || permissions.canView || permissions.canDel || permissions.canModify;
};
