import React, { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import dataHero from "data-hero";
import useAuthStore from "../../stores/AccountStore";

const schema = {
  email: {
    isEmpty: false,
    min: 5,
    message: "A valid email is required",
  },
  password: {
    min: 6,
    isEmpty: false,
    message: "A minimum of 6 characters password is required",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const {
    isAuthenticated,
    resetProperty,
    login,
    message,
    error,
    errMessage,
    home,
    sending,
  } = useAuthStore();

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
      isValid: !errors.email.error && !errors.password.error,
      errors: errors || {},
    }));
  }, [values]);

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
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

  useEffect(() =>
  {
    if (isAuthenticated) {
      toast.current.show({
        summary: "Server Response",
        detail: message,
        severity: "success",
      });
      navigate(`/${home}`);
    }
    return () => {
      // resetProperty("isAuthenticated", false);
      // resetProperty("message", "");
    };
  }, [home, isAuthenticated, message, navigate, resetProperty]);

  useEffect(() => {
    if (error) {
      toast.current.show({
        summary: "Server Response",
        detail: errMessage,
        severity: "error",
      });
    }
  }, [error]);

  const hasError = (field) => touched[field] && errors[field].error;

  return (
    <Fragment>
      <Toast ref={toast} position="top-right" />
      <div className="p-grid" style={{ height: "100vh" }}>
        <div
          className="p-col-12 p-md-4 p-lg-4"
          style={{ backgroundColor: "teal", height: "100%" }}
        >
          <div
            className="p-d-flex p-flex-column p-jc-center p-ai-center"
            style={{ height: "100%" }}
          >
            <div className="p-mb-2">
              <img src="/assets/layout/images/logo.png" alt="logo" />
            </div>
            <div className="p-mb-2 p-mt-3">Bags, Footwears & More</div>
          </div>
        </div>

        <div className="p-col-12 p-md-8">
          <div
            className="p-d-flex p-flex-column p-jc-center p-ai-center"
            style={{ height: "100%", width: "100%" }}
          >
            <div className="p-mb-4">Login</div>
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
                  className={` ${hasError("email") ? "p-invalid" : ""} p-d-block`}
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
                  onChange={handlePasswordChange}
                  toggleMask
                  value={values.password || ""}
                  aria-describedby="password-help"
                  className={` ${
                    hasError("password") ? "p-invalid" : ""
                  } p-d-block`}
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
                    label="Login"
                    icon="pi pi-sign-in"
                    className="p-button-secondary p-mr-2 p-mb-2"
                    onClick={handleSignIn}
                    disabled={!isValid || sending}
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

export default Login;
