import React, { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { Invoice } from "./Invoice";

const TransactionActions = ({ rowData, handleConfirm, acceptFundRequest, rejectFundRequest, cardDetails }) => {
    const menuRef = useRef(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Reference for print action
    const printRef = useRef();

    // Handle print functionality
    const handlePrintInvoice = useReactToPrint({
        documentTitle: "Transaction Invoice",
        contentRef: printRef,
    });

    const handlePrint = () => {
        setSelectedTransaction(rowData); // Set the selected transaction
        setTimeout(() => {
            if (rowData) {
                handlePrintInvoice(); // Trigger the print
            } else {
                console.error("No valid transaction or card details.");
            }
        }, 100); // Allow state update to complete
    };

    // Create menu items
    const menuItems = [
        ...(rowData.activity_type === "fund_request" && rowData.status === "pending"
            ? [
                  {
                      label: "Accept",
                      icon: "pi pi-check",
                      command: () =>
                          handleConfirm(
                              () => acceptFundRequest(rowData.id),
                              `Are you sure you want to accept this fund request for ₦${rowData.amount.toLocaleString()}?`
                          ),
                  },
                  {
                      label: "Decline",
                      icon: "pi pi-times",
                      command: () =>
                          handleConfirm(
                              () => rejectFundRequest(rowData.id),
                              `Are you sure you want to decline this fund request for ₦${rowData.amount.toLocaleString()}?`
                          ),
                  },
              ]
            : []),
        {
            label: "Print Invoice",
            icon: "pi pi-print",
            command: handlePrint, // Call print function directly
        },
    ];

    return (
        <>
            <Menu model={menuItems} popup ref={menuRef} />
            <Button
                label="Options"
                icon="pi pi-ellipsis-v"
                className="p-button-text"
                onClick={(e) => {
                    console.log("Opening menu for row ID:", rowData.id);
                    menuRef.current.toggle(e);
                }}
            />

            {/* Hidden Invoice for Print */}
            <div style={{ display: "none" }}>
                {selectedTransaction && rowData && (
                    <Invoice ref={printRef} cardDetails={cardDetails} transaction={selectedTransaction} />
                )}
            </div>
        </>
    );
};

export default TransactionActions;
