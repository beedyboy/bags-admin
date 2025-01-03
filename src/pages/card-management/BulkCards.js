import React, { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useCreateBulkCards } from "../../hooks/useCard";

const BulkCards = () => {
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
    const mutation = useCreateBulkCards();

    const handleCreateBulkCards = async () => {
        setLoading(true);
        mutation.mutate(
            { quantity },
            {
                onSuccess: () => {
                    setLoading(false);
                    alert("Bulk cards created successfully!");
                },
                onError: (error) => {
                    setLoading(false);
                    console.error("Failed to create bulk cards:", error);
                },
            }
        );
    };

    return (
        <div className="create-bulk-cards">
            <h2>Create Bulk Cards</h2>
            <div className="form">
                <InputNumber
                    value={quantity}
                    onValueChange={(e) => setQuantity(e.value)}
                    placeholder="Number of Cards"
                    min={1}
                />
                <Button
                    label="Create Bulk Cards"
                    icon="pi pi-check"
                    onClick={handleCreateBulkCards}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default BulkCards;
