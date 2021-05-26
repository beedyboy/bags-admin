import { makeObservable, observable, action, computed } from "mobx";
import { createContext } from "react";
import backend from "../config";
import Utils from "../shared/localStorage";

class AccountStore {
  user = [];
  error = false;
  exist = false;
  saved = false;
  profileLoading = false;
  loading = false;
  removed = false;
  sending = false;
  checking = false;
  message = "";
  errMessage = "";
  myProfile = [];
  profile = [];
  users = [];
  requestSent = false;
  passwordChanged = false;
  isAuthenticated = false;
  action = null;

  constructor() {
    makeObservable(this, {
      message: observable,
      errMessage: observable,
      action: observable,
      user: observable,
      myProfile: observable,
      profile: observable,
      sending: observable,
      removed: observable,
      isAuthenticated: observable,
      requestSent: observable,
      passwordChanged: observable,
      profileLoading: observable,
      checking: observable,
      error: observable,
      exist: observable,
      saved: observable,
      users: observable,
      addStaff: action,
      setRole: action,
      getUsers: action,
      removeStaff: action,
      updateStaff: action,
      getProfile: action,
      updateProfile: action,
      getProfileById: action,
      resetProperty: action,
      confirmEmail: action,
      stats: computed,
    });
  }

  getUsers = () => {
    this.loading = true;
    try {
      backend
        .get("accounts")
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            this.error = false;
            this.users = res.data;
          }
        })
        .catch((err) => {
          console.log({ err });
          this.loading = false;
          this.error = true;
          this.message = err.response
            ? "failed to load users"
            : "Network Connection seems slow.";
        });
    } catch (error) {
      console.log({ error });
      console.log(error.response);
    }
  };

  confirmEmail = (email) => {
    try {
      this.checking = true;
      this.exist = false;
      backend.post(`accounts/confirm`, {email}).then((res) => {
        this.checking = false;
        if (res.status === 200) {
          this.message = res.data.message;
          this.exist = res.data.exist;
        } else {
          this.message = res.data.error;
          this.error = true;
        }
      });
    } catch (err) {
      this.checking = false;
      if (err.response.status === 500) {
        console.log("There was a problem with the server");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  login = (data) => {
    this.sending = true;
    this.error = false;
    this.isAuthenticated = false;
    try {
      backend
        .post("accounts/auth", data)
        .then((res) => {
          this.sending = false;
          if (res.status === 201) {
            // console.log(res.data.acl)
            Utils.save("name", res.data.lastname + " " + res.data.firstname);
            Utils.save("admin_token", res.data.token);
            Utils.save("acl", JSON.stringify(res.data.acl));
            this.message = res.data.message;
            this.isAuthenticated = true;
          } else {
            this.errMessage = res.data.error;
            this.error = true;
            this.isAuthenticated = false;
          }
        })
        .catch((err) => {
          this.sending = false;
          if (err && err.response && err.response.status === 401) {
            console.log({ err });
            console.log("status", err.response.status);
            this.errMessage = err.response.data.error;
            this.error = true;
            this.isAuthenticated = false;
          }
        });
    } catch (error) {
      this.sending = false;
      console.log({ error });
    }
  };
  addStaff = (data) => {
    try {
      this.sending = true;
      backend
        .post("accounts", data)
        .then((res) => {
          this.sending = false;
          if (res.status === 201) {
            this.getUsers();
            this.message = res.data.message;
            this.action = "newStaff";
            this.saved = true;
          } else {
            this.action = "newStaffError";
            this.message = res.data.error;
            this.error = true;
          }
        })
        .catch((err) => {
          this.sending = false;
          console.log({ err });
          if (err && err.response) {
            console.log("status", err.response.status);
          }
        });
    } catch (error) {
      this.sending = false;
      console.log({ error });
    }
  };

  setRole = (data) => {
    try {
      this.sending = true;
      backend
        .put("accounts/auth", data)
        .then((res) => {
          this.sending = false;
          if (res.status === 200) {
            this.getUsers();
            this.message = res.data.message;
            this.action = "hasRole";
            this.saved = true;
          } else {
            this.action = "hasRoleError";
            this.message = res.data.error;
            this.error = true;
          }
        })
        .catch((err) => {
          this.sending = false;
          console.log({ err });
          if (err && err.response) {
            console.log("status", err.response.status);
          }
        });
    } catch (error) {
      this.sending = false;
      console.log({ error });
    }
  };

  updateStaff = (data) => {
    try {
      this.sending = true;
      backend
        .put("accounts", data)
        .then((res) => {
          this.sending = false;
          if (res.status === 200) {
            this.action = "newStaff";
            this.getUsers();
            this.message = res.data.message;
            this.saved = true;
          } else {
            this.action = "newStaffError";
            this.message = res.data.error;
            this.error = true;
          }
        })
        .catch((err) => {
          this.sending = false;
          console.log({ err });
          if (err && err.response) {
            console.log("status", err.response.status);
          }
        });
    } catch (error) {
      this.sending = false;
      console.log({ error });
    }
  };

  getProfile = () => {
    this.profileLoading = true;
    try {
      backend
        .get("accounts/profile")
        .then((res) => {
          if (res.status === 200) {
            this.myProfile = res.data;
            this.profileLoading = false;
          }
        })
        .catch((err) => {
          this.profileLoading = false;
          this.error = true;
          if (err && err.response && err.response.status === 401) {
            this.errMessage = err.response.data.error;
            this.action = "logout";
          } else {
            this.message = "Network Connection seems slow.";
          }
        });
    } catch (error) {}
  };

  getProfileById = (id) => {
    this.profileLoading = true;
    try {
      backend
        .get(`accounts/staff/${id}`)
        .then((res) => {
          if (res.status === 200) {
            this.profile = res.data;
            this.profileLoading = false;
          }
        })
        .catch((err) => {
          this.profileLoading = false;
          this.error = true;
          if (err && err.response && err.response.status === 401) {
            this.errMessage = err.response.data.error;
            this.action = "logout";
          } else {
            this.message = "Network Connection seems slow.";
          }
        });
    } catch (error) {}
  };

  updateProfile = (data) => {
    this.sending = true;
    backend
      .put("accounts/profile", data)
      .then((res) => {
        this.sending = false;
        if (res.status === 200) {
          this.getProfile();
          this.message = res.data.message;
          this.action = "updateProfile";
        } else {
          this.message = res.data.error;
          this.action = "profileUpdateError";
          this.error = true;
        }
      })
      .catch((err) => {
        this.profileLoading = false;
        this.error = true;
        if (err && err.response && err.response.status === 422) {
          this.message = err.response.data.error;
          this.action = "profileUpdateError";
        } else {
          this.message = "Network Connection seems slow.";
        }
      });
  };
  get stats() {
    return this.users.length;
  }

  removeStaff = (id) => {
    try {
      this.removed = false;
      backend.delete(`accounts/${id}`).then((res) => {
        if (res.status === 200) {
          this.getUsers();
          this.message = res.data.message;
          this.removed = true;
        } else {
          this.message = res.data.error;
          this.error = true;
          this.removed = false;
        }
      });
    } catch (error) {
      this.removed = false;
      console.log(error);
    }
  };
  resetProperty = (key, value) => {
    this[key] = value;
  };
}

export default createContext(new AccountStore());
