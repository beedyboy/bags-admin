import { createContext } from "react";
import { decorate, observable, action } from "mobx";
import db from "../config";
import Utils from "../shared/localStorage";

class CartStore {
  sendingToCart = false;
  error = false;
  loading = false;
  saved = false;
  removingItem = false;
  emptying =  false;
  cartError = false;

  orderNumber = Utils.get("order_number") ?? "";
  message = "";
  successMsg = "";
  deletedMsg = "";
  cartMsg = "";
  action = "";
  cartItems = [];

  resetAction = () => {
    this.action = "";
  };

  removeCartItem = (id) => {
    this.removingItem = true;
    try {
      db.delete(`carts/${id}`)
        .then((res) => {
          this.action = "remove_item";
          this.removingItem = false;
          if (res.data.status) {
            // console.log(res.data.data)
            this.deletedMsg = res.data.message;
            this.getCart();
          } else {
            this.error = true;
            this.deletedMsg = res.data.message;
          }
        })
        .catch((err) => {
          // console.log(err);
        });
    } catch (error) {
      // console.log(error);
    }
  };

  emptyCart = () => {
    this.emptying = true;
    try {
      const orderNum = Utils.get("order_number");
      db.delete(`/carts?order_number=${orderNum}`) 
        .then((res) => {
          Utils.remove('order_number');
          this.orderNumber = "";
          this.emptying = false;
          if (res.data.status) {
            // console.log(res.data.data)
            this.deletedMsg = res.data.message;
          this.action = "emptied";
            this.getCart();
          } else {
            this.error = true; 
            this.deletedMsg = res.data.message;
          }
        })
        .catch((err) => {
          // console.log(err);
          this.emptying = false;
        });
    } catch (error) {
      this.emptying = false;
      // console.log(error);
    }
  };

  getCart = () => {
    this.loading = true;
    try {
      const orderNum = Utils.get("order_number") || 'undefined';
      db.get(`/carts?order_number=${orderNum}`)
        .then((res) => {
          this.loading = false;
          this.cartItems = res.data.data;
          if (!res.data.status) {
            this.cartMsg = res.data.message;
          }
        })
        .catch((err) => {
          this.error = err;
          this.message = err;
          // console.log(err);
        });
    } catch (err) {
      // console.log(err);
      this.error = err;
    }
  };

  addToCart = (data) => {
    this.sendingToCart = true;
    this.saved = false;
    try {
      db.post("carts", data)
        .then((res) => {
          this.sendingToCart = false;
          if (res.data.status) {
            this.orderNumber = res.data.data.orderNumber;
            this.successMsg = res.data.message;
            Utils.save("order_number", this.orderNumber);
            //   call getCart to reload cart items
            this.saved = true;
            this.getCart();
          }
        })
        .catch((err) => {
          this.cartMsg = err.response.data.message;
          this.cartError = true;
          this.sendingToCart = false;
          this.saved = false;
          // console.log(err.response)
        });
    } catch (err) {
      this.cartError = true;
      this.sendingToCart = false;
      // console.log(err);
      this.error = err;
    }
  };

  resetProperty = (key, value) => {
    this[key] = value;
  };
  resetStore = () => {
    this.sendingToCart = false;
    this.error = false;
    this.loading = false;
    this.removingItem = false;
    this.cartError = false;
    this.message = "";
    this.successMsg = "";
    this.deletedMsg = "";
    this.cartMsg = "";
  };

  get stat() {
    return this.cartItems.length;
  }
}
decorate(CartStore, {
  error: observable,
  action: observable,
  loading: observable,
  successMsg: observable,
  orderNumber: observable,
  message: observable,
  saved: observable,
  deletedMsg: observable,
  cartMsg: observable,
  cartError: observable,
  sendingToCart: observable,
  removingItem: observable,
  emptying: observable,
  cartItems: observable,
  emptyCart: action,
  removeCartItem: action,
  resetStore: action,
  getCart: action,
  resetAction: action,
  addToCart: action,
  resetProperty: action,
});

const CartContext = createContext(new CartStore());
export default CartContext;
// export default createContext(new CartStore());
