import React, { useState, useMemo, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";
import CreateCardModal from "../../components/cards/CreateCardModal";
import { useFetchCards } from "../../hooks/useCard";
import RequestFundsModal from "../../components/cards/RequestFundModal";
import ChargeCardModal from "../../components/cards/ChargeCardModal";
import useCardStore from "../../stores/CardStore";
import CreateBulkCardModal from "../../components/cards/CreateBulkCardModal";

const CardManagement = () =>
{ 
    const { toggleActivateModal, toggleRequestFundsModal, toggleChargeCardModal } = useCardStore();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const statusMapping = useMemo(() => ["active", "suspended", "inactive"], []);
    const { data: cards = [], isLoading } = useFetchCards(statusMapping[activeTab], searchQuery);
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isBulkModalOpen, setsBulkModalOpen] = useState(false);
    const menuRef = useRef(null);
    const [selectedCard, setSelectedCard] = useState(null);

    const toggleSingleModal = () => setModalOpen(!isModalOpen);
    const toggleBulkModal = () => setsBulkModalOpen(!isBulkModalOpen);

    const handleMenuClick = (event, card) => {
        setSelectedCard(card);
        menuRef.current.show(event);
    };

    const handleStatusChange = async (id, status) => {
        try {
            // await useUpdateCardStatus(id, status);
            // Refresh card list after status change
        } catch (error) {
            console.error("Error updating card status:", error);
        }
    };

    const menuItems = useMemo(() => {
        const baseItems = [
            {
                label: "View Card",
                icon: "pi pi-eye",
            command: () => navigate(`/card-management/${selectedCard?.id}`),
 
            },
        ];
        if (activeTab !== 2) {
            baseItems.push(
                {
                    label: "Load Card",
                    icon: "pi pi-download",
                    command: () => toggleRequestFundsModal(selectedCard),
                },
                {
                    label: "Charge Card",
                    icon: "pi pi-upload",
                    command: () => toggleChargeCardModal(selectedCard),
                }
            );
        }
        baseItems.push(
            activeTab === 0
                ? {
                      label: "Deactivate",
                      icon: "pi pi-times",
                      command: () => toggleActivateModal(selectedCard?.id),
                  }
                : {
                      label: "Activate",
                      icon: "pi pi-check",
                      command: () => handleStatusChange(selectedCard?.id, "active"),
                  }
        );
        return baseItems;
    }, [activeTab, navigate, selectedCard, toggleRequestFundsModal, toggleChargeCardModal, toggleActivateModal]);

    return (
        <div className="card-management">
            <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <InputText
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Barcode"
                    style={{ flex: "1", marginRight: "1rem" }}
                />
                <div className="actions" style={{ display: "flex", gap: "0.5rem" }}>
                    <Button label="Create Single Card" icon="pi pi-plus" onClick={toggleSingleModal} />
                    <Button
                        label="Create Bulk Cards"
                        icon="pi pi-copy"
                        className="p-button-secondary"
                        onClick={toggleBulkModal} 
                    />
                </div>
            </div>

            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                {statusMapping.map((status, index) => (
                    <TabPanel key={status} header={`${status.charAt(0).toUpperCase()}${status.slice(1)} Cards`}>
                        <DataTable
                            value={index === activeTab ? cards : []}
                            loading={isLoading}
                            paginator
                            rows={10}
                            responsiveLayout="scroll"
                            emptyMessage="No cards found"
                            sortMode="multiple"
                        >
                            <Column field="barcode" header="Barcode" sortable />
                            <Column field="referenceNumber" header="Reference Number" sortable />
                            <Column field="loaded" header="Amount Loaded (₦)" sortable />
                            <Column field="balance" header="Current Balance (₦)" sortable />
                            <Column field="createdAt" header="Created Date" sortable />
                            <Column
                                header="Actions"
                                body={(card) => (
                                    <Button
                                        label="Actions"
                                        icon="pi pi-bars"
                                        onClick={(e) => handleMenuClick(e, card)}
                                    />
                                )}
                            />
                        </DataTable>
                    </TabPanel>
                ))}
            </TabView>

            <CreateCardModal isOpen={isModalOpen} onClose={toggleSingleModal} />
            <CreateBulkCardModal isOpen={isBulkModalOpen} onClose={toggleBulkModal} />

            <Menu model={menuItems} popup ref={menuRef} />

            <RequestFundsModal />
            <ChargeCardModal />
        </div>
    );
};

export default React.memo(CardManagement);
