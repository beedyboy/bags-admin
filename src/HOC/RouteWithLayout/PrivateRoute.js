import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Utils from '../../shared/localStorage';

const PrivateRoute = ({ layout: Layout }) => {
  const isAuthenticated = Utils.isAuthenticated();
  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/auth/login" />
  );
};

export default PrivateRoute;
