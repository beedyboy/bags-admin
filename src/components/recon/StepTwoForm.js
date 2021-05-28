/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from "primereact/button"; 
import { Checkbox } from "primereact/checkbox";
import dataHero from "data-hero"; 
const schema = {
  approved_one: {
    isEmpty: false, 
    message: "Field is required",
  }
};
const StepTwoForm = ({ 
  action, 
  sending, 
  saveApproval, 
  toggle,
  initial_data,
}) => { 
  const [formState, setFormState] = useState({
    values: {
      id: "",
      value_date: "",
      credit_amount: "",
      amount_used: "",
      balance: "",
      approved_one: false,
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
            id: data && data.id,
            approved_one: data && data.approved_one,
            credit_amount: data && data.credit_amount,
            amount_used: data && data.amount_used,
            balance: data && data.balance,
            value_date: data && data.value_date,
          },
        }));
      } 
    return () => {
      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          value_date: "",
      credit_amount: "",
      amount_used: "",
      balance: "",
      approved_one: false,
        },
      }));
    };
  }, [initial_data]);
  useEffect(() => {
    const errors = dataHero.validate(schema, values);
    setFormState((formState) => ({
      ...formState,
      isValid: errors.approved_one.error ? false : true,
      errors: errors || {},
    }));
  }, [values]); 

  const setValue = (value) => { 
    let balance = 0;
    const credit = values.credit_amount;
    if(value <= credit) {
      balance = credit - value;
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          amount_used: value,
          balance
        },
        touched: {
          ...formState.touched,
          amount_used: true,
        },
      })); 
    }
   
  };

  useEffect(() => {
    if (action === "approved") {
      resetForm();
      toggle(false);
    }
    return () => {
      resetForm();
      toggle(false);
    };
  }, [action]); 
 
  const handleApproval = (event) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        approved_one: event.checked,
      },
      touched: {
        ...formState.touched,
        approved_one: true
      }
    }));
  };
  const hasError = (field) => touched[field] && errors[field].error;

  const handleSubmit = (e) => {
    e.preventDefault();
   saveApproval(values, 'second') 
  }
  const resetForm = () => {
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        id: "",
        value_date: "",
        credit_amount: "",
        amount_used: "",
        balance: "",
        approved_one: false,
      },
      touched: {
        ...prev.touched,
        value_date: false,
        balance: false,
        amount_used: false,
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
              <label htmlFor="credit_amount">Credit Amount</label>
              <InputText
                id="credit_amount"
                name="credit_amount"
                type="text"
                disabled
                value={values.credit_amount || ""} 
              /> 
            </div>
          
            
            <div className="p-field">
              <label htmlFor="amount_used">Amount Used</label>
              <InputNumber
                id="amount_used"
                name="amount_used"
                mode="currency" currency="NGN" locale="en-NG" 
                value={values.amount_used || ""}
                onValueChange={(e) => setValue(e.value)}
              /> 
            </div>
          
            
                 <div className="p-field-checkbox">
                    <Checkbox
                      inputId="approved_one"
                      name="approved_one"
                      checked={values.approved_one || false}
                      onChange={(event) => handleApproval(event, "brands")}
                aria-describedby="approved_one-help"
                className={` ${hasError("name") ? "p-invalid" : null} " p-d-block"`}
                    />
                    <label htmlFor="approved_one">Approve</label>
                  
              <small id="approved_one-help" className="p-error p-d-block">
                {hasError("approved_one") ? errors.approved_one && errors.approved_one.message : null}
              </small> 
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
            loadingOptions={{ position: "right" }}
            />
            </div>
        </div> 
     </div>
      </div>
  
        </Fragment>
  );
};

export default StepTwoForm;
