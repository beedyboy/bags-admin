import React from "react";
import { Route, Redirect } from "react-router-dom"; 
import Utils from '../../shared/localStorage';

const PrivateRoute = (props) => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(matchProps) =>
        Utils.get("admin_token") ? (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        ) : (
          <Redirect to={{ pathname: "/auth/login", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
