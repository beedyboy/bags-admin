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

export const getProfileAPI = async (id, data) =>
{
    return await backend.get(`accounts/profile`, data);
};

getProfile: async () => {
    set({ profileLoading: true });
    try {
        const res = await backend.get("accounts/profile");
        set({
            myProfile: res.status === 200 ? res.data : [],
            profileLoading: false,
        });
    } catch (err) {
        set({
            profileLoading: false,
            error: true,
            errMessage: err.response?.data.error || "Network Connection seems slow.",
            action: err.response?.status === 401 ? "logout" : "",
        });
    }
},
