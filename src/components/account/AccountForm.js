import React, { Fragment, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAccountStore from "../../stores/AccountStore";
import { useCreateAccount, useUpdateAccount } from "../../hooks/account";

// Schema for validation using yup
const schema = yup.object().shape({
  firstname: yup.string().required("Firstname is required"),
  lastname: yup.string().required("Lastname is required"),
  email: yup.string().email("A valid email is required").required("Email is required"),
  password: yup.string().when('mode', {
    is: 'Add',
    then: (schema) => schema.required('Password is required').min(6, 'A minimum of 6 characters password is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});


const AccountForm = ({ handleClose }) => {
  const { mode, exist, message, checking, initial_data, confirmEmail } = useAccountStore();
  const { mutate: createAccount, isLoading } = useCreateAccount();
  const { mutate: updateAccount, isLoading: isUpdating } = useUpdateAccount();

  // useForm hook with yupResolver for validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initial_data,
  });

  // Watch email field
  const email = watch("email");

  useEffect(() => {
    if (mode === "Add" && email) {
      // Check email existence
      confirmEmail(email);
    }
  }, [email, mode, confirmEmail]);

  useEffect(() => {
    if (mode === "Edit") {
      Object.keys(initial_data).forEach((key) => {
        setValue(key, initial_data[key]);
      });
    }
  }, [initial_data, mode, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    if (mode === "Add") {
      delete data.id;
      createAccount(data);
    } else
    {
      const { id, ...payload } = data;
      updateAccount(id, payload);
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-grid">
          <div className="p-col-12">
            <div className="card p-fluid">
              <div className="p-field">
                <label htmlFor="firstname">Firstname</label>
                <InputText
                  id="firstname"
                  {...register("firstname")}
                  className={`${errors.firstname ? "p-invalid" : ""} p-d-block`}
                />
                <small id="firstname-help" className="p-error p-d-block">
                  {errors.firstname?.message}
                </small>
              </div>

              <div className="p-field">
                <label htmlFor="lastname">Lastname</label>
                <InputText
                  id="lastname"
                  {...register("lastname")}
                  className={`${errors.lastname ? "p-invalid" : ""} p-d-block`}
                />
                <small id="lastname-help" className="p-error p-d-block">
                  {errors.lastname?.message}
                </small>
              </div>

              <div className="p-field">
                <label htmlFor="phone">Phone</label>
                <InputText id="phone" {...register("phone")} className="p-d-block" />
              </div>

              <div className="p-field">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  {...register("email")}
                  readOnly={mode === "Edit"}
                  className={`${errors.email ? "p-invalid" : ""} p-d-block`}
                />
                <small id="email-help" className="p-error p-d-block">
                  {errors.email?.message}
                </small>
                {exist && <Message severity="error" text={message} />}
                {checking && <Message severity="info" text="Checking server for duplicates..." />}
              </div>

              {mode === "Add" && (
                <div className="p-field">
                  <label htmlFor="password">Password</label>
                  <Password
                    id="password"
                    {...register("password")}
                    toggleMask
                    className={`${errors.password ? "p-invalid" : ""} p-d-block`}
                  />
                  <small id="password-help" className="p-error p-d-block">
                    {errors.password?.message}
                  </small>
                </div>
              )}

              <div className="p-field">
                <label htmlFor="address">Address</label>
                <InputTextarea id="address" {...register("address")} rows="4" />
              </div>
            </div>
          </div>

          <div className="p-col">
            <div className="p-d-flex p-jc-end">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => handleClose(false)}
                className="p-button-warning p-mr-2 p-mb-2"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-secondary p-mr-2 p-mb-2"
                type="submit"
                disabled={!isValid || isLoading || exist}
                loading={isLoading || isUpdating}
                loadingOptions={{ position: "right" }}
              />
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default AccountForm;
