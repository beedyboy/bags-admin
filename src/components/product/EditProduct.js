/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
const EditProduct = ({
  categories,
  sending,
  onSelectChange,
  getSub,
  toggle,
  reset,
  hasError,
  updateProduct,
  subcategorySelect,
  handleContentChange,
  brandSelect,
  formState,
  setFormState,
  handleSpecialChange,
  initial_data,
}) => {
  const { errors, values, isValid } = formState;
  useEffect(() => {
    let shouldSetData = typeof initial_data !== "undefined" ? true : false;
    if (shouldSetData) {
      const data = initial_data;
      setFormState((state) => ({
        ...state,
        values: {
          ...state.values,
          id: data && data.id,
          sub_id: data && data.sub_id,
          brand_id: data && data.brand_id,
          category: data && data.category,
          best: data && data.best,
          featured: data && data.featured,
          arrival: data && data.arrival,
          branded: data && data.branded,
          description: data && data.description,
        },
      }));
      getSub(data && data.category);
    }
    return () => {
      reset();
    };
  }, [initial_data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(values);
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
                onChange={(event) => onSelectChange(event, "category")}
                filter
                showClear
                filterBy="name"
                placeholder="Select a Category"
              />

              <small id="name-help" className="p-error p-d-block">
                {hasError("name") ? errors.name && errors.name.message : null}
              </small>
            </div>
            {values.category === "" ? null : (
              <>
                <div className="p-field">
                  <label htmlFor="name">Sub Category</label>
                  <Dropdown
                    value={values.sub_id}
                    options={subcategorySelect}
                    onChange={(event) => onSelectChange(event, "sub_id")}
                    filter
                    showClear
                    filterBy="sub_id"
                    placeholder="Select One"
                  />
                </div>
              </>
            )}
            <div className="p-field">
              <label htmlFor="name">Description</label>
              <SunEditor
                onChange={handleContentChange}
                name="description"
                setContents={values.description}
                showToolbar={true}
                setOptions={{
                  buttonList: [
                    // default
                    ["undo", "redo"],
                    [
                      "font",
                      "fontSize",
                      "formatBlock",
                      "paragraphStyle",
                      "fontColor",
                      "blockquote",
                      "bold",
                      "underline",
                      "italic",
                      "list",
                    ],
                    ["table", "link", "image", "video"],
                    ["fullScreen"],
                    ["image", "video", "audio"],
                    [
                      "strike",
                      "subscript",
                      "superscript",
                      "hiliteColor",
                      "textStyle",
                      "removeFormat",
                      "outdent",
                      "indent",
                      "align",
                      "horizontalRule",
                      "lineHeight",
                      "table",
                      "link",
                      "fullScreen",
                      "showBlocks",
                      "codeView",
                    ],
                    ["preview", "print", "save", "template"],
                  ],
                }}
              />
            </div>
            <div className="p-field">
              <label htmlFor="name"> Brand</label>
              <Dropdown
                value={values.brand_id}
                options={brandSelect}
                onChange={(event) => onSelectChange(event, "brand_id")}
                filter
                showClear
                filterBy="sub_id"
                placeholder="Select One"
              />
            </div>

            <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
              <div className="p-field-checkbox">
                <Checkbox
                  inputId="branded"
                  name="branded"
                  checked={values.branded || false}
                  onChange={(event) => handleSpecialChange(event, "branded")}
                />
                <label htmlFor="branded">Branded</label>
              </div>
              <div className="p-field-checkbox">
                <Checkbox
                  inputId="best"
                  name="best"
                  checked={values.best || false}
                  onChange={(event) => handleSpecialChange(event, "best")}
                />
                <label htmlFor="best">Best</label>
              </div>
              <div className="p-field-checkbox">
                <Checkbox
                  inputId="arrival"
                  name="arrival"
                  checked={values.arrival || false}
                  onChange={(event) => handleSpecialChange(event, "arrival")}
                />
                <label htmlFor="arrival">New arrival</label>
              </div>
              <div className="p-field-checkbox">
                <Checkbox
                  inputId="featured"
                  name="featured"
                  checked={values.featured || false}
                  onChange={(event) => handleSpecialChange(event, "featured")}
                />
                <label htmlFor="featured">Featured</label>
              </div>
            </div>

            <div className="p-d-flex p-jc-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={(e) => toggle(false)}
                className="p-button-warning p-mr-2 p-mb-2"
              />

              <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-secondary p-mr-2 p-mb-2"
                onClick={handleSubmit}
                disabled={!isValid || sending}
                loading={sending}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditProduct;
