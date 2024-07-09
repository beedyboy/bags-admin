/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Accordion, AccordionTab } from "primereact/accordion";

const ACLForm = ({ reset, action, error, sending, assignRole, toggle, initial_data }) => {
    const [uid, setId] = useState();
    const [homePage, setHomePage] = useState("dashboard");
    const [priviledges, setPriviledges] = useState({
        brands: { add: false, view: false, del: false },
        category: { add: false, view: false, del: false },
        company: { manage: false },
        subscribers: { add: false, view: false, del: false },
        product: { add: false, view: false, del: false },
        staff: { add: false, view: false, del: false, modify: false },
        reconcillation: {
            upload: false,
            del: false,
            approval_one: false,
            approval_two: false,
            modify: false,
            report: false,
        },
        report: { manage: false },
    });
    const homies = [
        { name: "Stage One", key: "stage-one" },
        { name: "Stage Two", key: "stage-two" },
        { name: "Final Stage", key: "final-stage" },
        { name: "Dashboard", key: "dashboard" },
    ];

    useEffect(() => {
        if (!initial_data) return;

        let data = priviledges;

        if (typeof initial_data.roles === "string") {
            try {
                data = JSON.parse(initial_data.roles);
            } catch (e) {
                console.error("Failed to parse roles:", e);
            }
        } else if (typeof initial_data.roles === "object") {
            data = initial_data.roles;
        }

        const id = initial_data.id;
        setId(id);

        if (data && Object.keys(data).length !== 0) {
            setPriviledges((state) => ({
                ...state,
                brands: {
                    add: data.brands?.add || false,
                    view: data.brands?.view || false,
                    del: data.brands?.del || false,
                },
                category: {
                    add: data.category?.add || false,
                    view: data.category?.view || false,
                    del: data.category?.del || false,
                },
                company: {
                    manage: data.company?.manage || false,
                },
                subscribers: {
                    add: data.subscribers?.add || false,
                    view: data.subscribers?.view || false,
                    del: data.subscribers?.del || false,
                },
                product: {
                    add: data.product?.add || false,
                    view: data.product?.view || false,
                    del: data.product?.del || false,
                },
                staff: {
                    add: data.staff?.add || false,
                    view: data.staff?.view || false,
                    del: data.staff?.del || false,
                    modify: data.staff?.modify || false,
                },
                reconcillation: {
                    del: data.reconcillation?.del || false,
                    approval_one: data.reconcillation?.approval_one || false,
                    approval_two: data.reconcillation?.approval_two || false,
                    modify: data.reconcillation?.modify || false,
                    upload: data.reconcillation?.upload || false,
                    report: data.reconcillation?.report || false,
                },
                report: {
                    manage: data.report?.manage || false,
                },
            }));
            setHomePage(data.home ?? "dashboard");
        }
    }, [initial_data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const roleData = {
            priviledges,
            id: uid,
            home: homePage,
        };
        assignRole(roleData);
    };

    const handleRoleChange = (event, role) => {
        setPriviledges((formState) => ({
            ...formState,
            [role]: {
                ...formState[role],
                [event.target.name]: event.checked,
            },
        }));
    };

    useEffect(() => {
        if (action === "hasRole") {
            resetForm();
        }
        return () => {
            reset("saved", false);
            reset("message", "");
            resetForm();
            toggle(false);
        };
    }, [action]);

    useEffect(() => {
        if (error === true && action === "hasRoleError") {
        }
        return () => {
            reset("error", false);
            reset("message", "");
            resetForm();
            toggle(false);
        };
    }, [error]);

    const resetForm = () => {
        setPriviledges({
            brands: { add: false, view: false, del: false },
            category: { add: false, view: false, del: false },
            company: { manage: false },
            subscribers: { add: false, view: false, del: false },
            product: { add: false, view: false, del: false },
            staff: { add: false, view: false, del: false, modify: false },
            reconcillation: {
                upload: false,
                del: false,
                approval_one: false,
                approval_two: false,
                modify: false,
                report: false,
            },
            report: { manage: false },
        });
    };

    return (
        <Fragment>
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card p-fluid">
                        <Accordion activeIndex={0}>
                            <AccordionTab header="Brand">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="add" name="add" checked={priviledges.brands?.add || false} onChange={(event) => handleRoleChange(event, "brands")} />
                                        <label htmlFor="add">Add</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="view" name="view" checked={priviledges.brands?.view || false} onChange={(event) => handleRoleChange(event, "brands")} />
                                        <label htmlFor="view">View</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="del" name="del" checked={priviledges.brands?.del || false} onChange={(event) => handleRoleChange(event, "brands")} />
                                        <label htmlFor="del">Del</label>
                                    </div>
                                </div>
                            </AccordionTab>
                            <AccordionTab header="Category">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="add" name="add" checked={priviledges.category?.add || false} onChange={(event) => handleRoleChange(event, "category")} />
                                        <label htmlFor="add">Add</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="view" name="view" checked={priviledges.category?.view || false} onChange={(event) => handleRoleChange(event, "category")} />
                                        <label htmlFor="view">View</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="del" name="del" checked={priviledges.category?.del || false} onChange={(event) => handleRoleChange(event, "category")} />
                                        <label htmlFor="del">Del</label>
                                    </div>
                                </div>
                            </AccordionTab>
                            <AccordionTab header="Subscribers">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="add" name="add" checked={priviledges.subscribers?.add || false} onChange={(event) => handleRoleChange(event, "subscribers")} />
                                        <label htmlFor="add">Add</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="view" name="view" checked={priviledges.subscribers?.view || false} onChange={(event) => handleRoleChange(event, "subscribers")} />
                                        <label htmlFor="view">View</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="del" name="del" checked={priviledges.subscribers?.del || false} onChange={(event) => handleRoleChange(event, "subscribers")} />
                                        <label htmlFor="del">Del</label>
                                    </div>
                                </div>
                            </AccordionTab>
                            <AccordionTab header="Product">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="add" name="add" checked={priviledges.product?.add || false} onChange={(event) => handleRoleChange(event, "product")} />
                                        <label htmlFor="add">Add</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="view" name="view" checked={priviledges.product?.view || false} onChange={(event) => handleRoleChange(event, "product")} />
                                        <label htmlFor="view">View</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="del" name="del" checked={priviledges.product?.del || false} onChange={(event) => handleRoleChange(event, "product")} />
                                        <label htmlFor="del">Del</label>
                                    </div>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Staff">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="add" name="add" checked={priviledges.staff?.add || false} onChange={(event) => handleRoleChange(event, "staff")} />
                                        <label htmlFor="add">Add</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="view" name="view" checked={priviledges.staff?.view || false} onChange={(event) => handleRoleChange(event, "staff")} />
                                        <label htmlFor="view">View</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="del" name="del" checked={priviledges.staff?.del || false} onChange={(event) => handleRoleChange(event, "staff")} />
                                        <label htmlFor="del">Del</label>
                                    </div>
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="modify" name="modify" checked={priviledges.staff?.modify || false} onChange={(event) => handleRoleChange(event, "staff")} />
                                        <label htmlFor="modify">Modify</label>
                                    </div>
                                </div>
                            </AccordionTab>
                            <AccordionTab header="Reconcillation">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="upload" name="upload" checked={priviledges.reconcillation?.upload || false} onChange={(event) => handleRoleChange(event, "reconcillation")} />
                                        <label htmlFor="upload">Upload</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="approval_one" name="approval_one" checked={priviledges.reconcillation?.approval_one || false} onChange={(event) => handleRoleChange(event, "reconcillation")} />
                                        <label htmlFor="view">Stage One</label>
                                    </div>
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="approval_two" name="approval_two" checked={priviledges.reconcillation?.approval_two || false} onChange={(event) => handleRoleChange(event, "reconcillation")} />
                                        <label htmlFor="approval_two">Stage Two</label>
                                    </div>

                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="del" name="del" checked={priviledges.reconcillation?.del || false} onChange={(event) => handleRoleChange(event, "reconcillation")} />
                                        <label htmlFor="del">Del</label>
                                    </div>
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="report" name="report" checked={priviledges.reconcillation?.report || false} onChange={(event) => handleRoleChange(event, "reconcillation")} />
                                        <label htmlFor="report">Report</label>
                                    </div>
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="modify" name="modify" checked={priviledges.reconcillation?.modify || false} onChange={(event) => handleRoleChange(event, "reconcillation")} />
                                        <label htmlFor="modify">Modify</label>
                                    </div>
                                </div>
                            </AccordionTab>
                            <AccordionTab header="Company">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="manage" name="manage" checked={priviledges.company?.manage || false} onChange={(event) => handleRoleChange(event, "company")} />
                                        <label htmlFor="manage">Manage</label>
                                    </div>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Report">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="manage" name="manage" checked={priviledges.report?.manage || false} onChange={(event) => handleRoleChange(event, "report")} />
                                        <label htmlFor="manage">Manage</label>
                                    </div>
                                </div>
                            </AccordionTab>

                            <AccordionTab header="Set Home Page">
                                <div className="p-d-flex p-flex-column p-flex-md-row  p-jc-between">
                                    {homies.map((item) => {
                                        return (
                                            <div key={item.key} className="p-field-radiobutton">
                                                <RadioButton inputId={item.key} name="homePage" value={item} onChange={(e) => setHomePage(e.value?.key)} checked={homePage === item.key} />
                                                <label htmlFor={item.key}>{item.name}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionTab>
                        </Accordion>
                        <div className="p-d-flex p-mt-2 p-jc-end">
                            <Button label="Cancel" icon="pi pi-times" onClick={(e) => toggle(false)} className="p-button-warning p-mr-2 p-mb-2" />

                            <Button label="Save" icon="pi pi-check" className="p-button-secondary p-mr-2 p-mb-2" onClick={handleSubmit} disabled={sending} loading={sending} loadingOptions={{ position: "right" }} />
                        </div>{" "}
                        {/* ends here */}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ACLForm;
