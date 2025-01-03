import React from "react";
import Barcode from "react-barcode";

const CardFront = ({ barcodeValue, cardHolderName, referenceNumber }) => {
    return (
        <div className="id-card-front print-page">
            <h1 className="loyalty-card-title">Gift Card</h1>

            <img src="/assets/layout/images/products.png" alt="products" className="product-image" />
            <div className="id-card-barcode">
                <Barcode
                    value={barcodeValue}
                    background="#f8f8f8"
                    // lineColor="pink" /* Barcode line color */
                    width={1.5} /* Line thickness */
                    height={30}
                />
            </div>
        </div>
    );
};

export default CardFront;
