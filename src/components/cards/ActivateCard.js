import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useActivateCard } from "../../hooks/useCard"; 
import useCardStore from "../../stores/CardStore";
import 'primeflex/primeflex.css';

const ActivateCardModal = () => {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const mutation = useActivateCard();

    const { isActivateModalOpen, activeCardId, toggleActivateModal } = useCardStore();

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        mutation.mutate(
            { id: activeCardId, data: formData }, 
            {
                onSuccess: (response) => {
                    setLoading(false);
                    toggleActivateModal();  
                },
                onError: (error) => {
                    setLoading(false);
                    console.error("Failed to activate card:", error); 
                },
            }
        );
    };

    return (
        <Dialog
            header="Activate Card"
            visible={isActivateModalOpen}
            onHide={toggleActivateModal} 
            footer={
                <div className="p-d-flex p-jc-end">
                    <Button 
                        label="Cancel" 
                        icon="pi pi-times" 
                        onClick={toggleActivateModal} 
                        className="p-button-text p-mr-2" 
                    />
                    <Button
                        label="Activate"
                        icon="pi pi-check"
                        onClick={handleSubmit} 
                        loading={loading || mutation.isLoading}
                        className="p-button-primary"
                    />
                </div>
            }
            style={{ width: '400px' }} 
        >
            <div className="p-fluid">
                <div className="p-field p-grid">
                    <label htmlFor="firstName" className="p-col-12 p-md-4">First Name</label>
                    <div className="p-col-12 p-md-8">
                        <InputText 
                            id="firstName" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleInputChange} 
                            className="p-inputtext-sm" 
                        />
                    </div>
                </div>
                <div className="p-field p-grid">
                    <label htmlFor="lastName" className="p-col-12 p-md-4">Last Name</label>
                    <div className="p-col-12 p-md-8">
                        <InputText 
                            id="lastName" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleInputChange} 
                            className="p-inputtext-sm" 
                        />
                    </div>
                </div>
                <div className="p-field p-grid">
                    <label htmlFor="phone" className="p-col-12 p-md-4">Phone Number</label>
                    <div className="p-col-12 p-md-8">
                        <InputText 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            className="p-inputtext-sm" 
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ActivateCardModal;
