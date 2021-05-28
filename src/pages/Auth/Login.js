/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import dataHero from "data-hero";
import AccountStore from "../../stores/AccountStore";
import { observer } from "mobx-react-lite";
const schema = {
  email: {
    isEmpty: false,
    min: 5,
    message: "A valid email is required",
  },
  password: {
    min: 6,
    isEmpty: false,
    message: "a minimum of 6 characters password is required",
  },
};

const Login = () => {
  const toast = useRef(null);
  const authStore = useContext(AccountStore);
  const {
    isAuthenticated,
    resetProperty,
    login,
    message,
    error,
    errMessage,
    sending,
  } = authStore;
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      email: "",
      password: "",
    },
    touched: {},
    errors: {},
  });
  const { values, isValid, errors, touched } = formState;

  useEffect(() => {
    const errors = dataHero.validate(schema, values);
    setFormState((formState) => ({
      ...formState,
      isValid: errors.email.error || errors.password.error ? false : true,
      errors: errors || {},
    }));
  }, [values]);

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handlePasswordChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        password: event.target.value,
      },
      touched: {
        ...formState.touched,
        password: true,
      },
    }));
  };
  const handleSignIn = (event) => {
    event.preventDefault();
    login(formState.values);
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      toast({
        title: "Server Response.",
        description: message,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      //   router.push("/");
    }
    return () => {
      // resetProperty("isAuthenticated", false);
      resetProperty("message", "");
    };
  }, [isAuthenticated]);
  useEffect(() => {
    if (error === true) {
      toast({
        title: "Server Response.",
        description: errMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [error]);
  const hasError = (field) => touched[field] && errors[field].error;

  return (
    <Fragment>
      <Toast ref={toast} position="top-right" />
      <div className="p-d-flex">
        <div
          className="p-col-md-4 p-col-12"
          style={{ backgroundColor: "green" }}
        ></div>
        <div className="p-col-md-8 p-col-12">
          <div className="p-grid">
            <div className="card p-fluid">
              <div className="p-field">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  value={values.email || ""}
                  onChange={handleChange}
                  aria-describedby="email-help"
                  className={` ${
                    hasError("email") ? "p-invalid" : null
                  } " p-d-block"`}
                />
                <small id="email-help" className="p-error p-d-block">
                  {hasError("email")
                    ? errors.email && errors.email.message
                    : null}
                </small>
              </div>

              <div className="p-field">
                <label htmlFor="password">Password</label>
                <Password
                  onChange={(e) => handlePasswordChange(e)}
                  toggleMask
                  value={values.password || ""}
                  aria-describedby="password-help"
                  className={` ${
                    hasError("password") ? "p-invalid" : null
                  } " p-d-block"`}
                />
                <small id="password-help" className="p-error p-d-block">
                  {hasError("password")
                    ? errors.password && errors.password.message
                    : null}
                </small>
              </div>
              <div className="p-col">
                <div className="p-d-flex p-jc-end">
                  

                  <Button
                    label="Save"
                    icon="pi pi-check"
                    className="p-button-secondary p-mr-2 p-mb-2"
                    onClick={handleSignIn}
                    disabled={!isValid || sending }
                    loading={sending}
                    loadingOptions={{ position: "right" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default observer(Login);
