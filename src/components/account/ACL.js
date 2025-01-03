/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { RadioButton } from "primereact/radiobutton";
import useAccountStore from "../../stores/AccountStore";
import { useSetRole } from "../../hooks/account";

const ACLForm = () => {
    const { roleData } = useAccountStore();
    const {
        handleSubmit,
        control,
    } = useForm({
        defaultValues: roleData,
    });

    const homies = [
        { name: "Stage One", key: "stage-one" },
        { name: "Stage Two", key: "stage-two" },
        { name: "Final Stage", key: "final-stage" },
        { name: "Card", key: "card-management" },
        { name: "Dashboard", key: "dashboard" },
    ];

    const { mutate: assignRole, isPending } = useSetRole();


    const onSubmit = (data) =>
    {
        const { home, ...rest } = data;
        const payload = {
            home,
            roles: [rest]
        }
        assignRole(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card p-fluid">
                        <Accordion activeIndex={0}>
                            <AccordionTab header="Brand">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <Controller name="brands.add" control={control} render={({ field }) => <Checkbox inputId="add" {...field} checked={field.value} />} />
                                    <label htmlFor="add">Add</label>

                                    <Controller name="brands.view" control={control} render={({ field }) => <Checkbox inputId="view" {...field} checked={field.value} />} />
                                    <label htmlFor="view">View</label>

                                    <Controller name="brands.del" control={control} render={({ field }) => <Checkbox inputId="del" {...field} checked={field.value} />} />
                                    <label htmlFor="del">Del</label>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Category">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <Controller name="category.add" control={control} render={({ field }) => <Checkbox inputId="add" {...field} checked={field.value} />} />
                                    <label htmlFor="add">Add</label>

                                    <Controller name="category.view" control={control} render={({ field }) => <Checkbox inputId="view" {...field} checked={field.value} />} />
                                    <label htmlFor="view">View</label>

                                    <Controller name="category.del" control={control} render={({ field }) => <Checkbox inputId="del" {...field} checked={field.value} />} />
                                    <label htmlFor="del">Del</label>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Subscribers">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <Controller name="subscribers.add" control={control} render={({ field }) => <Checkbox inputId="add" {...field} checked={field.value} />} />
                                    <label htmlFor="add">Add</label>

                                    <Controller name="subscribers.view" control={control} render={({ field }) => <Checkbox inputId="view" {...field} checked={field.value} />} />
                                    <label htmlFor="view">View</label>

                                    <Controller name="subscribers.del" control={control} render={({ field }) => <Checkbox inputId="del" {...field} checked={field.value} />} />
                                    <label htmlFor="del">Del</label>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Product">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <Controller name="product.add" control={control} render={({ field }) => <Checkbox inputId="add" {...field} checked={field.value} />} />
                                    <label htmlFor="add">Add</label>

                                    <Controller name="product.view" control={control} render={({ field }) => <Checkbox inputId="view" {...field} checked={field.value} />} />
                                    <label htmlFor="view">View</label>

                                    <Controller name="product.del" control={control} render={({ field }) => <Checkbox inputId="del" {...field} checked={field.value} />} />
                                    <label htmlFor="del">Del</label>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Staff">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <Controller name="staffs.add" control={control} render={({ field }) => <Checkbox inputId="add" {...field} checked={field.value} />} />
                                    <label htmlFor="add">Add</label>

                                    <Controller name="staffs.view" control={control} render={({ field }) => <Checkbox inputId="view" {...field} checked={field.value} />} />
                                    <label htmlFor="view">View</label>

                                    <Controller name="staffs.del" control={control} render={({ field }) => <Checkbox inputId="del" {...field} checked={field.value} />} />
                                    <label htmlFor="del">Del</label>

                                    <Controller name="staffs.modify" control={control} render={({ field }) => <Checkbox inputId="modify" {...field} checked={field.value} />} />
                                    <label htmlFor="modify">Modify</label>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Reconciliation">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <Controller name="reconcillation.upload" control={control} render={({ field }) => <Checkbox inputId="upload" {...field} checked={field.value} />} />
                                    <label htmlFor="upload">Upload</label>

                                    <Controller name="reconcillation.approval_one" control={control} render={({ field }) => <Checkbox inputId="approval_one" {...field} checked={field.value} />} />
                                    <label htmlFor="approval_one">Approval One</label>

                                    <Controller name="reconcillation.approval_two" control={control} render={({ field }) => <Checkbox inputId="approval_two" {...field} checked={field.value} />} />
                                    <label htmlFor="approval_two">Approval Two</label>

                                    <Controller name="reconcillation.del" control={control} render={({ field }) => <Checkbox inputId="del" {...field} checked={field.value} />} />
                                    <label htmlFor="del">Del</label>

                                    <Controller name="reconcillation.modify" control={control} render={({ field }) => <Checkbox inputId="modify" {...field} checked={field.value} />} />
                                    <label htmlFor="modify">Modify</label>

                                    <Controller name="reconcillation.report" control={control} render={({ field }) => <Checkbox inputId="report" {...field} checked={field.value} />} />
                                    <label htmlFor="report">Report</label>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Company">
                                <div className="p-d-flex p-flex-column p-flex-md-row">
                                    <Controller name="company.manage" control={control} render={({ field }) => <Checkbox inputId="manage" {...field} checked={field.value} />} />
                                    <label htmlFor="manage">Manage</label>
                                </div>
                            </AccordionTab>
                            <AccordionTab header="Card Management">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <Controller name="card.create" control={control} render={({ field }) => <Checkbox inputId="create" {...field} checked={field.value} />} />
                                    <label htmlFor="create">Create</label>

                                    <Controller name="card.review" control={control} render={({ field }) => <Checkbox inputId="review" {...field} checked={field.value} />} />
                                    <label htmlFor="review">Review request</label>

                                    <Controller name="card.load" control={control} render={({ field }) => <Checkbox inputId="load" {...field} checked={field.value} />} />
                                    <label htmlFor="load">Load</label>

                                    <Controller name="card.view" control={control} render={({ field }) => <Checkbox inputId="view" {...field} checked={field.value} />} />
                                    <label htmlFor="view">View</label>

                                    <Controller name="card.cashier" control={control} render={({ field }) => <Checkbox inputId="cashier" {...field} checked={field.value} />} />
                                    <label htmlFor="cashier">Cashier</label>

                                    <Controller name="card.report" control={control} render={({ field }) => <Checkbox inputId="report" {...field} checked={field.value} />} />
                                    <label htmlFor="report">Report</label>
                                </div>
                            </AccordionTab>
                            <AccordionTab header="Default Homepage">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    {homies.map((homie) => (
                                        <div key={homie.key}>
                                            <Controller name="home" control={control} render={({ field }) => <RadioButton {...field} inputId={homie.key} value={homie.key} checked={field.value === homie.key} />} />
                                            <label htmlFor={homie.key}>{homie.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </AccordionTab>
                        </Accordion>

                        <div className="p-d-flex p-jc-end p-mt-3">
                            <Button type="submit" label={isPending ? "isPending..." : "Save"} className="p-button-success" disabled={isPending} />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ACLForm;
