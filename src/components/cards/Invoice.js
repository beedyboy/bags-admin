import React from "react";
import { CardActivityTypeLabels } from "../../shared/card";

export const Invoice = React.forwardRef(({ cardDetails, transaction }, ref) => (
    <div
        ref={ref}
        style={{
            width: "58mm",
            padding: "10px",
            fontFamily: "monospace",
            fontSize: "10px",
            lineHeight: "1.2",
            textAlign: "left",
        }}
    >
        {/* Company Info */}
        <div style={{ textAlign: "center", marginBottom: "5px" }}>
            <strong>Bags, Footwears & More</strong>
        </div>
        <div style={{ textAlign: "center", fontSize: "9px" }}>
            Shekinah Plaza, 23 Ajao Road, Off Adeniyi Jones,
            <br />
            Ikeja, Lagos
            <br />
            08181575752
            <br />
            info@bagswarehouseng.com
        </div>

        <hr style={{ margin: "5px 0" }} />

        {/* Receipt Title */}
        <div style={{ textAlign: "center", fontSize: "12px", margin: "5px 0" }}>
            <strong>Receipt</strong>
        </div>

        <hr style={{ margin: "5px 0" }} />

        {/* Customer Details */}
        <p style={{ margin: "5px 0" }}>
            <strong>Name:</strong> {`${cardDetails?.firstName} ${cardDetails?.lastName}`}
        </p>
        <p style={{ margin: "5px 0" }}>
            <strong>Reference:</strong> {cardDetails?.barcode}
        </p>

        {/* Transaction Info */}
        <p style={{ margin: "5px 0" }}>
            <strong>Transaction Type:</strong> {CardActivityTypeLabels[transaction?.activity_type]}
        </p>
        <p style={{ margin: "5px 0" }}>
            <strong>Amount:</strong> ₦{transaction?.amount.toLocaleString()}
        </p>
        <p style={{ margin: "5px 0" }}>
            <strong>Date:</strong> {new Date(transaction?.timestamp).toLocaleString()}
        </p>

        <hr style={{ margin: "5px 0" }} />

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: "9px", marginTop: "10px" }}>
            <p>Thank you for your patronage!</p>
        </div>
    </div>
));
