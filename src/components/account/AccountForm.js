/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import dataHero from "data-hero";
const schema = {
  firstname: {
    isEmpty: false,
    min: 1,
    message: "Firstname is required",
  },
  lastname: {
    isEmpty: false,
    min: 1,
    message: "Lastname is required",
  },
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
const AccountForm = ({
  mode,
  error,
  exist,
  action,
  confirm,
  sending,
  message,
  checking,
  addStaff,
  updateStaff,
  handleClose,
  initial_data,
}) => {
  const [formState, setFormState] = useState({
    values: {
      id: "",
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
    touched: {},
    errors: {},
  });
  const { touched, errors, values, isValid } = formState;

  useEffect(() => {
    if (mode === "Edit") {
      let shouldSetData = typeof initial_data !== "undefined" ? true : false;
      if (shouldSetData) {
        const data = initial_data;
        setFormState((state) => ({
          ...state,
          values: {
            ...state.values,
            id: data && data.id,
            firstname: data && data.firstname,
            lastname: data && data.lastname,
            username: data && data.username,
            email: data && data.email,
            phone: data && data.phone,
            address: data && data.address,
          },
        }));
      }
    }
    return () => {
      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          id: "",
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
          phone: "",
          address: "",
        },
      }));
    };
  }, [initial_data, mode]);
  useEffect(() => {
    const errors = dataHero.validate(schema, values);
    setFormState((formState) => ({
      ...formState,
      isValid:
        errors.firstname.error ||
        errors.lastname.error ||
        errors.password.error ||
        errors.email.error ||
        exist
          ? false
          : true,
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
    if (event.target.name === "email" && event.target.value.length > 5) {
      confirm(event.target.value);
    }
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
  useEffect(() => {
    if (action === "newStaff") {
      resetForm();
      handleClose(false);
    }
    return () => {
      resetForm();
      handleClose(false);
    };
  }, [action]);

  useEffect(() => {
    return () => {
      resetForm();
      handleClose(false);
    };
  }, [error]);

  const hasError = (field) => touched[field] && errors[field].error;

  const handleSubmit = (e) => {
    e.preventDefault();
    mode === "Add" ? addStaff(values) : updateStaff(values);
  };
  const resetForm = () => {
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        id: "",
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      },
      touched: {
        ...prev.touched,
        firstname: false,
        lastname: false,
        password: false,
        username: false,
        email: false,
        phone: false,
        address: false,
      },
      errors: {},
    }));
  };
  return (
    <Fragment>
      <div className="p-grid">
        <div className="p-col-12">
          <div className="card p-fluid">
            <div className="p-field">
              <label htmlFor="firstname">Firstname</label>
              <InputText
                id="firstname"
                name="firstname"
                type="text"
                value={values.firstname || ""}
                onChange={handleChange}
                aria-describedby="firstname-help"
                className={` ${
                  hasError("firstname") ? "p-invalid" : null
                } " p-d-block"`}
              />
              <small id="firstname-help" className="p-error p-d-block">
                {hasError("firstname")
                  ? errors.firstname && errors.firstname.message
                  : null}
              </small>
            </div>

            <div className="p-field">
              <label htmlFor="lastname">Lastname</label>
              <InputText
                id="lastname"
                name="lastname"
                type="text"
                value={values.lastname || ""}
                onChange={handleChange}
                aria-describedby="lastname-help"
                className={` ${
                  hasError("lastname") ? "p-invalid" : null
                } " p-d-block"`}
              />
              <small id="lastname-help" className="p-error p-d-block">
                {hasError("lastname")
                  ? errors.lastname && errors.lastname.message
                  : null}
              </small>
            </div>

            <div className="p-field">
              <label htmlFor="phone">Phone</label>
              <InputText
                id="phone"
                name="phone"
                type="text"
                value={values.phone || ""}
                onChange={handleChange}
                className="p-d-block"
              />
            </div>

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
              {exist ? (
                <Message severity="error" text={message} />
              ) : checking ? (
                <Message severity="info" text="checking server for duplicate" />
              ) : null}
            </div>

            {mode === "Add" ? (
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
            ) : null}

            <div className="p-field">
              <label htmlFor="address">Address</label>
              <InputTextarea
                id="address"
                value={values.address || ""}
                onChange={handleChange}
                name="address"
                rows="4"
              />
            </div>
          </div>
        </div>
        <div className="p-col">
          <div className="p-d-flex p-jc-end">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={(e) => handleClose(false)}
              className="p-button-warning p-mr-2 p-mb-2"
            />

            <Button
              label="Save"
              icon="pi pi-check"
              className="p-button-secondary p-mr-2 p-mb-2"
              onClick={handleSubmit}
              disabled={!isValid || sending || exist}
              loading={sending}
              loadingOptions={{ position: "right" }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AccountForm;
