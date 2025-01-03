import React, { useState, useEffect, useCallback } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ChargeCardModal from "../../components/cards/ChargeCardModal";
import useCardStore from "../../stores/CardStore";
import { useFetchCardByCode, useFetchCardTransactions } from "../../hooks/useCard";
import { CardActivityTypeLabels } from "../../shared/card";
import { getPermissions } from "../../helpers/permissions";
import NoAccess from "../../widgets/NoAccess";

const Cashier = () => {
    const { cashier } = getPermissions("card");
    const { toggleChargeCardModal } = useCardStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");

    const {
        data: cardDetails,
        isLoading: loadingCardDetails,
        error: cardError,
        refetch,
    } = useFetchCardByCode(submittedQuery, {
        enabled: false,
        staleTime: 0,
    });

    const { data: transactions, isLoading: loadingTransactions, error: transactionError } = useFetchCardTransactions(cardDetails?.id);

    const handleSearch = useCallback(() => {
        if (searchQuery.length < 15) {
            console.warn("Search query must be 15 characters long.");
            return;
        }
    
        setSubmittedQuery(searchQuery); // Update state for reference, but don't rely on it
        setSearchQuery(""); // Clear the search query
    
        // Call the API directly
        refetch({ queryKey: ["fetchCardByCode", searchQuery] });
    }, [searchQuery, refetch]);
    

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length === 15) {
                handleSearch();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [searchQuery, handleSearch]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    if (!cashier) {
        return <NoAccess page="cashier" />;
    }

    return (
        <div className="cashier-page" style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
            <h2>Cashier</h2>
            <div className="search-bar" style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
                <InputText value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter or Scan Barcode" style={{ flex: "1" }} />
                <Button label="Search" icon="pi pi-search" onClick={handleSearch} loading={loadingCardDetails} disabled={!searchQuery} />
            </div>

            {cardError && <div style={{ color: "red", marginBottom: "1rem" }}>{cardError.message || "Something went wrong"}</div>}

            {cardDetails && (
                <Card title="Card Details" style={{ textAlign: "left", padding: "1rem" }}>
                    <p>
                        <strong>Full Name:</strong> {`${cardDetails.firstName} ${cardDetails.lastName}`}
                    </p>
                    <p>
                        <strong>Barcode:</strong> {cardDetails.barcode}
                    </p>
                    <p>
                        <strong>Reference Number:</strong> {cardDetails.referenceNumber}
                    </p>
                    <p>
                        <strong>Current Balance:</strong> ₦{cardDetails.balance.toLocaleString()}
                    </p>
                    {cardDetails.status !== "active" && <p style={{ color: "red" }}>This card is not active and cannot be charged.</p>}
                    <Button label="Charge Card" icon="pi pi-upload" className="p-button-success" onClick={() => toggleChargeCardModal(cardDetails)} disabled={cardDetails.status !== "active"} />

                    <div style={{ marginTop: "1rem" }}>
                        <h3>Transaction History</h3>
                        {loadingTransactions && <p>Loading transactions...</p>}
                        {transactionError && <p style={{ color: "red" }}>{transactionError.message || "Failed to load transactions."}</p>}

                        <DataTable value={transactions} paginator rows={5}>
                            <Column field="timestamp" header="Date" body={(data) => new Date(data.timestamp).toLocaleString()} />
                            <Column field="amount" header="Amount" body={(data) => `₦${data.amount.toLocaleString()}`} />
                            <Column field="activity_type" header="Type" body={(data) => CardActivityTypeLabels[data.activity_type] || data.activity_type} />
                        </DataTable>
                    </div>
                </Card>
            )}

            <ChargeCardModal />
        </div>
    );
};

export default React.memo(Cashier);
