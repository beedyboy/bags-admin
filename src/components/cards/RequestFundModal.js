import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRequestFunds } from "../../hooks/useCard";
import useCardStore from "../../stores/CardStore";
import "primeflex/primeflex.css"; // Ensure PrimeFlex is imported for layout utilities

const RequestFundsModal = () => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const mutation = useRequestFunds();
    const { isRequestFundsModalOpen, activeCardId, toggleRequestFundsModal, singleCard } = useCardStore();

    // Determine the title (either reference or fullname)
    const title = singleCard?.reference || `${singleCard?.firstName} ${singleCard?.lastName}` || "Request Funds";

    const handleAmountChange = (e) => setAmount(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const handleSubmit = async () => {
        if (amount <= 0) return;

        setLoading(true);
        mutation.mutate(
            { id: activeCardId, data: { amount, description} },
            {
                onSuccess: () => {
                    setLoading(false);
                    toggleRequestFundsModal();
                },
                onError: (error) => {
                    setLoading(false);
                    console.error("Failed to request funds:", error);
                },
            }
        );
    };

    return (
        <Dialog
            header={title}
            visible={isRequestFundsModalOpen}
            onHide={toggleRequestFundsModal}
            style={{ width: "500px" }}
            footer={
                <div className="p-d-flex p-jc-end p-mt-3">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={toggleRequestFundsModal}
                        className="p-button-text p-mr-2"
                    />
                    <Button
                        label="Request Funds"
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
                    <label htmlFor="description" className="p-text-bold">Description (Optional)</label>
                    <InputText
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Add a note for this request"
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default RequestFundsModal;
