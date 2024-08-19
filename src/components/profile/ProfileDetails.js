import React, { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import useAccountStore from "../../stores/AccountStore";
import { useUpdateProfile } from "../../hooks/account";

// Define the Yup validation schema
const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("Firstname is required"),
  lastname: Yup.string().required("Lastname is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  position: Yup.string().required("Position is required"),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
});

function ProfileDetails()
{
  
  const { myProfile } = useAccountStore();
  const { mutate, isPending } = useUpdateProfile();
  // Initialize the useForm hook
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // Prepopulate form with myProfile if available
  useEffect(() => {
    if (myProfile) {
      Object.keys(myProfile).forEach((key) => {
        setValue(key, myProfile[key]);
      });
    }
  }, [myProfile, setValue]);

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Fragment>
      <div className="p-d-flex p-flex-column w-100 p-jc-start">
        <Divider align="center" type="dashed">
          <span className="p-tag">User Information</span>
        </Divider>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-d-flex p-flex-lg-row p-flex-sm-column p-jc-around">
          <div className="p-d-flex p-flex-column w-100 p-jc-between">
            <div className="p-grid p-p-4">
              <label className="p-col-lg-4 p-text-bold" htmlFor="firstname">
                Firstname:
              </label>
              <div className="p-col-lg-8">
                <Inplace closable>
                  <InplaceDisplay>
                    {myProfile?.firstname || "Click to edit"}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      id="firstname"
                      {...register("firstname")}
                      className={errors.firstname ? "p-invalid" : ""}
                    />
                    <small className="p-error p-d-block">
                      {errors.firstname?.message}
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
                    {myProfile?.lastname || "Click to edit"}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      id="lastname"
                      {...register("lastname")}
                      className={errors.lastname ? "p-invalid" : ""}
                    />
                    <small className="p-error p-d-block">
                      {errors.lastname?.message}
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
                    {myProfile?.phone || "Click to edit"}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      id="phone"
                      {...register("phone")}
                      className={errors.phone ? "p-invalid" : ""}
                    />
                    <small className="p-error p-d-block">
                      {errors.phone?.message}
                    </small>
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
                    {myProfile?.email || "Cannot be edited"}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      type="email"
                      readOnly
                      {...register("email")}
                      className={errors.email ? "p-invalid" : ""}
                    />
                    <small className="p-error p-d-block">
                      {errors.email?.message}
                    </small>
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
                    {myProfile?.position || "Click to edit"}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      id="position"
                      {...register("position")}
                      className={errors.position ? "p-invalid" : ""}
                    />
                    <small className="p-error p-d-block">
                      {errors.position?.message}
                    </small>
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
                    {myProfile?.address || "Click to edit"}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputTextarea
                      rows={5}
                      cols={30}
                      {...register("address")}
                      className={errors.address ? "p-invalid" : ""}
                      autoResize
                    />
                    <small className="p-error p-d-block">
                      {errors.address?.message}
                    </small>
                  </InplaceContent>
                </Inplace>
              </div>
            </div>

            <Button
              label="Save"
              icon="pi pi-save"
              className="p-button-secondary p-mr-2 p-mb-2"
              type="submit"
              disabled={!isValid || isPending}
              loading={isPending}
              loadingOptions={{ position: "right" }}
            />
          </div>
        </div>
      </form>
    </Fragment>
  );
}

export default ProfileDetails;
