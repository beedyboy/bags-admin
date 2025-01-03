import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useCharge } from "../../hooks/useCard";
import useCardStore from "../../stores/CardStore";
import "primeflex/primeflex.css";
import { InvoicePreview } from "./InvoicePreview";

const ChargeCardModal = () => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState(false);
    const [loading, setLoading] = useState(false);

    const mutation = useCharge();
    const { isChargeCardModalOpen, activeCardId, toggleChargeCardModal, singleCard } = useCardStore();
 
    const title = singleCard?.reference || `${singleCard?.firstName} ${singleCard?.lastName}` || "Charge Card";

    const handleAmountChange = (e) => setAmount(e.target.value); 
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        if (e.target.value) setDescriptionError(false); 
    };

    const handleSubmit = async () => {
        if (amount <= 0 || !description) {
            if (!description) setDescriptionError(true);
            return;
        }


        setLoading(true);
        mutation.mutate(
            { id: activeCardId, data: { amount, description} },
            {
                onSuccess: () => {
                    setLoading(false);
                    setAmount("");
                    setDescription("");
                },
                onError: (error) => {
                    setLoading(false);
                    console.error("Failed to charge card:", error);
                },
            }
        );
    };

    return (
        <>
        <Dialog
            header={title}
            visible={isChargeCardModalOpen}
            onHide={toggleChargeCardModal}
            style={{ width: "500px" }}
            footer={
                <div className="p-d-flex p-jc-end p-mt-3">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={toggleChargeCardModal}
                        className="p-button-text p-mr-2"
                    />
                    <Button
                        label="Charge"
                        icon="pi pi-check"
                        onClick={handleSubmit}
                        loading={loading || mutation.isLoading}
                        disabled={amount <= 0}
                        className="p-button-primary"
                    />
                </div>
            }
        >
            <div className="p-fluid p-grid p-dir-column p-gap-3">
                <div className="p-field p-col-12">
                    <label htmlFor="amount" className="p-text-bold">Amount</label>
                    <InputText
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount to load"
                        type="number"
                        className={amount <= 0 ? "p-invalid" : ""}
                    />
                    {amount <= 0 && (
                        <small className="p-error">Amount must be greater than zero.</small>
                    )}
                </div>

                <div className="p-field p-col-12">
                    <label htmlFor="description" className="p-text-bold">Description</label>
                    <InputText
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Add a note for this transaction"
                        />
                        {descriptionError && (
                            <small className="p-error">Description is required.</small>
                        )}
                </div>
            </div>
            </Dialog>
            <InvoicePreview />
        </>
    );
};

export default ChargeCardModal;
