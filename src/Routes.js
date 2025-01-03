import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { AccountView, DashboardView, LoginView, NotFoundView, ProfileView, StageOneView, StageTwoView, FinalStageView, ManualView } from "./pages";
import PrivateRoute from "./HOC/RouteWithLayout/PrivateRoute";
import NormalRoute from "./HOC/RouteWithLayout/NormalRoute";
import MainLayout from "./layout/MainLayout";
import NormalLayout from "./layout/NormalLayout";
import CardManagement from "./pages/card-management";
import ViewCard from "./pages/card-management/ViewCardInformation";
import CardReportPage from "./pages/card-management/CardReportPage";
import Cashier from "./pages/card-management/Cashier";

const AppRoutes = () => {
    const routes = useRoutes([
        { path: "/", element: <Navigate to="/dashboard" /> },
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
            path: "/card-management",
            element: <PrivateRoute layout={MainLayout} />,
            children: [
                { path: "", element: <CardManagement /> },
                { path: ":cardId", element: <ViewCard /> },
            ],
        },
        {
            path: "/cashier",
            element: <PrivateRoute layout={MainLayout} />,
            children: [{ path: "", element: <Cashier /> }],
        },
        {
            path: "/card-report",
            element: <PrivateRoute layout={MainLayout} />,
            children: [{ path: "", element: <CardReportPage /> }],
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
