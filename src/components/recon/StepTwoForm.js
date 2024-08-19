/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { useSecondApproval } from "../../hooks/reconcillations";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useReconStore from "../../stores/ReconStore";

const schema = yup.object().shape({
  credit_amount: yup.number().required("Credit Amount is required"),
  amount_used: yup.number()
    .required("Amount Used is required"),
  approved_one: yup.boolean().oneOf([true], "Approval is required"),
  approved_two: yup.boolean().oneOf([true], "Approval is required"),
});

const StepTwoForm = () =>
{
  const { isStepTwoFormOpened, toggleStepTwoForm, stage_two_initial_data } = useReconStore();

  const { mutate, isLoading } = useSecondApproval();
  

  const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: stage_two_initial_data,
  });

  // const [formState, setFormState] = useState({
  //   values: {
  //     id: "",
  //     value_date: "",
  //     credit_amount: Number(0),
  //     amount_used: Number(0),
  //     balance: Number(0),
  //     approved_one: false,
  //     approved_two: false,
  //   },
  //   touched: {},
  //   errors: {},
  // });
  // const { touched, errors, values, isValid } = formState;

  // useEffect(() => {
  //   let shouldSetData = typeof initial_data !== "undefined" ? true : false;
  //   if (shouldSetData) {
  //     const data = initial_data;
  //     setFormState((state) => ({
  //       ...state,
  //       values: {
  //         ...state.values,
  //         id: data && data.id,
  //         approved_one: data && data.approved_one,
  //         approved_two: data && data.approved_two,
  //         credit_amount: data && data.credit_amount,
  //         amount_used: data && data.amount_used,
  //         balance: data && data.balance,
  //         value_date: data && data.value_date,
  //       },
  //     }));
  //   }
  //   return () => {
  //     setFormState((prev) => ({
  //       ...prev,
  //       values: {
  //         ...prev.values,
  //         value_date: "",
  //         credit_amount: Number(0),
  //         amount_used: Number(0),
  //         balance: Number(0),
  //         approved_one: false,
  //         approved_two: false,
  //       },
  //     }));
  //   };
  // }, [initial_data]);


const onSubmit = (data) => {
    mutate(data.id);
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
            </div>

            <div className="p-field">
              <label htmlFor="amount_used">Amount Used</label>
              <Controller
                  name="amount_used"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    id="amount_used"
                    {...field}
                    type="text"
                    disabled
                  />
                )}
                />
            </div>

            <div className="p-field-checkbox">
              <label htmlFor="approved_two">Approve</label>

            <Controller
                  name="approved_two"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="approved_two"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
              {errors.amount_used && (
                  <small className="p-error p-d-block">{errors.amount_used.message}</small>
                )}
            </div>

            <div className="p-d-flex p-jc-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={toggleStepTwoForm}
                className="p-button-warning p-mr-2 p-mb-2"
              />

              <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-secondary p-mr-2 p-mb-2"
                onClick={handleSubmit}
                disabled={!isValid || isLoading}
                loading={isLoading}
                loadingOptions={{ position: "right" }}
              />
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default StepTwoForm;
