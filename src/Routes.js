import React from "react";
import { HashRouter as Router, Switch, Redirect } from "react-router-dom"; 
import {
  BrandView, LoginView
} from "./pages";
import { PrivateRoute, NormalRoute } from "./HOC"; 
import MainLayout from "./layout/MainLayout";
import NormalLayout from './layout/NormalLayout';

const Routes = () => { 
  return (
     <Router>
    <Switch>
      <Redirect exact from="/" to="/dashboard" />
      <PrivateRoute
        component={BrandView}
        exact
        layout={MainLayout}
        path="/brands"
      />
      {/* <PrivateRoute
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <PrivateRoute
        component={LeaveApplicationView}
        exact
        layout={MainLayout}
        path="/vacations"
      />
      <PrivateRoute
        component={LeaveAppDetailsView}
        exact
        layout={MainLayout}
        path="/vacation-applications/:id/:user/:leave/:type"
      />
      <PrivateRoute
        component={LeaveAppManagerView}
        exact
        layout={MainLayout}
        path="/vacation-applications"
      />
      <PrivateRoute
        component={OnboardingView}
        exact
        layout={MainLayout}
        path="/onboarding"
      />
      <PrivateRoute
        component={ProfileView}
        exact
        layout={MainLayout}
        path="/profile"
      />
      <PrivateRoute
        component={StaffView}
        exact
        layout={MainLayout}
        path="/staff"
      />{" "}
      <PrivateRoute
        component={StaffDetails}
        exact
        layout={MainLayout}
        path="/staff/:id/view"
      />
      
      <PrivateRoute
        component={ProductView}
        exact
        layout={MainLayout}
        path="/product"
      />
      <PrivateRoute
        component={ProductDetailsView}
        exact
        layout={MainLayout}
        path="/product/:id"
      />
      <PrivateRoute
        component={AssetView}
        exact
        layout={MainLayout}
        path="/asset"
      />
      <PrivateRoute
        component={AssetDetails}
        exact
        layout={MainLayout}
        path="/asset/:id/view"
      />
      <PrivateRoute
        component={MaintenanceView}
        exact
        layout={MainLayout}
        path="/maintenance"
      />
      <PrivateRoute component={POSView} exact layout={MainLayout} path="/pos" />
      <PrivateRoute component={TicketView} layout={MainLayout} path="/ticket" />
      <PrivateRoute
        component={TicketAdminView}
        layout={MainLayout}
        path="/admin/ticket"
      />
      <PrivateRoute
        component={AdminTicketDetails}
        exact
        layout={MainLayout}
        path="/adminticket/view/:id"
      />
      <PrivateRoute component={ReportView} layout={MainLayout} path="/report" />
    */} 
     <NormalRoute
        component={LoginView}
        exact
        layout={NormalLayout}
        path="/auth/login"
      /> 
      {/* <NormalRoute
        component={ResetRequestView}
        exact
        layout={NormalLayout}
        path="/request-reset"
      />
      <NormalRoute
        component={ResetPasswordView}
        exact
        layout={NormalLayout}
        path="/reset-password/:token/:id"
      />
      <NormalRoute
        component={NotFoundView}
        exact
        layout={NormalLayout}
        path="/not-found"
      /> */}
      <Redirect to="/not-found" />
    </Switch>
 </Router>
  );
};
export default Routes;
