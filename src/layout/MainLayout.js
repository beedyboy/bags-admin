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
  const [inputStyle] = useState("outlined"); 
  const [sidebarActive, setSidebarActive] = useState(true);
  const sidebar = useRef();

  const history = useHistory();

  let menuClick = false;

  useEffect(() => {
    if (sidebarActive) {
      addClass(document.body, "body-overflow-hidden");
    } else {
      removeClass(document.body, "body-overflow-hidden");
    }
  }, [sidebarActive]);
 
  

  const onWrapperClick = (event) => {
    if (!menuClick && layoutMode === "overlay") {
      setSidebarActive(false);
    }
    menuClick = false;
  };

  const onToggleMenu = (event) => {
    menuClick = true;

    setSidebarActive((prevState) => !prevState);

    event.preventDefault();
  };

  const onSidebarClick = () => {
    menuClick = true;
  };

  const onMenuItemClick = (event) => {
    if (!event.item.items && layoutMode === "overlay") {
      setSidebarActive(false);
    }
  };

  const menu = [
    { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
    { label: "Brand", icon: "pi pi-fw pi-briefcase", to: "/brands" },
    { label: "Sub Category", icon: "pi pi-fw pi-sitemap", to: "/subcategory" },
    { label: "Staff", icon: "pi pi-fw pi-users", to: "/staffs" },
    { label: "Product", icon: "pi pi-fw pi-book", to: "/products" },
    {
      label: "Reconcillation",
      icon: "pi pi-fw pi-dollar",
      items: [
        {
          label: "Stage One",
          icon: "pi pi-fw pi-check-square",
          to: "/stage-one",
        },
        {
          label: "Stage Two",
          icon: "pi pi-fw pi-check-square",
          to: "/stage-two",
        },
        {
          label: "Final Stage",
          icon: "pi pi-fw pi-check-square",
          to: "/final-stage/default",
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

  const isSidebarVisible = () => {
    return sidebarActive;
  };
 
  const wrapperClass = classNames("layout-wrapper", {
    "layout-overlay": layoutMode === "overlay",
    "layout-static": layoutMode === "static",
    "layout-active": sidebarActive,
    "p-input-filled": inputStyle === "filled", 
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
