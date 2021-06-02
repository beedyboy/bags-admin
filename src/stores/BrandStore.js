import { makeObservable, observable, action, computed } from "mobx";
import { createContext } from "react";
import backend from "../config";

class BrandStore {
  error = false;
  exist = false;
  loading = false;
  sending = false;
  removed = false;
  checking = false;
  brands = [];
  brand = [];
  productsByBrand = [];
  message = "";
  action = null;

  constructor() {
    makeObservable(this, {
      message: observable,
      sending: observable,
      checking: observable,
      error: observable,
      productsByBrand: observable,
      action: observable,
      removed: observable,
      exist: observable,
      loading: observable,
      brand: observable,
      brands: observable,
      getBrands: action,
      confirmName: action,
      createBrand: action,
      getProductsByBrands: action,
      updateBrand: action,
      removeBrand: action,
      resetProperty: action,
      brandProducts: computed,
      brandSelect: computed,
      stats: computed,
    });
  }
  getBrands = () => {
    this.loading = true;
    try {
      backend.get("/brands").then((res) => {
        this.loading = false;
        if (res.status === 200) {
          this.brands = res.data;
        }
      });
    } catch (err) {
      this.error = err;
    }
  };

  getProductsByBrands = (brand_id) => {
    this.loading = true;
    try {
      backend.get(`/products?brand=${brand_id}`).then((res) => {
        this.loading = false;
        if (res.data.status) {
          this.productsByBrand = res.data.data;
        }
      });
    } catch (err) {}
  };
  confirmName = (data) => {
    try {
      this.checking = true;
      backend.post("brands/confirm", { name: data }).then((res) => {
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
      if (err.response.status === 500) {
        console.log("There was a problem with the server");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };
  createBrand = (data) => {
    try {
      this.sending = true;
      backend.post("brands", data).then((res) => {
        this.sending = false;
        if (res.status === 201) {
          this.getBrands();
          this.message = res.data.message;
          this.action = "newBrand";
        } else {
          this.message = res.data.error;
          this.action = "newBrandError";
          this.error = true;
        }
      });
    } catch (err) {
      if (err.response.status === 500) {
        console.log("There was a problem with the server");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  updateBrand = (brand) => {
    try {
      this.sending = true;
      backend
        .put(`brands`, brand)
        .then((res) => {
          this.sending = false;
          if (res.status === 200) {
            this.getBrands();
            this.message = res.data.message;
            this.action = "newBrand";
          } else {
            this.message = res.data.error;
            this.error = true;
            this.action = "newBrandError";
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
  removeBrand = (id) => {
    this.removed = false;
    try {
      backend.delete(`brands/${id}`).then((res) => {
        if (res.status === 200) {
          this.getBrands();
          this.message = res.data.message;
          this.removed = true;
        } else {
          this.message = res.data.error;
          this.error = true;
          this.removed = false;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  resetProperty = (key, value) => {
    this[key] = value;
  };
  get stats() {
    return this.brands.length;
  }
  get brandProducts() {
    return Object.keys(this.productsByBrand || {}).map((key) => ({
      ...this.productsByBrand[key],
    }));
  }
  get brandSelect() {
    return Object.keys(this.brands || {}).map((key) => ({
      value: this.brands[key].id,
      label: this.brands[key].name,
    }));
  }
}

export default createContext(new BrandStore());
