import React, { Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useReconStore from "../../stores/ReconStore";
import { useFirstApproval } from "../../hooks/reconcillations";


const schema = yup.object().shape({
  credit_amount: yup.number().required("Credit Amount is required"),
  amount_used: yup.number()
    .required("Amount Used is required")
    .max(
      yup.ref('credit_amount'), 
      "Amount Used cannot exceed Credit Amount"
    ),
  waybill_number: yup.string().required("Way Bill Number is required"),
  approved_one: yup.boolean().oneOf([true], "Approval is required"),
});


// Calculate balance based on amount used and credit amount
const calculateBalance = (credit, amountUsed) => {
  return amountUsed <= credit ? credit - amountUsed : 0;
};

const StepOneForm = () => {
  const { stage_one_initial_data, toggleStepOneForm } = useReconStore();
  const { mutate:approveStageOne, isLoading } = useFirstApproval();

  const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: stage_one_initial_data,
  });

  const onSubmit =  (data) => {
    approveStageOne(data);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="p-grid">
          <div className="p-col-12">
            <div className="card p-fluid">
              <div className="p-field">
                <label htmlFor="credit_amount">Credit Amount</label>
                <Controller
                  name="credit_amount"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="credit_amount"
                      {...field}
                      type="text"
                      disabled
                    />
                  )}
                />
                {errors.credit_amount && (
                  <small className="p-error p-d-block">{errors.credit_amount.message}</small>
                )}
              </div>

              <div className="p-field">
                <label htmlFor="amount_used">Amount Used</label>
                <Controller
                  name="amount_used"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      id="amount_used"
                      mode="currency"
                      currency="NGN"
                      locale="en-NG"
                      value={field.value}
                      onValueChange={(e) => {
                        const newValue = e.value;
                        const creditAmount = stage_one_initial_data.credit_amount || 0;
                        const newBalance = calculateBalance(creditAmount, newValue);
                        setValue("balance", newBalance);
                        field.onChange(newValue);
                      }}
                    />
                  )}
                />
                {errors.amount_used && (
                  <small className="p-error p-d-block">{errors.amount_used.message}</small>
                )}
              </div>

              <div className="p-field">
                <label htmlFor="balance">Balance</label>
                <Controller
                  name="balance"
                  control={control}
                  render={({ field }) => (
                    <InputText id="balance" {...field} type="text" disabled />
                  )}
                />
                {errors.balance && (
                  <small className="p-error p-d-block">{errors.balance.message}</small>
                )}
              </div>

              <div className="p-field">
                <label htmlFor="waybill_number">Way Bill Number</label>
                <Controller
                  name="waybill_number"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="waybill_number"
                      {...field}
                      type="text"
                    />
                  )}
                />
                {errors.waybill_number && (
                  <small className="p-error p-d-block">{errors.waybill_number.message}</small>
                )}
              </div>

              <div className="p-field-checkbox">
                <Controller
                  name="approved_one"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="approved_one"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="approved_one">Approve</label>
                {errors.approved_one && (
                  <small className="p-error p-d-block">{errors.approved_one.message}</small>
                )}
              </div>

              <div className="p-d-flex p-jc-end">
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  onClick={toggleStepOneForm}
                  className="p-button-warning p-mr-2 p-mb-2"
                />

                <Button
                  label="Save"
                  icon="pi pi-check"
                  className="p-button-secondary p-mr-2 p-mb-2"
                  type="submit"
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default StepOneForm;
