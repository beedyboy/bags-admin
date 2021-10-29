import React, { Fragment } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css"; 
import "./layout/flags/flags.css";
import "./layout/layout.scss";
import "./App.scss";
import "./styles.css";

const App = () => {
  return (
    <Fragment>
      <Router>
        <Routes />
      </Router>
    </Fragment>
  );
};

export default App;
