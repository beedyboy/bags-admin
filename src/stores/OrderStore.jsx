import { createContext } from "react";
import { decorate, observable, action, computed } from "mobx";
import db from "../config";
import Utils from "../shared/localStorage";

class OrderStore {
  sendingOrder = false;
  error = false;
  loading = false;
  isRefreshed = false;
  loadingOrders = false;
  order_id = null;
  orderMessage = "";
  gotOrder = false;
  message = "";
  deletedMsg = "";
  action = "";
  cartItem = [];
  order = {};
  orders = [];

  resetAction = () => {
    this.action = "";
    this.orderMessage = "";
    this.gotOrder = false;
  };

  getCart = (orderNum) => {
    try {
      db.get(`/carts?order_number=${orderNum}`)
        .then((res) => {
          this.cartItem = res.data.data;
          console.log(this.cartItem);
        })
        .catch((err) => {});
    } catch (err) {
      // console.log(err);
      // this.error = err;
    }
  };

  getAllUserOrder = () => {
    this.loadingOrders = true;
    try {
      db.get("users/orders")
        .then((res) => {
          this.loadingOrders = false;
          if (res.data.status) {
            this.orders = res.data.data;
          }
        })
        .catch((err) => {
          this.error = err;
          this.message = err;
          if (err.response.status === 401) {
            Utils.save("isActive", false);
            this.refresh();
          }
        });
    } catch (err) {
      this.error = err;
    }
  };

  getAllOrders = (email) => {
    this.loadingOrders = true;
    try {
      db.get(`/orders?order_email=${email}`)
        .then((res) => {
          this.loadingOrders = false;
          if (res.data.status) {
            this.orders = res.data.data;
          }
        })
        .catch((err) => {
          this.error = err;
          this.message = err;
        });
    } catch (err) {
      this.error = err;
    }
  };

  makeOrder = (data) => {
    if (data && data.user_type === "customer") {
      delete data["order_email"];
    }
    this.sendingOrder = true;
    try {
      db.post(
        `${data && data.user_type === "guest" ? "orders" : "users/orders"}`,
        data
      )
        .then((res) => {
          this.sendingOrder = false;
          if (res.data.status) {
            this.order_id = res.data.data.orderId;
            this.orderMessage = res.data.message;
            this.action = "order_sent";
            //reset order_number n the localstorage
            //trigger getCart in the component that calls this
          }
        })
        .catch((error) => {
          const data = error.response.data;
          this.sendingOrder = false;
          if (error.response) {
            if (error.response.data.message === "This Record already exists") {
              this.action = "exists";
              this.orderMessage = "Already Placed this order!";
            }
            if (error.response.status === 401) {
              // Utils.save('isActive', false);
              this.refresh();
            }
            if (error.response.status === 400) {
              this.action = "order_error";
              this.orderMessage = data.message;
            }
          }
        });
    } catch (err) {
      this.error = err;
    }
  };

  getOrderById = (id) => {
    this.loadingOrders = true;
    try {
      db.get(`/orders/${id}`).then((res) => {
        this.loadingOrders = false;
        if (res.data.status) {
          this.gotOrder = true;
          this.order = res.data.data;
        }
      });
    } catch (err) {}
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

  resetProperty = (key, value) => {
    this[key] = value;
  };
  refresh = () => {
    console.log("refreshing_user_token");
    const token = { refresh_token: Utils.get("refresh_token") };
    this.refreshUserToken(token);
  };

  get orderItem() {
    return {
      order_details: this.order,
      product_details: this.cartItem,
    };
  }
}

decorate(OrderStore, {
  error: observable,
  action: observable,
  isRefreshed: observable,
  loading: observable,
  orderNumber: observable,
  order_id: observable,
  message: observable,
  gotOrder: observable,
  deletedMsg: observable,
  orderMessage: observable,
  paymentMsg: observable,
  sendingOrder: observable,
  order: observable,
  cartItem: observable,
  orders: observable,
  refreshUserToken: action,
  resetRefreshToken: action,
  refresh: action,
  getOrderById: action,
  getCart: action,
  getAllOrders: action,
  getAllUserOrder: action,
  resetAction: action,
  resetProperty: action,
  orderItem: computed,

  //   getorders: action,
});

export default createContext(new OrderStore());
