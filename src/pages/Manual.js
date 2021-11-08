import React from "react";
import Iframe from "react-iframe";
import Helmet from 'react-helmet';

function Manual(props) {
  return (
    <>
    <Helmet>
      <title>User Manual</title>
    </Helmet>
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
