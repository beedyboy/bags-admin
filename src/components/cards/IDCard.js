import React from "react";
import "./IDCard.css";

const IDCard = React.forwardRef(({ children }, ref) => {
    return (
        <div className="id-card-container" ref={ref}>
            {children}
        </div>
    );
});

export default IDCard;
