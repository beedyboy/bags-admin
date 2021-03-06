/* eslint-disable no-unreachable */
import { makeObservable, observable, action, computed } from "mobx";
import { createContext } from "react";
import backend from "../config";
import moment from "moment";

class ReconStore {
  error = false;
  exist = false;
  loading = false;
  uploading = false;
  sending = false;
  reverting = false;
  reverted = false;
  removed = false;
  reconcillations = [];
  finalReport = [];
  pristine = [];
  finales = [];
  brand = [];
  message = "";
  action = null;
  option = "All";
  startDate = "";
  endDate = "";

  constructor() {
    makeObservable(this, {
      message: observable,
      uploading: observable,
      sending: observable,
      error: observable,
      option: observable,
      startDate: observable,
      endDate: observable,
      action: observable,
      removed: observable,
      finalReport: observable,
      stats: computed,
      pendingPristines: computed,
      pendingFinales: computed,
      overduePristines: computed,
      overdueFinales: computed,
      completed: computed,
      overdue: computed,
      loading: observable,
      reverting: observable,
      reverted: observable,
      finales: observable,
      pristine: observable,
      reconcillations: observable,
      getAllData: action,
      uploadStatement: action,
      getFinalReport: action,
      saveApproval: action,
      pristineRecord: action,
      finaleRecord: action,
      removeRecord: action,
      revertRecord: action,
      resetProperty: action,
      filterProperty: action,
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

  pristineRecord = () => {
    this.loading = true;
    try {
      backend.get(`reconcillations/approved_one/false`).then((res) => {
        this.loading = false;
        if (res.status === 200) {
          this.pristine = res.data;
        }
      });
    } catch (err) {
      this.error = err;
    }
  };

  finaleRecord = () => {
    this.loading = true;
    try {
      backend.get(`reconcillations/approved_two/false`).then((res) => {
        this.loading = false;
        if (res.status === 200) {
          this.finales = res.data;
        }
      });
    } catch (err) {
      this.error = err;
    }
  };

  getFinalReport = (data) => {
    this.loading = true;
    this.sending = true;
    try {
      backend.post("reconcillations/final/report", data).then((res) => {
        this.loading = false;
        this.sending = false;
        if (res.status === 200) {
          this.finalReport = res.data;
        }
      });
    } catch (err) {
      this.loading = false;
      this.sending = false;
      this.error = err;
    }
  };

  uploadStatement = (data) => {
    try {
      this.sending = true;
      this.uploading = true;
      backend
        .post("reconcillations", data)
        .then((res) => {
          this.sending = false;
          this.uploading = false;
          if (res.status === 201) {
            this.getAllData();
            this.pristineRecord();
            this.message = res.data.message;
            this.action = "accountUploaded";
          } else {
            this.message = res.data.error;
            this.action = "uploadError";
            this.error = true;
          }
        })
        .catch((err) => {
          this.sending = false;
          this.uploading = false;
          if (err.response && err.response.status === 404) {
            console.log("error in axios catch");
            this.message = err.response.data.message;
            this.error = true;
          } else {
            console.log({ err });
          }
        });
    } catch (err) {
      this.sending = false;
      this.uploading = false;
      if (err.response.status === 500) {
        this.message =
          "Error uploading. Please check your network and retry!!!";
        console.log("There was a problem with the server");
        this.error = true;
      } else {
        this.message = err.response.data.msg;
        this.error = true;
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
              this.pristineRecord();
            } else {
              this.finaleRecord();
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

  revertRecord = (data) => {
    this.reverting = true;
    try {
      backend.post("reconcillations/overturn", data).then((res) => {
        this.reverting = false;
        if (res.status === 200) {
          this.getAllData();
          // this.
          this.message = res.data.message;
          this.reverted = true;
        } else {
          this.message = res.data.error;
          this.error = true;
          this.reverted = false;
        }
      });
    } catch (error) {
      this.reverting = false;
      console.log(error);
    }
  };
  resetProperty = (key, value) => {
    this[key] = value;
  };
  filterProperty = (option, data) => {
    this.option = option;
    switch (option) {
      case "All":
        this.startDate = "";
        this.endDate = "";
        break;
      case "Filter":
        this.startDate = moment(data[0]).format("YYYY-MM-DD");
        this.endDate = moment(data[1]).format("YYYY-MM-DD");
        break;

      default:
        break;
    }
  };
  get stats() {
    return (this.reconcillations && this.reconcillations.length) || 0;
  }
  get pendingPristines() {
    switch (this.option) {
      case "All":
        return (
          (this.reconcillations &&
            this.reconcillations.filter((d) => d.approved_one === false)) ||
          []
        );
        break;
      case "Filter":
        var result =
          this.reconcillations &&
          this.reconcillations.filter((d) => {
            var date = moment(d.created_at).format("YYYY-MM-DD");
            return (
              d.approved_one === false &&
              date >= this.startDate &&
              date <= this.endDate
            );
          });
        return result || [];
      // break;startDate

      default:
        break;
    }
    return 0;
  }
  get pendingFinales() {
    switch (this.option) {
      case "All":
        return (
          (this.reconcillations &&
            this.reconcillations.filter(
              (d) => d.approved_one === true && d.approved_two === false
            )) ||
          []
        );
        break;
      case "Filter":
        var result =
          this.reconcillations &&
          this.reconcillations.filter((d) => {
            var date = moment(d.created_at).format("YYYY-MM-DD");
            return (
              d.approved_one === true &&
              d.approved_two === false &&
              date >= this.startDate &&
              date <= this.endDate
            );
          });
        return result || [];
        break;

      default:
        break;
    }
    return 0;
  }
  get completed() {
    switch (this.option) {
      case "All":
        return (
          (this.reconcillations &&
            this.reconcillations.filter(
              (d) => d.approved_one === true && d.approved_two === true
            )) ||
          []
        );
        break;
      case "Filter":
        var result =
          this.reconcillations &&
          this.reconcillations.filter((d) => {
            var date = moment(d.created_at).format("YYYY-MM-DD");
            return (
              d.approved_one === true &&
              d.approved_two === true &&
              date >= this.startDate &&
              date <= this.endDate
            );
          });
        return result || [];
        break;

      default:
        break;
    }
    return [];
  }
  get overdue() {
    return [this.overduePristines, this.overdueFinales];
  }

  get overduePristines() {
    var result =
      this.reconcillations &&
      this.reconcillations.filter((d) => {
        var date = moment(d.created_at).format("YYYY-MM-DD");
        var today = moment();
        const actual = today.diff(date, "days");
        return d.approved_one === false && actual >= 30;
      });
    return result.length || 0;
  }

  get overdueFinales() {
    var result =
      this.reconcillations &&
      this.reconcillations.filter((d) => {
        var date = moment(d.created_at).format("YYYY-MM-DD");
        var today = moment();
        const actual = today.diff(date, "days");
        return (
          d.approved_one === true && d.approved_two === false && actual >= 30
        );
      });
    return result.length || 0;
  }
  // get reconcillations() {
  //   return Object.keys(this.brandList || {}).map((key) => ({
  //     ...this.reconcillations[key],
  //   }));
  // }
}

export default createContext(new ReconStore());
