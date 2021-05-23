import { decorate, action, observable } from "mobx";
import { createContext } from "react";
import db from "../config";
class CategoryStore {
  constructor() {
    this.getCategories();
  }

  error = null;
  loading = false;
  category = [];
  categories = [];

  getCategories = () => {
    this.loading = true;
    try {
      db.get("/categories").then((res) => {
        this.loading = false;
        if (res.data.status) {
          this.categories = res.data.data;
        }
      });
    } catch (err) {
      this.error = err;
    }
  };

  getCategoriesByID = (id) => {
    this.loading = true;
    try {
      db.get(`/categories/${id}`).then((res) => {
        this.loading = false;
        if (res.data.status) {
          this.category = res.data.data;
        }
      });
    } catch (err) {
      this.error = err;
    }
  };
  getCategoriesMenu = (id) => {
    this.loading = true;
    try {
      db.get(`/categories?menu${id}`).then((res) => {
        this.loading = false;
        if (res.data.status) {
          this.category = res.data.data;
        }
      });
    } catch (err) {
      this.error = err;
    }
  };

  get menus() {
    return Object.keys(this.categories || {}).map((key) => ({
      ...this.categories[key],
    }));
  }
}

decorate(CategoryStore, {
  error: observable,
  loading: observable,
  categories: observable,
  category: observable,
  getCategories: action,
  getCategoriesByID: action,
});

export default createContext(new CategoryStore());
