import { create } from "zustand";
import backend from "../config";
import Utils from "../shared/localStorage";
import moment from "moment";

const useAccountStore = create((set) => ({
    // State variables
    title: "Add Staff",
    selectedStaffId: null,
    initial_data: {
        id: null,
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    },
    user: [],
    isAccountFormOpened: false,
    error: false,
    exist: false,
    saved: false,
    profileLoading: false,
    loading: false,
    removed: false,
    sending: false,
    checking: false,
    mode: "",
    message: "",
    home: "",
    errMessage: "",
    myProfile: {},
    profile: [],
    users: [],
    defaultPermissions: {
        brands: { add: false, view: false, del: false },
        category: { add: false, view: false, del: false },
        company: { manage: false },
        subscribers: { add: false, view: false, del: false },
        product: { add: false, view: false, del: false },
        staff: { add: false, view: false, del: false, modify: false },
        reconcillation: {
            upload: false,
            del: false,
            approval_one: false,
            approval_two: false,
            modify: false,
            report: false,
        },
        card: {
            create: false,
            charge: false,
            load: false,
            review: false,
            cashier: false,
            view: false,
            report: false,

        },
        report: { manage: false },
    },
    roleModalOpened: false,
    roleData: {},
    passwordChanged: false,
    isAuthenticated: false,
    action: null,
    option: "All",
    startDate: "",
    endDate: "",

    // Actions
    setTitle: (data) => set({ title: data }),
    setMode: (data) => set({ mode: data }),
    accountModal: (mode, title, data, open) => set({ mode, title, initial_data: data, isAccountFormOpened: open }),
    toggleAccountForm: () => {
        set((state) => ({ isAccountFormOpened: !state.isAccountFormOpened }));
    },

    confirmEmail: async (email) => {
        set({ checking: true, exist: false });
        try {
            const res = await backend.post("accounts/confirm", { email });
            if (res.data.status === 200) {
                console.log({ data: res.data.data });
                const data = res.data.data;
                set({
                    checking: false,
                    message: res.data.message,
                    exist: data.exist,
                    error: res.data.status !== 200,
                });
            }
        } catch (err) {
            set({ checking: false });
            console.log(err.response?.data.msg || "Server error");
        }
    },

    login: async (data) => {
        set({ sending: true, error: false, isAuthenticated: false, message: "", home: "" });
        try {
            const res = await backend.post("accounts/auth", data);
            if (res.status === 200) {
                console.log(res);
                Utils.save("name", `${res.data.lastname} ${res.data.firstname}`);
                Utils.save("acl", JSON.stringify(res.data.acl));
                Utils.save('refresh_token', res.data.refreshToken)
                set({
                    sending: false,
                    message: res.data.message,
                    home: res.data.home ?? "dashboard",
                    isAuthenticated: true,
                });
            } else {
                set({
                    sending: false,
                    errMessage: res.data.error,
                    error: true,
                    isAuthenticated: false,
                });
            }
        } catch (err) {
            set({ sending: false });
            console.log({ err });
        }
    },
    setMyProfile: (data) =>
    {
        if (data) {
            set({ myProfile: data });
        }
        else
        {
            set({ myProfile: {} });
        }
    },
    

    getProfileById: async (id) => {
        set({ profileLoading: true });
        try {
            const res = await backend.get(`accounts/staff/${id}`);
            set({
                profile: res.status === 200 ? res.data : [],
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
       toggleRoleForm: (data = null) =>
        {
            set((state) => ({
                roleModalOpened: !state.roleModalOpened,
                selectedStaffId: data?.id || null,
                roleData: (data?.roles && data.roles.length > 0) ? data.roles[0] : state.defaultPermissions, 
            }));
        },

    filterProperty: (option, data) => {
        switch (option) {
            case "All":
                set({ option, startDate: "", endDate: "" });
                break;
            case "Filter":
                set({
                    option,
                    startDate: moment(data[0]).format("YYYY-MM-DD"),
                    endDate: moment(data[1]).format("YYYY-MM-DD"),
                });
                break;
            default:
                break;
        }
    },

    getStats: () => {
        const { users, option, startDate, endDate } = useAccountStore.getState();
        switch (option) {
            case "All":
                return users.length || 0;
            case "Filter":
                return (
                    users.filter((d) => {
                        const date = moment(d.created_at).format("YYYY-MM-DD");
                        return date >= startDate && date <= endDate;
                    }).length || 0
                );
            default:
                return 0;
        }
    },

    removeStaff: async (id) => {
        set({ removed: false });
        try {
            const res = await backend.delete(`accounts/${id}`);
            if (res.status === 200) {
                useAccountStore.getState().getUsers();
                set({ message: res.data.message, removed: true });
            } else {
                set({ message: res.data.error, error: true, removed: false });
            }
        } catch (err) {
            set({ removed: false });
            console.log(err);
        }
    },

    resetProperty: (key, value) => {
        set({ [key]: value });
    },
}));

export default useAccountStore;