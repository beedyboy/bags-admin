import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { useAcceptFundRequest, useFetchCardDetails, useFetchCardTransactions, useRejectFundRequest } from "../../hooks/useCard";
import useCardStore from "../../stores/CardStore";
import ActivateCardModal from "../../components/cards/ActivateCard";
import RequestFundsModal from "../../components/cards/RequestFundModal";
import ChargeCardModal from "../../components/cards/ChargeCardModal";
import TransactionActions from "../../components/cards/TransactionActions";
import { CardActivityTypeLabels } from "../../shared/card";
import IDCard from "../../components/cards/IDCard";
import CardFront from "../../components/cards/CardFront";
import { Dropdown } from "primereact/dropdown";
import CardBack from "../../components/cards/CardBack";

const ViewCard = () => {
    const { toggleActivateModal, toggleRequestFundsModal, toggleChargeCardModal } = useCardStore();
    const { cardId } = useParams();
    const navigate = useNavigate();
    const printFrontRef = useRef();
    const printBackRef = useRef();


    const [printOption, setPrintOption] = useState(null);
    const { data: cardDetails, isLoading: loadingDetails } = useFetchCardDetails(cardId);
    const { data: transactions, isLoading: loadingTransactions } = useFetchCardTransactions(cardId);

    const { mutate: rejectFundRequest } = useRejectFundRequest();
    const { mutate: acceptFundRequest } = useAcceptFundRequest();

    const [confirmDialog, setConfirmDialog] = useState({ visible: false, message: "", action: null });

    const isCardActive = cardDetails?.status === "active";

    const handlePrintFront = useReactToPrint({
        contentRef: printFrontRef,
        documentTitle: "Card Front",
    });

    const handlePrintBack = useReactToPrint({
        contentRef: printBackRef,
        documentTitle: "Card Back",
    });


    if (loadingDetails || !cardDetails) {
        return <div>Loading card details...</div>;
    }

    const renderActionButton = () => {
        switch (cardDetails.status) {
            case "active":
                return <Button label="Deactivate" icon="pi pi-times" className="p-button-danger" onClick={() => console.log("Deactivate card:", cardId)} />;
            case "inactive":
                return <Button label="Activate" icon="pi pi-check" className="p-button-success" onClick={() => toggleActivateModal(cardId)} />;
            case "suspended":
                return <Button label="Reactivate" icon="pi pi-replay" className="p-button-warning" onClick={() => console.log("Reactivate card:", cardId)} />;
            default:
                return null;
        }
    };

    const handleConfirm = (action, message) => {
        setConfirmDialog({
            visible: true,
            message: `${message}`,
            action,
        });
    };

    const executeAction = () => {
        if (confirmDialog.action) {
            confirmDialog.action();
        }
        setConfirmDialog({ visible: false, message: "", action: null });
    };


    const transactionActionsTemplate = (rowData) => <TransactionActions rowData={rowData} handleConfirm={handleConfirm} acceptFundRequest={acceptFundRequest} rejectFundRequest={rejectFundRequest} cardDetails={cardDetails} />;

    const renderStatus = (status) => {
        if (!status) return;

        const severity =
            {
                completed: "success",
                pending: "warning",
                failed: "danger",
                rejected: "danger",
            }[status?.toLowerCase()] || "info";

        return <Badge value={status?.toUpperCase()} severity={severity} />;
    };
    const handlePrintSelection = () => {
        setTimeout(() => {
            if (cardDetails) {
                switch (printOption) {
                    case "front":
                        handlePrintFront();
                        break;
                    case "back":
                        handlePrintBack();
                        break;
                    default:
                        console.error("No valid print option selected.");
                        break;
                }
            } else {
                console.error("No valid transaction or card details.");
            }
        }, 300);
    };

    const printOptions = [
        { label: "Print Front", value: "front" },
        { label: "Print Back", value: "back" },
    ];

    return (
        <div className="p-m-4">
            {/* Header */}
            <div className="p-d-flex p-ai-center p-jc-between p-mb-3">
                <h2>Card Details</h2>
                <Button label="Back to Card Management" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate("/card-management")} />
            </div>

            <div className="p-d-flex p-ai-center" style={{ gap: "1rem" }}>
                <Dropdown value={printOption} options={printOptions} onChange={(e) => setPrintOption(e.value)} placeholder="Select Print Option" />
                <Button label="Print" icon="pi pi-print" className="p-button-success" onClick={handlePrintSelection} disabled={!printOption} />
            </div>

            <div className="p-grid p-mb-4">
                {/* Left Section */}
                <div className="p-col-12 p-md-5">
                    <div className="p-card">
                        <div className="p-card-body p-text-center">
                            <Barcode value={cardDetails.barcode} />
                            <p className="p-mt-3">
                                <strong>Barcode:</strong> {cardDetails.barcode}
                            </p>
                            <p>
                                <strong>Reference:</strong> {cardDetails.referenceNumber}
                            </p>
                            <p>
                                <strong>Status:</strong> {cardDetails.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="p-col-12 p-md-7">
                    <div className="p-card">
                        <div className="p-card-body">
                            <div className="p-grid">
                                <div className="p-col-6">
                                    <p>
                                        <strong>First Name:</strong> {cardDetails.firstName}
                                    </p>
                                </div>
                                <div className="p-col-6">
                                    <p>
                                        <strong>Last Name:</strong> {cardDetails.lastName}
                                    </p>
                                </div>
                                <div className="p-col-6">
                                    <p>
                                        <strong>Phone:</strong> {cardDetails.phone}
                                    </p>
                                </div>
                                <div className="p-col-6">
                                    <p>
                                        <strong>Balance:</strong> ₦{cardDetails?.balance}
                                    </p>
                                </div>
                                <div className="p-col-6">
                                    <p>
                                        <strong>Created Date:</strong> {new Date(cardDetails.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="p-col-6">
                                    <p>
                                        <strong>Activated Date:</strong> {cardDetails.activatedAt ? new Date(cardDetails.activatedAt).toLocaleDateString() : "Not Activated"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-d-flex p-ai-center p-gap-2 p-mt-4" style={{ gap: "1rem" }}>
                        {renderActionButton()}
                        <Button label="Load Card" icon="pi pi-download" disabled={!isCardActive} onClick={() => toggleRequestFundsModal(cardDetails)} />
                        <Button label="Charge Card" icon="pi pi-upload" className="p-button-warning" disabled={!isCardActive} onClick={() => toggleChargeCardModal(cardDetails)} />
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div>
                <h3>Transaction History</h3>
                <DataTable value={transactions} loading={loadingTransactions} paginator rows={10} responsiveLayout="scroll" emptyMessage="No transactions available.">
                    <Column field="timestamp" header="Date" sortable />
                    <Column field="activity_type" header="Type" body={(rowData) => CardActivityTypeLabels[rowData.activity_type] || rowData.activity_type} sortable />
                    <Column field="amount" header="Amount (₦)" sortable />
                    <Column field="description" header="Description" sortable />
                    <Column field="status" header="Status" body={(rowData) => renderStatus(rowData.status)} sortable />

                    <Column header="Actions" body={transactionActionsTemplate} style={{ textAlign: "center", width: "150px" }} />
                </DataTable>
            </div>

            {/* PrimeReact Dialog */}
            <Dialog
                visible={confirmDialog.visible}
                header="Confirmation"
                modal
                onHide={() => setConfirmDialog({ visible: false, message: "", action: null })}
                footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setConfirmDialog({ visible: false, message: "", action: null })} />
                        <Button label="Confirm" icon="pi pi-check" className="p-button-danger" onClick={executeAction} />
                    </div>
                }
            >
                <p>{confirmDialog.message}</p>
            </Dialog>

            <ActivateCardModal />
            <RequestFundsModal />
            <ChargeCardModal />

            <div id="print-container" style={{ display: "none" }}>
                <IDCard ref={printFrontRef}>
                    <CardFront barcodeValue={cardDetails.barcode} cardHolderName={`${cardDetails.firstName} ${cardDetails.lastName}`} referenceNumber={cardDetails.referenceNumber} />
                </IDCard>
            </div>

            <div id="print-container" style={{ display: "none" }}>
                <IDCard ref={printBackRef}>
                    <CardBack />
                </IDCard>
            </div>
              </div>
    );
};

export default ViewCard;
