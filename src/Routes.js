import React from "react";
import { HashRouter as Router, Switch, Redirect } from "react-router-dom";
import {
  AccountView,
  BrandView,
  DashboardView,
  LoginView,
  NotFoundView,
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
  let brandsAdd,
    brandsView,
    brandsDel,
    totalBrands,
    reconUpload,
    reconOne,
    reconTwo,
    reconReport,
    reconModify, 
    reconDel;
  if (loggedIn === true) {
    console.log({ loggedIn });
    const obj = Utils.get("acl");
    if (obj && obj !== "") {
      // console.log({obj})
      acl = JSON.parse(obj);
      // acl = obj;
    }
    brandsAdd = acl && acl.brands && acl.brands.add;
    brandsView = acl && acl.brands && acl.brands.view;
    brandsDel = acl && acl.brands && acl.brands.del;

    totalBrands = brandsAdd || brandsView || brandsDel;

    reconUpload = acl && (acl.reconcillation && acl.reconcillation.upload); 
    reconDel = acl && acl.reconcillation && acl.reconcillation.del;
    reconOne = acl && (acl.reconcillation && acl.reconcillation.approval_one);
    reconTwo = acl && (acl.reconcillation && acl.reconcillation.approval_two);
    reconReport = acl && acl.reconcillation && acl.reconcillation.report;
    reconModify = acl && acl.reconcillation && acl.reconcillation.modify;
  }
 console.log({reconOne})
  return (
    <Router>
      <Switch>
        <Redirect exact from="/" to="/dashboard" />
        <PrivateRoute
          component={BrandView}
          exact
          layout={MainLayout}
          path="/brands"
          pageAccess={totalBrands}
          canAdd={brandsAdd}
          canView={brandsView}
          canDel={brandsDel}
        />
        <PrivateRoute
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      /> 
        <PrivateRoute
          component={StageOneView}
          exact
          layout={MainLayout}
          path="/stage-one"
          reconUpload={reconUpload}
          reconOne={reconOne}
        />
        <PrivateRoute
          component={StageTwoView}
          exact
          layout={MainLayout}
          path="/stage-two"
          reconTwo={reconTwo}
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
