import React from "react";
import { HashRouter as Router, Switch, Redirect } from "react-router-dom";
import {
  AccountView,
  BrandView,
  DashboardView,
  LoginView,
  NotFoundView,
  ProductView,
  StageOneView,
  StageTwoView,
  SubCategoryView,
} from "./pages";
import { PrivateRoute, NormalRoute } from "./HOC";
import MainLayout from "./layout/MainLayout";
import NormalLayout from "./layout/NormalLayout";
import Utils from "./shared/localStorage";

const Routes = () => {
  const loggedIn = Utils.get("admin_token") === "" ? false : true;
  let acl;
  let  
    reconUpload,
    reconOne,
    reconTwo;
  if (loggedIn === true) {
    console.log({ loggedIn });
    const obj = Utils.get("acl");
    if (obj && obj !== "") {
      // console.log({obj})
      acl = JSON.parse(obj); 
    }
  
  }
//  console.log({reconOne})
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
        <PrivateRoute
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      /> 
      
      <PrivateRoute
        component={ProductView}
        exact
        layout={MainLayout}
        path="/products"
      />
        <PrivateRoute
          component={StageOneView}
          exact
          layout={MainLayout}
          path="/stage-one" 
        />
        <PrivateRoute
          component={StageTwoView}
          exact
          layout={MainLayout}
          path="/stage-two" 
        />
        <PrivateRoute
          component={AccountView}
          exact
          layout={MainLayout}
          path="/staffs"
        />
        <PrivateRoute
          component={SubCategoryView}
          exact
          layout={MainLayout}
          path="/subcategory"
        />
     
          {/*<PrivateRoute
        component={ProfileView}
        exact
        layout={MainLayout}
        path="/profile"
      /> 
      <PrivateRoute
        component={StaffDetails}
        exact
        layout={MainLayout}
        path="/staff/:id/view"
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
     */} 
     <NormalRoute
        component={NotFoundView}
        exact
        layout={NormalLayout}
        path="/not-found"
      /> 
        <Redirect to="/not-found" />
      </Switch>
    </Router>
  );
};
export default Routes;
