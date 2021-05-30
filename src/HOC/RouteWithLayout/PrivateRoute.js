import React from "react";
import { Route, Redirect } from "react-router-dom"; 
import Utils from '../../shared/localStorage';

const PrivateRoute = (props) => {
  // console.log({props})
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(matchProps) =>
        Utils.get("admin_token") ? (
          <Layout>
            <Component {...matchProps} {...rest} />
          </Layout>
        ) : (
          <Redirect to={{ pathname: "/auth/login", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
