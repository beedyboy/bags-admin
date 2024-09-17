import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import {
  AccountView,
  BrandView,
  DashboardView,
  LoginView,
  NotFoundView,
  ProfileView,
  StageOneView,
  StageTwoView,
  FinalStageView,
  SubCategoryView,
  ManualView,
} from "./pages";
import PrivateRoute from "./HOC/RouteWithLayout/PrivateRoute";
import NormalRoute from "./HOC/RouteWithLayout/NormalRoute";
import MainLayout from './layout/MainLayout';
import NormalLayout from './layout/NormalLayout';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Navigate to="/dashboard" /> },
    // {
    //   path: "/brands",
    //   element: <PrivateRoute layout={MainLayout} />,
    //   children: [{ path: "", element: <BrandView /> }],
    // },
    {
      path: "/dashboard",
      element: <PrivateRoute layout={MainLayout} />,
      children: [{ path: "", element: <DashboardView /> }],
    },
    {
      path: "/manual",
      element: <PrivateRoute layout={MainLayout} />,
      children: [{ path: "", element: <ManualView /> }],
    },
    // {
    //   path: "/products",
    //   element: <PrivateRoute layout={MainLayout} />,
    //   children: [{ path: "", element: <ProductView /> }],
    // },
    {
      path: "/stage-one",
      element: <PrivateRoute layout={MainLayout} />,
      children: [{ path: "", element: <StageOneView /> }],
    },
    {
      path: "/stage-two",
      element: <PrivateRoute layout={MainLayout} />,
      children: [{ path: "", element: <StageTwoView /> }],
    },
    {
      path: "/final-stage/:slug",
      element: <PrivateRoute layout={MainLayout} />,
      children: [{ path: "", element: <FinalStageView /> }],
    },
    {
      path: "/staffs",
      element: <PrivateRoute layout={MainLayout} />,
      children: [{ path: "", element: <AccountView /> }],
    },
    // {
    //   path: "/subcategory",
    //   element: <PrivateRoute layout={MainLayout} />,
    //   children: [{ path: "", element: <SubCategoryView /> }],
    // },
    {
      path: "/profile",
      element: <PrivateRoute layout={MainLayout} />,
      children: [{ path: "", element: <ProfileView /> }],
    },
    {
      path: "/auth/login",
      element: <NormalRoute layout={NormalLayout} />,
      children: [{ path: "", element: <LoginView /> }],
    },
    {
      path: "/not-found",
      element: <NormalRoute layout={NormalLayout} />,
      children: [{ path: "", element: <NotFoundView /> }],
    },
    { path: "*", element: <Navigate to="/not-found" /> },
  ]);

  return routes;
};

export default AppRoutes;
