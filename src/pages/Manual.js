import React from "react";
import Iframe from "react-iframe";

function Manual(props) {
  return (
    <>
      <Iframe
        url="/assets/docs/manual.pdf"
        height="500px"
        width="100%"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
      />
    </>
  );
}

export default Manual;
