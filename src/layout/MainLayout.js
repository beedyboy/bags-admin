import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { AppFooter } from "../AppFooter";
import { AppProfile } from "../AppProfile";
import { AppMenu } from "../AppMenu";
import { AppTopbar } from "../AppTopbar";
const MainLayout = (props) => {
  const { children } = props;

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
      ? "assets/layout/images/logo.svg"
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
            {/* <img alt="Logo" src={logo} /> */}
          </div>
          <AppProfile />
          <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
        </div>
      </CSSTransition>

      <div className="layout-main">{children}</div>

      <AppFooter />
    </div>
  );
};

export default MainLayout;