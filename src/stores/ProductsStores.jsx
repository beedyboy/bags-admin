import { action, observable, decorate, computed } from "mobx";
import { createContext } from "react";
import db from "../config";
import Utils from "../shared/localStorage";

class ProductStore {
  error = false;
  loading = false;
  adding = false;
  removingItem = false;
  isRefreshed = false;
  message = "";
  action = null;
  errMessage = "";
  stock = {};

  product = [];
  allProduct = [];
  productsBySlug = [];
  productsByBrand = [];
  mostBoughtProduct = [];
  productsByCategory = [];
  productsBySubCategory = [];
  similarProducts = [];

  getStock = (id) => {
    db.get(`/stocks/${id}`).then((res) => {
      if (res.data.status) {
        this.stock = res.data.data;
        console.log(res.data.data);
      }
    });
  };

  getProducts = () => {
    this.loading = true;
    db.get(`/products`).then((res) => {
      this.loading = false;
      if (res.data.status) {
        this.allProduct = res.data.data;
      }
    });
  };

  getProductsBySlug = (slug) => {
    this.loading = true;
    db.get(`/products?slug=${slug}`).then((res) => {
      this.loading = false;
      if (res.data.status) {
        this.product = res.data.data[0];
      }
    });
  };

  getProductsByBrands = (brand_id) => {
    this.loading = true;
    try {
      db.get(`/products?brand=${brand_id}`).then((res) => {
        this.loading = false;
        if (res.data.status) {
          this.productsByBrand = res.data.data;
        }
      });
    } catch (err) {}
  };

  getProductsByCategory = (category_menu) => {
    this.loading = true;
    db.get(`/products?category_menu=${category_menu}`).then((res) => {
      this.loading = false;
      try {
        if (res.data.status) {
          this.productsByCategory = res.data.data;
        }
      } catch (err) {}
    });
  };

  getProductsBySubCategory = (category_id) => {
    this.loading = true;
    db.get(`/products?category=${category_id}`).then((res) => {
      try {
        this.loading = false;
        if (res.data.status) {
          this.productsBySubCategory = res.data.data;
        }
      } catch (err) {}
    });
  };
  getMostBoughtProduct = () => {
    this.loading = true;
    db.get("/products/best-sold").then((res) => {
      try {
        this.loading = false;
        if (res.data.status) {
          this.mostBoughtProduct = res.data.data;
        }
      } catch (err) {}
    });
  };

  getSimilarProductItem = () => {
    this.similarProducts = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  };

  addToWishlist = (item) => {
    this.adding = true;
    this.action = null;
    try {
      db.get(`/users/products/${item}/add`)
        .then((res) => {
          this.adding = false;
          if (res.data.status) {
            this.error = false;
            this.message = res.data.message;
            this.action = "added_wishlist";
          }
        })
        .catch((error) => {
          this.errMessage = error.response.data;
          this.error = true;
          this.adding = false;
          this.action = "wishlist_error";

          if (error.response.status === 401) {
            Utils.save("isActive", false);
            this.refresh();
          }
        });
    } catch (err) {}
  };
  removeToWishlist = (id) => {
    this.removingItem = true;
    try {
      db.get(`/users/products/${id}/remove`)
        .then((res) => {
          this.removingItem = false;
          if (res.data.status) {
            this.message = res.data.message;
          }
        })
        .catch((err) => {
          this.error = true;
          this.removingItem = false;
          this.errMessage = err.response.data.message;

          if (err.response.status === 401) {
            Utils.save("isActive", false);
            this.refresh();
          }
        });
    } catch (error) {
      this.error = true;
      this.removingItem = false;
    }
  };
  resetParams = () => {
    this.error = false;
    this.loading = false;
    this.message = "";
    this.errMessage = "";
  };

  resetProperty = (key, value) => {
    this[key] = value;
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

  refresh = () => {
    // console.log("refreshing_user_token");
    const token = { refresh_token: Utils.get("refresh_token") };
    this.refreshUserToken(token);
  };

  get productMenu() {
    return Object.keys(this.product || {}).map((key) => ({
      ...this.product[key],
    }));
  }
  get productCategoryMenu() {
    return Object.keys(this.productsByCategory || {}).map((key) => ({
      ...this.productsByCategory[key],
    }));
  }
  get productBrandMenu() {
    return Object.keys(this.productsByBrand || {}).map((key) => ({
      ...this.productsByBrand[key],
    }));
  }
  get productSlugMenu() {
    return Object.keys(this.productsBySlug || {}).map((key) => ({
      ...this.productsBySlug[key],
    }));
  }
  get mostBought() {
    return Object.keys(this.mostBoughtProduct || {}).map((key) => ({
      ...this.mostBoughtProduct[key],
    }));
  }
}

decorate(ProductStore, {
  action: observable,
  error: observable,
  loading: observable,
  isRefreshed: observable,
  similarProducts: observable,
  message: observable,
  allProduct: observable,
  removingItem: observable,
  product: observable,
  productsBySlug: observable,
  errMessage: observable,
  stock: observable,
  productsByBrands: observable,
  mostBoughtProduct: observable,
  productsByCategory: observable,
  adding: observable,
  getProducts: action,
  getProductsByBrands: action,
  getSimilarProductItem: action,
  resetParams: action,
  getProductsByCategory: action,
  getStock: action,
  productsBySubCategory: observable,
  getProductsBySlug: action,
  getMostBoughtProduct: action,
  refreshUserToken: action,
  resetRefreshToken: action,
  refresh: action,
  addToWishlist: action,
  resetProperty: action,
  productSlugMenu: computed,
  mostBought: computed,
  getProductsBySubCategory: action,
});

export default createContext(new ProductStore());
