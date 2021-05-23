import { decorate, observable, action, computed } from "mobx";
import { createContext } from "react";
import Utils from "../shared/localStorage";
import db from "../config";

class AccountStore {
  isAuthenticated = false;
  addressSuccess = false;
  isRefreshed = false;
  error = false;
  logging = false;
  loading = false;
  emailIsAvaliable = null;
  updateStatus = "";
  checkMessage = "";
  message = "";
  authMessage = "";
  saved = false;
  adding = false; 
  hasToken = Utils.get("customer_token") ? true : false;
  guest = [];
  user = [];
  profile = [];
  addresses = [];

  // passing in user email as single object
  confirmEmail = (data) => {
    this.loading = true;
    try {
      db.post("/check", data)
        .then((res) => {
          this.loading = false;
          if (res.data.status) {
            this.checkMessage = res.data.message;
            this.emailIsAvaliable = true;
            this.logging = true;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = true;
          this.emailIsAvaliable = false;
          this.checkMessage = error.response.data.message;
        });
    } catch (err) {
      this.loading = false;
      this.error = true;
      this.emailIsAvaliable = false;
    }
  };

  // login user with email & password credentials
  login = (data) => {
    this.loading = true;
    try {
      db.post("/login", data)
        .then((res) => {
          this.loading = false;
          if (res.data.status) {
            this.authMessage = res.data.message;
            Utils.save("customer_token", res.data.data.accessToken);
            Utils.save("refresh_token", res.data.data.refreshToken);
            Utils.save("isActive", true);
            this.isAuthenticated = true;
            this.hasToken = true;
          }
        })
        .catch((error) => {
          this.loading = false;

          this.authMessage = error.response.data.message;
          this.error = true;
          this.isAuthenticated = false;
        });
    } catch (err) {
      this.isAuthenticated = false;
      this.loading = false;
      this.error = true;
      // this.authMessage = res.data.message;
    }
  };

  register = (data) => {
    this.logging = true;
    this.error = false;
    try {
      db.post("/register", data)
        .then((res) => {
          this.logging = false;
          if (res.data.status) {
            this.message = res.data.message;
            this.isAuthenticated = true;
          }
        })
        .catch((error) => {
          this.error = true;
          this.logging = false;

          this.message = error.response.data.message;
        });
    } catch (err) {
      this.err = true;
      this.logging = false;
    }
  };

  persistUser = (data) => {
    Utils.save("persist_email", data.email);
    Utils.save("persist_password", data.password);
    Utils.save("persist_user", data.persist);
  };

  toggle = () => {
    this.error = false;
    this.message = "";
    this.isAuthenticated = false;
    this.authMessage = false;
    this.updateStatus = "";
    // this.checkMessage = '';
  };

  logOut = () => {
    Utils.remove("customer_token");
    Utils.remove("refresh_token");
    Utils.remove("persist_email");
    Utils.remove("persist_password");
    Utils.remove("persist_user");
    Utils.remove("isActive");
    this.hasToken = false;
  };

  updateProfile = (form) => {
    this.loading = true;
    try {
      db.put("users/profile", form)
        .then((res) => {
          this.loading = false;
          if (res.data.status) {
            this.updateStatus = "done";
            this.message = res.data.message;
            this.getProfile();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.message = err.response.data.message;
          this.updateStatus = "not_done";

          // if (err.response.status === 401) {
          //   Utils.save('isActive', false);
          this.refresh();
          // }
        });
    } catch (err) {}
  };

  getProfile = () => {
    this.loading = true;
    try {
      db.get("/users/profile")
        .then((res) => {
          this.loading = false;
          if (res.data.status) {
            this.user = res.data.data;
          } else {
            this.message = res.data.message;
          }
        })
        .catch((err) => {
          this.error = err;
          this.loading = false;
          this.message = err;
          console.log(err.response);
          // if (err.response.status === 401) {
          //   Utils.save('isActive', false);
          this.refresh();
          // }
        });
    } catch (err) {
      this.loading = false;
      this.error = err;
    }
  };

  getAddresses = () => {
    this.loading = true;
    try {
      db.get("users/addresses").then((res) => {
        this.loading = false;
        if (res.data.status) {
          this.addresses = res.data.data;
        }
      });
    } catch (err) {
      this.loading = false;
      // if (err.response.status === 401) {
      //   Utils.save('isActive', false);
      this.refresh();
      // }
    }
  };

  updateAddress = (id, data) => {
    this.adding = true;
    this.saved = false;
    try {
    db.put(`/users/addresses/${id}`, data)
    .then((res) => {
      this.saved = true;
      this.adding = false;
      if (res.data.status) {
        this.message = res.data.message;
        this.updateStatus = "address_saved";
        this.getAddresses(); 
      }
    })
    .catch((err) => {
      this.adding = false; 
      this.message = err.response.data.message;
      this.updateStatus = "not_done";

      if (err.response.status === 401) {
        Utils.save("isActive", false);
        this.refresh();
      }
    });
} catch (err) {
  this.updateStatus = "not_done";
  this.adding = false;
}
  };

  deleteAddress = (id) => {
    this.loading = true;
    db.delete(`users/addresses/${id}`)
      .then((res) => {
        this.loading = false;
        if (res.data.status) {
          this.message = res.data.message;
          this.addressSuccess = true;
          this.getAddresses();
        }
      })
      .catch((error) => {
        this.addressSuccess = false;
        this.loading = false;
        this.error = true;
      });
  };

  refreshUserToken = (token) => {
    this.loading = true;

    try {
      db.post("/refresh", token)
        .then((res) => {
          this.loading = false;
          this.isRefreshed = true;
          if (res.data.status) {
            Utils.save("customer_token", res.data.data.accessToken);
            Utils.save("refresh_token", res.data.data.refreshToken);
            Utils.save("isActive", true);
          }
        })
        .catch((err) => {
          this.isRefreshed = false;
          this.loading = false;
          Utils.save("isActive", false);
        });
    } catch (error) {
      this.loading = false;
    }
  };

  resetRefreshToken = () => {
    this.isRefreshed = false;
  };

  addAddress = (address) => {
    this.adding = true;
    this.saved = false;
    try {
      db.post("users/addresses", address)
        .then((res) => {
          this.adding = false;
          if (res.data.status) {
            this.message = res.data.message; 
          this.saved = true;
            this.getAddresses(); 
          }
        })
        .catch((err) => {
          this.adding = false;  
          this.error = true;
          this.message = err.response.data.message; 

          if (err.response.status === 401) {
            Utils.save("isActive", false);
            this.refresh();
          }
        });
    } catch (err) {
      this.error = true;
      this.adding = false;
    }
  };

  refresh = () => {
    console.log("refreshing_user_token");
    const token = { refresh_token: Utils.get("refresh_token") };

    this.refreshUserToken(token);
  };
  // get getWishlistProduct() {
  //   return Object.keys(this.user.WishList.Products || {}).map((key) => ({
  //     ...this.user.WishList.Products[key],
  //   }));
  // }

  resetProperty = (key, value) => {
    this[key] = value;
  };
  get info() {
    return Object.keys(this.addresses || {}).map((key) => ({
      ...this.addresses[key],
      uid: key,
    }));
  }
}

decorate(AccountStore, {
  logOut: action,
  resetRefreshToken: action,
  register: action,
  getProfile: action,
  refreshUserToken: action,
  refresh: action,
  getAddresses: action,
  info: computed,
  login: action,
  persistUser: action,
  addAddress: action,
  resetProperty: action,
  toggle: action,
  confirmEmail: action,
  guest: observable,
  saved: observable,
  adding: observable, 
  addressSuccess: observable,
  isRefreshed: observable,
  user: observable,
  updateStatus: observable,
  hasToken: observable,
  isAuthenticated: observable,
  loading: observable,
  updateAddress: action,
  deleteAddress: action,
  logging: observable,
  checkMessage: observable,
  error: observable,
  emailIsAvaliable: observable,
  message: observable,
  authMessage: observable,
  // getWishlistProduct: computed,
});

export default createContext(new AccountStore());
