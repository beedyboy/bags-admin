import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Route, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import { AppMenu } from "./AppMenu";
import { AppProfile } from "./AppProfile";

import { Dashboard } from "./components/Dashboard";
import { ButtonDemo } from "./components/ButtonDemo";
import { ChartDemo } from "./components/ChartDemo";
import { FileDemo } from "./components/FileDemo";
import { ListDemo } from "./components/ListDemo";
import { MenuDemo } from "./components/MenuDemo";
import { MessagesDemo } from "./components/MessagesDemo";
import { MiscDemo } from "./components/MiscDemo";
import { OverlayDemo } from "./components/OverlayDemo";
import { PanelDemo } from "./components/PanelDemo";
import { TableDemo } from "./components/TableDemo";
import { TreeDemo } from "./components/TreeDemo";
import { InvalidStateDemo } from "./components/InvalidStateDemo";

import { Calendar } from "./pages/Calendar";
import { Crud } from "./pages/Crud";
import { EmptyPage } from "./pages/EmptyPage";

import { DisplayDemo } from "./utilities/DisplayDemo";
import { ElevationDemo } from "./utilities/ElevationDemo";
import { FlexBoxDemo } from "./utilities/FlexBoxDemo";
import { GridDemo } from "./utilities/GridDemo";
import { IconsDemo } from "./utilities/IconsDemo";
import { SpacingDemo } from "./utilities/SpacingDemo";
import { TextDemo } from "./utilities/TextDemo";
import { TypographyDemo } from "./utilities/TypographyDemo";
import { TimelineDemo } from "./utilities/TimelineDemo";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "./layout/flags/flags.css";
import "./layout/layout.scss";
import "./App.scss";
import Brand from "./pages/Brand";
import SubCategory from "./pages/SubCategory";
import Account from "./pages/Account";
import StageOne from "./pages/reconcillations/StageOne";
import StageTwo from "./pages/reconcillations/StageTwo";

const App = () => {
  const [layoutMode] = useState("static");
  const [layoutColorMode] = useState("dark");
  const [staticMenuInactive, setStaticMenuInactive] = useState(false);
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [inputStyle] = useState("outlined");
  const [ripple] = useState(false);
  const sidebar = useRef();

  const history = useHistory();

  let menuClick = false;

  useEffect(() => {
    if (mobileMenuActive) {
      addClass(document.body, "body-overflow-hidden");
    } else {
      removeClass(document.body, "body-overflow-hidden");
    }
  }, [mobileMenuActive]);

  const onWrapperClick = (event) => {
    if (!menuClick) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }
    menuClick = false;
  };

  const onToggleMenu = (event) => {
    menuClick = true;

    if (isDesktop()) {
      if (layoutMode === "overlay") {
        setOverlayMenuActive((prevState) => !prevState);
      } else if (layoutMode === "static") {
        setStaticMenuInactive((prevState) => !prevState);
      }
    } else {
      setMobileMenuActive((prevState) => !prevState);
    }
    event.preventDefault();
  };

  const onSidebarClick = () => {
    menuClick = true;
  };

  const onMenuItemClick = (event) => {
    if (!event.item.items) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }
  };

  const menu = [
    { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
    { label: "Brand", icon: "pi pi-fw pi-briefcase", to: "/brands" },
    { label: "Sub Category", icon: "pi pi-fw pi-sitemap", to: "/subcategory" },
    { label: "Staff", icon: "pi pi-fw pi-users", to: "/staffs" },
    {
      label: "Reconcillation",
      icon: "pi pi-fw pi-dollar",
      items: [
        { label: "Stage One", icon: "pi pi-fw pi-id-card", to: "/stage-one" },
        {
          label: "Stage Two",
          icon: "pi pi-fw pi-check-square",
          to: "/stage-two",
        },
      ],
    },
  ];

  const addClass = (element, className) => {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  };

  const removeClass = (element, className) => {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
  };

  const isDesktop = () => {
    return window.innerWidth > 1024;
  };

  const isSidebarVisible = () => {
    if (isDesktop()) {
      if (layoutMode === "static") return !staticMenuInactive;
      else if (layoutMode === "overlay") return overlayMenuActive;
      else return true;
    }

    return true;
  };

  const logo =
    layoutColorMode === "dark"
      ? "assets/layout/images/logo-white.svg"
      : "assets/layout/images/logo.svg";

  const wrapperClass = classNames("layout-wrapper", {
    "layout-overlay": layoutMode === "overlay",
    "layout-static": layoutMode === "static",
    "layout-static-sidebar-inactive":
      staticMenuInactive && layoutMode === "static",
    "layout-overlay-sidebar-active":
      overlayMenuActive && layoutMode === "overlay",
    "layout-mobile-sidebar-active": mobileMenuActive,
    "p-input-filled": inputStyle === "filled",
    "p-ripple-disabled": ripple === false,
  });

  const sidebarClassName = classNames("layout-sidebar", {
    "layout-sidebar-dark": layoutColorMode === "dark",
    "layout-sidebar-light": layoutColorMode === "light",
  });

  return (
    <div className={wrapperClass} onClick={onWrapperClick}>
      <AppTopbar onToggleMenu={onToggleMenu} />

      <CSSTransition
        classNames="layout-sidebar"
        timeout={{ enter: 200, exit: 200 }}
        in={isSidebarVisible()}
        unmountOnExit
      >
        <div
          ref={sidebar}
          className={sidebarClassName}
          onClick={onSidebarClick}
        >
          <div
            className="layout-logo"
            style={{ cursor: "pointer" }}
            onClick={() => history.push("/")}
          >
            <img alt="Logo" src={logo} />
          </div>
          <AppProfile />
          <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
        </div>
      </CSSTransition>

      {/* <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} /> */}

      <div className="layout-main">
        <Route path="/" exact component={Dashboard} />
        <Route path="/brands" exact component={Brand} />
        <Route path="/subcategory" exact component={SubCategory} />
        <Route path="/staffs" component={Account} />
        <Route path="/stage-one" component={StageOne} />
        <Route path="/stage-two" component={StageTwo} />
        <Route path="/invalidstate" component={InvalidStateDemo} />
        <Route path="/button" component={ButtonDemo} />
        <Route path="/table" component={TableDemo} />
        <Route path="/list" component={ListDemo} />
        <Route path="/tree" component={TreeDemo} />
        <Route path="/panel" component={PanelDemo} />
        <Route path="/overlay" component={OverlayDemo} />
        <Route path="/menu" component={MenuDemo} />
        <Route path="/messages" component={MessagesDemo} />
        <Route path="/file" component={FileDemo} />
        <Route path="/chart" component={ChartDemo} />
        <Route path="/misc" component={MiscDemo} />
        <Route path="/display" component={DisplayDemo} />
        <Route path="/elevation" component={ElevationDemo} />
        <Route path="/flexbox" component={FlexBoxDemo} />
        <Route path="/icons" component={IconsDemo} />
        <Route path="/grid" component={GridDemo} />
        <Route path="/spacing" component={SpacingDemo} />
        <Route path="/typography" component={TypographyDemo} />
        <Route path="/text" component={TextDemo} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/timeline" component={TimelineDemo} />
        <Route path="/crud" component={Crud} />
        <Route path="/empty" component={EmptyPage} />
      </div>

      <AppFooter />
    </div>
  );
};

export default App;
