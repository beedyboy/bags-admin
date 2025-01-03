import React, { useRef } from "react";
import { CardActivityTypeLabels } from "../../shared/card";
import { Invoice } from "./Invoice";
import { useReactToPrint } from "react-to-print";
import useCardStore from "../../stores/CardStore";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export const InvoicePreview = () => {
    const { setTransactionPreview, isPreviewModalOpen, transactionPreview: data } = useCardStore();

    const printRef = useRef();

    const handlePrintInvoice = useReactToPrint({
        documentTitle: "Invoice",
        contentRef: printRef,
        onAfterPrint: () => {
            window.location.reload();
        },
    });

    const transaction = data.transaction;
    const cardDetails = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        barcode: data?.barcode,
    };

    const toggleModal = () => {
        setTransactionPreview();
        window.location.reload();
    };

    return (
        <Dialog
            header="Transaction Preview"
            visible={isPreviewModalOpen}
            onHide={toggleModal}
            footer={
                <div className="p-d-flex p-jc-end">
                    <Button label="Close" icon="pi pi-times" onClick={toggleModal} className="p-button-text p-mr-2" />
                    <Button label="Print Receipt" icon="pi pi-check" onClick={handlePrintInvoice} className="p-button-primary" />
                </div>
            }
            style={{ width: "400px" }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    maxWidth: "300px",
                    margin: "0 auto",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
            >
                {/* Company Info */}
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <strong style={{ fontSize: "14px" }}>Bags, Footwears & More</strong>
                    <div style={{ fontSize: "10px", marginTop: "5px" }}>
                        Shekinah Plaza, 23 Ajao Road, Off Adeniyi Jones,
                        <br />
                        Ikeja, Lagos
                        <br />
                        08181575752
                        <br />
                        info@bagswarehouseng.com
                    </div>
                </div>

                <hr style={{ width: "100%", margin: "10px 0" }} />

                {/* Receipt Title */}
                <div style={{ textAlign: "center", fontSize: "16px", marginBottom: "10px" }}>
                    <strong>Receipt</strong>
                </div>

                <hr style={{ width: "100%", margin: "10px 0" }} />

                {/* Customer Details */}
                <div style={{ width: "100%" }}>
                    <p>
                        <strong>Name:</strong> {`${cardDetails?.firstName} ${cardDetails?.lastName}`}
                    </p>
                    <p>
                        <strong>Reference:</strong> {cardDetails?.barcode}
                    </p>
                    <p>
                        <strong>Transaction Type:</strong> {CardActivityTypeLabels[transaction?.activity_type]}
                    </p>
                    <p>
                        <strong>Amount:</strong> ₦{transaction?.amount.toLocaleString()}
                    </p>
                    <p>
                        <strong>Date:</strong> {new Date(transaction?.timestamp).toLocaleString()}
                    </p>
                </div>

                <hr style={{ width: "100%", margin: "10px 0" }} />

                {/* Footer */}
                <div style={{ textAlign: "center", fontSize: "10px", marginTop: "10px" }}>
                    <p>Thank you for your patronage!</p>
                </div>

                {/* Print Button */}
                {/* <button
                onClick={handlePrintInvoice}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                }}
            >
                Print Receipt
            </button> */}

                {/* Hidden Print Content */}
                <div style={{ display: "none" }}>{transaction && cardDetails && <Invoice ref={printRef} cardDetails={cardDetails} transaction={transaction} />}</div>
            </div>
        </Dialog>
    );
};
