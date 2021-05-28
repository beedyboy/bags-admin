import { makeObservable, observable, action, computed } from "mobx";
import { createContext } from "react";
import backend from "../config";

class ReconStore {
  error = false;
  exist = false;
  loading = false;
  sending = false;
  removed = false;
  reconcillations = [];
  pristine = [];
  finales = [];
  brand = [];
  message = "";
  action = null;

  constructor() {
    makeObservable(this, {
      message: observable,
      sending: observable,
      error: observable,
      action: observable,
      removed: observable,
      stats: computed,
      loading: observable,
      finales: observable,
      pristine: observable,
      reconcillations: observable,
      getAllData: action,
      uploadStatement: action,
      saveApproval: action,
      filterRecord: action,
      removeRecord: action,
      resetProperty: action,
    });
  }
  getAllData = () => {
    this.loading = true;
    try {
      backend.get("/reconcillations").then((res) => {
        this.loading = false;
        if (res.status === 200) {
          this.reconcillations = res.data;
        }
      });
    } catch (err) {
      this.error = err;
    }
  };

  filterRecord = (key, value, field) => {
    this.loading = true;
    try {
      backend.get(`reconcillations/${key}/${value}`).then((res) => {
        this.loading = false;
        if (res.status === 200) {
          this[field] = res.data;
        }
      });
    } catch (err) {
      this.error = err;
    }
  };

  uploadStatement = (data) => {
    try {
      this.sending = true;
      backend
        .post("reconcillations", data)
        .then((res) => {
          this.sending = false;
          if (res.status === 201) {
            this.getAllData();
            this.filterRecord("approved_one", false, "pristine");
            this.message = res.data.message;
            this.action = "accountUploaded";
          } else {
            this.message = res.data.error;
            this.action = "uploadError";
            this.error = true;
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            console.log("error in axios catch");
            this.message = err.response.data.message;
            this.error = true;
          } else {
            console.log({ err });
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

  saveApproval = (data, stage) => {
    try {
      const url = stage === "first" ? "first-approval" : "second-approval";
      this.sending = true;
      backend
        .post(`reconcillations/${url}`, data)
        .then((res) => {
          this.sending = false;
          if (res.status === 200) {
            if (stage === "first") {
              this.filterRecord("approved_one", false, "pristine");
            } else {
              this.filterRecord("approved_two", false, "finales");
            }
            this.message = res.data.message;
            this.action = "approved";
          } else {
            this.message = res.data.error;
            this.error = true;
            this.action = "approvedError";
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

  removeRecord = (id) => {
    this.removed = false;
    try {
      backend.delete(`reconcillations/${id}`).then((res) => {
        if (res.status === 200) {
          this.getAllData();
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
    return this.reconcillations.length;
  }
  // get reconcillations() {
  //   return Object.keys(this.brandList || {}).map((key) => ({
  //     ...this.reconcillations[key],
  //   }));
  // }
}

export default createContext(new ReconStore());
