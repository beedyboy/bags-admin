import React, { useState } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import Utils from "./shared/localStorage";

export const AppProfile = () => {
  const [expanded, setExpanded] = useState(false);

  const onClick = (event) => {
    setExpanded((prevState) => !prevState);
    event.preventDefault();
  };

  const user = Utils.get("name") ?? "guest";

  return (
    <div className="layout-profile">
      <div>
        <img src="assets/layout/images/profile.png" alt="Profile" />
      </div>
      <button className="p-link layout-profile-link" onClick={onClick}>
        <span className="username">{user}</span>
        <i className="pi pi-fw pi-cog" />
      </button>
      <CSSTransition
        classNames="p-toggleable-content"
        timeout={{ enter: 1000, exit: 450 }}
        in={expanded}
        unmountOnExit
      >
        <ul className={classNames({ "layout-profile-expanded": expanded })}>
          <li>
          <Link to="/profile">
            <button type="button" className="p-link">
              <i className="pi pi-fw pi-user" />
              <span>Account</span>
            </button>
            </Link>
          </li>
          {/* <li>
            <button type="button" className="p-link">
              <i className="pi pi-fw pi-inbox" />
              <span>Notifications</span>
              <span className="menuitem-badge">2</span>
            </button>
          </li> */}
          <li>
            <button type="button" className="p-link"
                onClick={(e) => Utils.logout()}>
              <i
                className="pi pi-fw pi-power-off"
              />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </CSSTransition>
    </div>
  );
};
