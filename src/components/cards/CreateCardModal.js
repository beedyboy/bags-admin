import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useCreateSingleCard } from "../../hooks/useCard";

const CreateCardModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const mutation = useCreateSingleCard();

  const handleCreateCard = async () => {
    setLoading(true);
    mutation.mutate(
        {}, // Pass data required by the API
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
    <Dialog header="Create Single Card" visible={isOpen} onHide={onClose}>
      <p>Click the button below to create a new card.</p>
      <Button
        label="Create Card"
        icon="pi pi-check"
        loading={loading || mutation.isLoading}
        onClick={handleCreateCard}
        disabled={mutation.isLoading}
      />
    </Dialog>
  );
};

export default CreateCardModal;
