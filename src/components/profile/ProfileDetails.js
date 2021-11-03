/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from "react";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
// import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
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

function ProfileDetails(props) {
  const { initial_data, saveData, sending } = props;
  const [formState, setFormState] = useState({
    values: {
      id: "",
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      position: "",
      phone: "",
      address: "",
    },
    touched: {},
    errors: {},
  });
  const { touched, errors, values, isValid } = formState;

  useEffect(() => {
    let shouldSetData = typeof initial_data !== "undefined" ? true : false;
    if (shouldSetData) {
      const data = initial_data;
      setFormState((state) => ({
        ...state,
        values: {
          ...state.values,
          id: data?.id,
          firstname: data?.firstname,
          lastname: data?.lastname,
          email:  data?.email,
          position:  data?.position,
          username: data?.username,
          phone: data?.phone,
          address: data?.address,
        },
      }));
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
  }, [initial_data]);
  useEffect(() => {
    const errors = dataHero.validate(schema, values);
    setFormState((formState) => ({
      ...formState,
      isValid: errors.firstname.error || errors.lastname.error ? false : true,
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

  const handleSubmit = (e) => {
    e.preventDefault();
     saveData(values);
  };
  const hasError = (field) => touched[field] && errors[field].error;

  return (
    <Fragment>
      <div className="p-d-flex p-flex-column w-100 p-jc-start">
        <Divider align="center" type="dashed">
          <span className="p-tag">User Information</span>
        </Divider>
      </div>
      <div className="p-d-flex p-flex-lg-row p-flex-sm-column   p-jc-around">
        <div className="p-d-flex p-flex-column w-100 p-jc-between">
          <div className="p-grid p-p-4">
            <label className="p-col-lg-4 p-text-bold" htmlFor="firstname">
              Firstname:
            </label>
            <div className="p-col-lg-8">
              <Inplace closable>
                <InplaceDisplay>
                  {values?.firstname || "Click to edit"}
                </InplaceDisplay>
                <InplaceContent>
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
                </InplaceContent>
              </Inplace>
            </div>
          </div>
          <div className="p-grid p-p-4">
            <label className="p-col-lg-4 p-text-bold" htmlFor="lastname">
              Lastname:
            </label>
            <div className="p-col-lg-8">
              <Inplace closable>
                <InplaceDisplay>
                  {values?.lastname || "Click to edit"}
                </InplaceDisplay>
                <InplaceContent>
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
                </InplaceContent>
              </Inplace>
            </div>
          </div>

          <div className="p-grid p-p-4">
            <label className="p-col-lg-4 p-text-bold" htmlFor="phone">
              Phone:
            </label>
            <div className="p-col-lg-8">
              <Inplace closable>
                <InplaceDisplay>
                  {values?.phone || "Click to edit"}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    id="phone"
                    name="phone"
                    type="text"
                    value={values.phone || ""}
                    onChange={handleChange} 
                    className="p-d-block" 
                  /> 
                </InplaceContent>
              </Inplace>
            </div>
          </div>

          <div className="p-grid p-p-4">
            <label className="p-col-lg-4 p-text-bold" htmlFor="email">
              Email:
            </label>
            <div className="p-col-lg-8">
              <Inplace closable>
                <InplaceDisplay>
                  {values?.email || "Cannot be edited"}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText 
                    type="email"
                    readOnly="true"
                    value={values.email || ""} 
                    className="p-d-block" 
                  /> 
                </InplaceContent>
              </Inplace>
            </div>
          </div>
        </div>

        <div className="p-d-flex p-flex-column w-100 p-jc-between">

        <div className="p-grid p-p-2">
            <label className="p-col-lg-4 p-text-bold" htmlFor="position">
              Position:
            </label>
            <div className="p-col-lg-8">
              <Inplace closable>
                <InplaceDisplay>
                  {values?.position || "Click to edit"}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    id="position"
                    name="position"
                    type="text"
                    value={values.position || ""}
                    onChange={handleChange} 
                    className="p-d-block" 
                  /> 
                </InplaceContent>
              </Inplace>
            </div>
          </div>
          <div className="p-grid">
            <label className="p-col-lg-4 p-text-bold" htmlFor="address">
              Address:
            </label>
            <div className="p-col-lg-8">
              <Inplace closable>
                <InplaceDisplay>
                  {values?.address || "Click to edit"}
                </InplaceDisplay>
                <InplaceContent>
                  <InputTextarea
                    rows={5}
                    cols={30}
                    name="address"
                    value={values.address || ""}
                    onChange={handleChange}
                    autoResize
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </div>
          <Button
              label="Save"
              icon="pi pi-save"
              className="p-button-secondary p-mr-2 p-mb-2"
              onClick={handleSubmit}
              disabled={!isValid || sending }
              loading={sending}
              loadingOptions={{ position: "right" }}
            />
        </div>
      </div>
     
    </Fragment>
  );
}

export default ProfileDetails;
