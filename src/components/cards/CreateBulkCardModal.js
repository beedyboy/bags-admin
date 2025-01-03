import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useCreateBulkCards } from "../../hooks/useCard";

const CreateBulkCardModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const mutation = useCreateBulkCards();

  const handleCreateCard = async () => {
    if (count < 1) {
      alert("Count must be at least 1.");
      return;
    }

    setLoading(true);
    mutation.mutate(
      { count }, 
      {
        onSuccess: () => {
          setLoading(false);
          onClose();
        },
        onError: (error) => {
          setLoading(false);
          console.error("Failed to create card:", error);
        },
      }
    );
  };

  return (
    <Dialog
      header="Create Bulk Cards"
      visible={isOpen}
      onHide={onClose}
      style={{ width: "30vw" }}
      footer={
        <div className="p-d-flex p-jc-end">
          <Button
            label="Create Cards"
            icon="pi pi-check"
            loading={loading || mutation.isLoading}
            onClick={handleCreateCard}
            disabled={mutation.isLoading || count < 1}
            className="p-button-primary"
          />
        </div>
      }
    >
      <div className="p-mb-3">
        <p className="p-text-bold">Enter the number of cards to create:</p>
        <InputNumber
          value={count}
          onValueChange={(e) => setCount(e.value)}
          min={1} // Minimum value is 1
          showButtons
          buttonLayout="horizontal"
          decrementButtonClassName="p-button-secondary"
          incrementButtonClassName="p-button-secondary"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          className="p-inputnumber-sm"
        />
      </div>
      <div className="p-mt-2">
        <p className="p-text-secondary" style={{ fontSize: "0.9em" }}>
          <i className="pi pi-info-circle" style={{ marginRight: "0.5em" }}></i>
          All created cards will be <b>inactive</b>. You can activate them later in the card management dashboard.
        </p>
      </div>
    </Dialog>
  );
};

export default CreateBulkCardModal;

