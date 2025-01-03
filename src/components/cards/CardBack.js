import React from "react";

const CardBack = () => {
    const companyDetails = {
        companyName: "BagsWarehouse.ng",
        address: "Shekinah Plaza, 23 Ajao Road, Off Adeniyi Jones, Ikeja, Lagos",
        phone: "+2348073176554",
        email: "helenmomerchant@gmail.com",
        logo: "/assets/layout/images/bags.jpeg",
        disclaimer: "Disclaimer: Bagswarehouseng will not be liable for the loss, damage or disclosure of the card numbers to third parties.",
    };

    return (
        <div className="id-card-back print-page">
            <img src={companyDetails.logo} alt={`${companyDetails.companyName} Logo`} className="company-logo" />
            <p>
                <strong>{companyDetails.companyName}</strong>
                <br />
                {companyDetails.address}
                <br />
                {companyDetails.phone}
            </p>
            <p className="text-white">
                {" "}
                <strong>{companyDetails.email} </strong>
            </p>
            <div className="disclaimer">{companyDetails.disclaimer}</div>
        </div>
    );
};

export default CardBack;
