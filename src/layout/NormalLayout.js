import React from "react";

const NormalLayout = (props) => {
  const { children } = props;

  // console.log(props)
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default NormalLayout;
