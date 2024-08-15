import { create } from "zustand";
import backend from "../config";
import Utils from "../shared/localStorage";
import moment from "moment";

const useAccountStore = create((set) => ({
    // State variables
    title: "Add Staff",
    staff: null,
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
    requestSent: false,
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
    setRole: async (data) => {
        set({ sending: true });
        try {
            const res = await backend.put(":id/accounts/roles", data);
            if (res.status === 200) {
                useAccountStore.getState().getUsers();
                set({
                    sending: false,
                    message: res.data.message,
                    action: "hasRole",
                    saved: true,
                });
            } else {
                set({
                    sending: false,
                    action: "hasRoleError",
                    message: res.data.error,
                    error: true,
                });
            }
        } catch (err) {
            set({ sending: false });
            console.log({ err });
        }
    },
    updateStaff: async (data) => {
        set({ sending: true });
        try {
            const res = await backend.put("accounts", data);
            if (res.status === 201) {
                useAccountStore.getState().getUsers();
                set({
                    sending: false,
                    message: res.data.message,
                    action: "newStaff",
                    saved: true,
                });
            } else {
                set({
                    sending: false,
                    action: "newStaffError",
                    message: res.data.error,
                    error: true,
                });
            }
        } catch (err) {
            set({ sending: false });
            console.log({ err });
        }
    },

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

    updateProfile: async (data) => {
        set({ sending: true });
        try {
            const res = await backend.put("accounts/profile", data);
            if (res.status === 200) {
                useAccountStore.getState().getProfile();
                set({
                    sending: false,
                    message: res.data.message,
                    action: "updateProfile",
                });
            } else {
                set({
                    sending: false,
                    message: res.data.error,
                    action: "profileUpdateError",
                    error: true,
                });
            }
        } catch (err) {
            set({
                profileLoading: false,
                error: true,
                message: err.response?.data.error || "Network Connection seems slow.",
                action: err.response?.status === 422 ? "profileUpdateError" : "",
            });
        }
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

// /* eslint-disable no-unreachable */
// import { makeObservable, observable, action, computed } from "mobx";
// import { createContext } from "react";
// import backend from "../config";
// import Utils from "../shared/localStorage";
// import moment from "moment";

// class AccountStore {
//   user = [];
//   error = false;
//   exist = false;
//   saved = false;
//   profileLoading = false;
//   loading = false;
//   removed = false;
//   sending = false;
//   checking = false;
//   message = "";
//   home = "";
//   errMessage = "";
//   myProfile = [];
//   profile = [];
//   users = [];
//   requestSent = false;
//   passwordChanged = false;
//   isAuthenticated = false;
//   action = null;
//   option = "All";
//   startDate = "";
//   endDate = "";

//   constructor() {
//     makeObservable(this, {
//       message: observable,
//       errMessage: observable,
//       action: observable,
//       option: observable,
//       startDate: observable,
//       endDate: observable,
//       user: observable,
//       myProfile: observable,
//       profile: observable,
//       sending: observable,
//       removed: observable,
//       isAuthenticated: observable,
//       requestSent: observable,
//       passwordChanged: observable,
//       profileLoading: observable,
//       checking: observable,
//       error: observable,
//       exist: observable,
//       saved: observable,
//       users: observable,
//       addStaff: action,
//       setRole: action,
//       getUsers: action,
//       removeStaff: action,
//       updateStaff: action,
//       getProfile: action,
//       updateProfile: action,
//       getProfileById: action,
//       resetProperty: action,
//       confirmEmail: action,
//       stats: computed,
//       filterProperty: action,
//     });
//   }

//   getUsers = () => {
//     this.loading = true;
//     try {
//       backend
//         .get("accounts")
//         .then((res) => {
//           this.loading = false;
//           if (res.status === 200) {
//             this.error = false;
//             this.users = res.data;
//           }
//         })
//         .catch((err) => {
//           console.log({ err });
//           this.loading = false;
//           this.error = true;
//           this.message = err.response
//             ? "failed to load users"
//             : "Network Connection seems slow.";
//         });
//     } catch (error) {
//       console.log({ error });
//       console.log(error.response);
//     }
//   };

//   confirmEmail = (email) => {
//     try {
//       this.checking = true;
//       this.exist = false;
//       backend.post(`accounts/confirm`, { email }).then((res) => {
//         this.checking = false;
//         if (res.status === 200) {
//           this.message = res.data.message;
//           this.exist = res.data.exist;
//         } else {
//           this.message = res.data.error;
//           this.error = true;
//         }
//       });
//     } catch (err) {
//       this.checking = false;
//       if (err.response.status === 500) {
//         console.log("There was a problem with the server");
//       } else {
//         console.log(err.response.data.msg);
//       }
//     }
//   };

//   login = (data) => {
//     this.sending = true;
//     this.error = false;
//     this.isAuthenticated = false;
//     this.message = "";
//     this.home = "";
//     try {
//       backend
//         .post("accounts/auth", data)
//         .then((res) => {
//           this.sending = false;
//           if (res.status === 200) {
//             Utils.save("name", res.data.lastname + " " + res.data.firstname);
//             Utils.save("admin_token", res.data.token);
//             Utils.save("acl", JSON.stringify(res.data.acl));
//             this.message = res.data.message;
//             this.home = res.data.home ?? 'dashboard';
//             this.isAuthenticated = true;
//           } else {
//             this.errMessage = res.data.error;
//             this.error = true;
//             this.isAuthenticated = false;
//           }
//         })
//         .catch((err) => {
//           this.sending = false;
//           if (err?.response?.status === 401) {
//             console.log({ err });
//             console.log("status", err.response.status);
//             this.errMessage = err.response.data.error;
//             this.error = true;
//             this.isAuthenticated = false;
//           }
//         });
//     } catch (error) {
//       this.sending = false;
//       console.log({ error });
//     }
//   };

//   addStaff = (data) => {
//     try {
//       this.sending = true;
//       backend
//         .post("accounts", data)
//         .then((res) => {
//           this.sending = false;
//           if (res.status === 201) {
//             this.getUsers();
//             this.message = res.data.message;
//             this.action = "newStaff";
//             this.saved = true;
//           } else {
//             this.action = "newStaffError";
//             this.message = res.data.error;
//             this.error = true;
//           }
//         })
//         .catch((err) => {
//           this.sending = false;
//           console.log({ err });
//           if (err && err.response) {
//             console.log("status", err.response.status);
//           }
//         });
//     } catch (error) {
//       this.sending = false;
//       console.log({ error });
//     }
//   };

//   setRole = (data) => {
//     try {
//       this.sending = true;
//       backend
//         .put(":id/accounts/roles", data)
//         .then((res) => {
//           this.sending = false;
//           if (res.status === 200) {
//             this.getUsers();
//             this.message = res.data.message;
//             this.action = "hasRole";
//             this.saved = true;
//           } else {
//             this.action = "hasRoleError";
//             this.message = res.data.error;
//             this.error = true;
//           }
//         })
//         .catch((err) => {
//           this.sending = false;
//           console.log({ err });
//           if (err && err.response) {
//             console.log("status", err.response.status);
//           }
//         });
//     } catch (error) {
//       this.sending = false;
//       console.log({ error });
//     }
//   };

//   updateStaff = (data) => {
//     try {
//       this.sending = true;
//       backend
//         .put("accounts", data)
//         .then((res) => {
//           this.sending = false;
//           if (res.status === 201) {
//             this.action = "newStaff";
//             this.getUsers();
//             this.message = res.data.message;
//             this.saved = true;
//           } else {
//             this.action = "newStaffError";
//             this.message = res.data.error;
//             this.error = true;
//           }
//         })
//         .catch((err) => {
//           this.sending = false;
//           console.log({ err });
//           if (err && err.response) {
//             console.log("status", err.response.status);
//           }
//         });
//     } catch (error) {
//       this.sending = false;
//       console.log({ error });
//     }
//   };

//   getProfile = () => {
//     this.profileLoading = true;
//     try {
//       backend
//         .get("accounts/profile")
//         .then((res) => {
//           if (res.status === 200) {
//             this.myProfile = res.data;
//             this.profileLoading = false;
//           }
//         })
//         .catch((err) => {
//           this.profileLoading = false;
//           this.error = true;
//           if (err?.response?.status === 401) {
//             this.errMessage = err.response.data.error;
//             this.action = "logout";
//           } else {
//             this.message = "Network Connection seems slow.";
//           }
//         });
//     } catch (error) {}
//   };

//   getProfileById = (id) => {
//     this.profileLoading = true;
//     try {
//       backend
//         .get(`accounts/staff/${id}`)
//         .then((res) => {
//           if (res.status === 200) {
//             this.profile = res.data;
//             this.profileLoading = false;
//           }
//         })
//         .catch((err) => {
//           this.profileLoading = false;
//           this.error = true;
//           if (err?.response?.status === 401) {
//             this.errMessage = err.response.data.error;
//             this.action = "logout";
//           } else {
//             this.message = "Network Connection seems slow.";
//           }
//         });
//     } catch (error) {}
//   };

//   updateProfile = (data) => {
//     this.sending = true;
//     backend
//       .put("accounts/profile", data)
//       .then((res) => {
//         this.sending = false;
//         if (res.status === 200) {
//           this.getProfile();
//           this.message = res.data.message;
//           this.action = "updateProfile";
//         } else {
//           this.message = res.data.error;
//           this.action = "profileUpdateError";
//           this.error = true;
//         }
//       })
//       .catch((err) => {
//         this.profileLoading = false;
//         this.error = true;
//         if (err?.response?.status === 422) {
//           this.message = err.response.data.error;
//           this.action = "profileUpdateError";
//         } else {
//           this.message = "Network Connection seems slow.";
//         }
//       });
//   };

//   filterProperty = (option, data) => {
//     this.option = option;
//     switch (option) {
//       case "All":
//         this.startDate = "";
//         this.endDate = "";
//         break;
//       case "Filter":
//         this.startDate = moment(data[0]).format("YYYY-MM-DD");
//         this.endDate = moment(data[1]).format("YYYY-MM-DD");
//         break;

//       default:
//         break;
//     }
//   };

//   get stats() {
//     switch (this.option) {
//       case "All":
//         return (this.users && this.users.length) || 0;
//         break;
//       case "Filter":
//         var result =
//           this.users &&
//           this.users.filter((d) => {
//             var date = moment(d.created_at).format("YYYY-MM-DD");
//             return date >= this.startDate && date <= this.endDate;
//           });
//         return result.length || 0;
//         break;

//       default:
//         break;
//     }
//     return 0;
//   }

//   removeStaff = (id) => {
//     try {
//       this.removed = false;
//       backend.delete(`accounts/${id}`).then((res) => {
//         if (res.status === 200) {
//           this.getUsers();
//           this.message = res.data.message;
//           this.removed = true;
//         } else {
//           this.message = res.data.error;
//           this.error = true;
//           this.removed = false;
//         }
//       });
//     } catch (error) {
//       this.removed = false;
//       console.log(error);
//     }
//   };
//   resetProperty = (key, value) => {
//     this[key] = value;
//   };

// }

// export default createContext(new AccountStore());
