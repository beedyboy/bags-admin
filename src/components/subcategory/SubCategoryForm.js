/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import dataHero from "data-hero";
import categories from "../../shared/categories.json";
const schema = {
  name: {
    isEmpty: false,
    min: 1,
    message: "sub category name is required",
  },
  category: {
    isEmpty: false,
    min: 1,
    message: "category is required",
  },
};
const SubCategoryForm = ({
  mode,
  error,
  exist,
  action,
  confirm,
  sending,
  message,
  checking,
  addSubCat,
  updateSubCat,
  handleClose,
  initial_data,
}) => {
  const [formState, setFormState] = useState({
    values: {
      id: "",
      name: "",
      category: "",
      description: "",
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
            name: data && data.name,
            category: data && data.category,
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
          category: "",
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
    if (
      event.target.name === "name" &&
      values.category !== "" &&
      event.target.value.length >= 2
    ) {
      confirm(values.category, event.target.value);
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

  const onCategoryChange = (e) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        category: e.value,
      },
      touched: {
        ...formState.touched,
        category: true,
      },
    }));
  };
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
        category: "",
        description: "",
      },
      touched: {
        ...prev.touched,
        name: false,
        category: false,
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
            <div className="p-field">
              <label htmlFor="name">Category</label>
              <Dropdown
                value={values.category}
                options={categories.data}
                onChange={onCategoryChange}
                filter
                showClear
                filterBy="name"
                placeholder="Select a Category"
                // valueTemplate={selectedCountryTemplate}
                // itemTemplate={countryOptionTemplate}
              />

              <small id="name-help" className="p-error p-d-block">
                {hasError("name") ? errors.name && errors.name.message : null}
              </small>
            </div>
            <div className="p-field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                name="name"
                type="text"
                value={values.name || ""}
                onChange={handleChange}
                aria-describedby="name-help"
                className={` ${
                  hasError("name") ? "p-invalid" : null
                } " p-d-block"`}
              />
              <small id="name-help" className="p-error p-d-block">
                {hasError("name") ? errors.name && errors.name.message : null}
              </small>
              {exist ? (
                <Message severity="error" text={message} />
              ) : checking ? (
                <Message severity="info" text="checking server for duplicate" />
              ) : null}
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
          <div className="p-d-flex p-jc-end">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={handleClose}
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

export default SubCategoryForm;
