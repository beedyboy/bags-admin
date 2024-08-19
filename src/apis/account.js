import backend from "../config";

export const getStaffs = async () => {
    return await backend.get("accounts");
};

export const addStaff = async (data) => {
    return await backend.post("accounts", data);
};

export const updateStaff = async (id, data) =>
{
    return await backend.put(`accounts/${id}`, data);
};

export const getProfileAPI = async () =>
{
    return await backend.get(`accounts/profile`);
};


export const updateProfile = async (data) =>
{
    return await backend.put(`accounts/profile/update`, data);
};

export const setRoleAPI = async (data) =>
{
    return await backend.put(`accounts/profile/roles`, data);
};