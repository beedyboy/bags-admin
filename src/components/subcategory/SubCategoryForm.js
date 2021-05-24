/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button"; 
import dataHero from "data-hero";

const schema = {
  name: {
    isEmpty: false,
    min: 1,
    message: "sub category name is required",
  },
};
const SubCategoryForm = ({
  mode, 
  error,
  exist,
  action,
  confirm,
  sending, 
  checking,
  addSubCat,
  updateSubCat,
  handleClose,
  initial_data,
}) => { 
  const [title, setTitle] = useState("Add Brand");
  const [formState, setFormState] = useState({
    values: {
      id: "",
      name: "",
      description: "",
    },
    touched: {},
    errors: {},
  });
  const { touched, errors, values, isValid } = formState;
  useEffect(() => {
    if (mode === "Edit") {
      setTitle("Edit Brand");
      let shouldSetData = typeof initial_data !== "undefined" ? true : false;
      if (shouldSetData) {
        const data = initial_data;
        setFormState((state) => ({
          ...state,
          values: {
            ...state.values,
            id: data && data.id,
            name: data && data.name,
            description: data && data.description,
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
          name: "",
          description: "",
        },
      }));
    };
  }, [initial_data, mode]);
  useEffect(() => {
    const errors = dataHero.validate(schema, values);
    setFormState((formState) => ({
      ...formState,
      isValid: errors.name.error || exist ? false : true,
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
    if (event.target.name === "name") {
      confirm(event.target.value);
    }
  };
  useEffect(() => {
    if (action === "newSubCategory") {
      resetForm();
      handleClose();
    }
    return () => {
      resetForm();
      handleClose();
    };
  }, [action]);

  useEffect(() => {
     
    return () => { 
      resetForm();
      handleClose();
    };
  }, [error]);

  const hasError = (field) => touched[field] && errors[field].error;

  const handleSubmit = (e) => {
    e.preventDefault();
    mode === "Add" ? addSubCat(values) : updateSubCat(values);
  };
  const resetForm = () => {
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        id: "",
        name: "",
        description: "",
      },
      touched: {
        ...prev.touched,
        name: false,
        description: false,
      },
      errors: {},
    }));
  };
  return (
    <Fragment>
      <div className="p-grid">
        <div className="p-col-12">
          <div className="card p-fluid">
            <h5>{title}</h5>
            <div className="p-field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                name="name"
                type="text"
                value={values.name || ""}
                onChange={handleChange}
                aria-describedby="name-help"
                className="p-invalid p-d-block"
              />
              <small id="name-help" className="p-error p-d-block">
                {hasError("name") ? errors.name && errors.name.message : null}
              </small>
            </div>
            <div className="p-field">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                value={values.description || ""}
                onChange={handleChange}
                name="description"
                rows="4"
              />
            </div>
          </div>
        </div>
        <div className="p-col">
          <Button
            label="Cancel"
            // icon="pi pi-arrow-right"
            onClick={handleClose}
            className="p-button-warning p-mr-2 p-mb-2"
          />

          <Button
            label="Save"
            className="p-button-secondary p-mr-2 p-mb-2"
            onClick={handleSubmit}
            disabled={!isValid || sending || exist}
            loading={sending}
            loadingOptions={{ position: "right" }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default SubCategoryForm;
