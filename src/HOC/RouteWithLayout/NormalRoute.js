import React from "react";
import { Outlet } from "react-router-dom";

const NormalRoute = ({ layout: Layout }) => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default NormalRoute;
