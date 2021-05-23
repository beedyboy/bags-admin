import { createContext } from "react";
import { decorate, observable, action } from "mobx";
import db from "../config";

class ContactusStore {
  loading = false;
  error = false;
  success = false;

  msgError = "";
  msgSuccess = "";

  sendEmail = (data) => {
    this.loading = true;

    db.post("/contact-us", data)
      .then((res) => {
        this.loading = false;
        this.error = false;

        if (res.data.status) {
          this.success = res.data.status;
          this.msgSuccess = res.data.message;
        }
      })
      .catch((err) => {
        this.loading = false;
        this.error = true;
        this.msgError = err.response.data.message;
      });
  };

  resetAction = () => {
    this.error = false;
    this.loading = false;
    this.success = false;

    this.msgError = "";
    this.msgSuccess = "";
  };
}

decorate(ContactusStore, {
  loading: observable,
  success: observable,
  error: observable,
  msgError: observable,
  msgSuccess: observable,
  resetAction: action,
  sendEmail: action,
});

export default createContext(new ContactusStore());
