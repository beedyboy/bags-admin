/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { observer } from "mobx-react-lite";
import AccountStore from "../stores/AccountStore";
import { v4 as uuidv4 } from 'uuid';  // Updated import
import Loader from "../shared/Loader";
import { toJS } from "mobx";
import ProfileDetails from "../components/profile/ProfileDetails";

const Profile = () => {
  const toast = useRef(null);
  const store = useContext(AccountStore);
  const {
    getProfile,
    myProfile,
    profileLoading,
    updateProfile,
    resetProperty: reset,
    error,
    action,
    message,
    sending,
  } = store;
  const [loaded, setLoaded] = useState(false);
  let access = toJS(myProfile?.roles);
  
  // useEffect(() => {
  //   getProfile();
  // }, []);

  // useEffect(() => {
  //   const pf = Object.keys(myProfile);
  //   // console.log('roles',pf)
  //   if (pf.length > 0) {
  //     setLoaded(true);
  //   }
  // }, [myProfile]);
  
  // useEffect(() => {
  //   if (action === "updateProfile") {
  //     toast.current.show({
  //       severity: "success",
  //       summary: "Success Message",
  //       detail: message,
  //     });
  //   }
  //   return () => {
  //     reset("saved", false);
  //     reset("message", "");
  //     reset("action", "");
  //   };
  // }, [action]);

  // useEffect(() => {
  //   if (error === true && action === "profileUpdateError") {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error Message",
  //       detail: message,
  //     });
  //   }
  //   return () => {
  //     reset("error", false);
  //     reset("message", "");
  //     reset("action", "");
  //   };
  // }, [error, action]);

  const stretchAccess = (item) => {
    var result = [];
    for (var property in item) {
      result.push(
        <Button
          key={uuidv4()}  // Updated key generation
          type="button"
          label={
            item[property] === true ? `Can ${property} ` : `Cannot ${property} `
          }
          icon={`pi ${item[property] === true ? " pi-check" : " pi-times"}`}
          className={`p-m-2 ${item[property] === true ? " p-button-success" : " p-button-danger"
            }`}
        ></Button>
      );
    }
    return <>{result}</>;
  };

  const renderRoles = () => {
    if (access === undefined || access === null)
      return null;

    const keys = Object.keys(access);
    if (keys.length === 0 || keys === undefined || keys === null) {
      return null;
    }
    return (
      <ul>
        {keys.length > 0 &&
          keys.map((key, i) => {
            return (
              <Fragment key={i}>
                <li key={uuidv4()}> {key.toUpperCase()} </li>
                {stretchAccess(access[key])}
              </Fragment>
            );
          })}
      </ul>
    );
  };

  return (
    <Fragment>
      <section className="p-d-flex p-shadow-1 p-mt-1 p-pt-md-3 p-pt-2">
        <div className="p-d-flex p-flex-md-row p-jc-around p-ai-center w-100">
          <div className="p-d-flex  p-flex-md-row p-ai-center w-100">
            <div className="p-p-md-2">
              <img
                src="https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4.png"
                alt=""
                className=""
                id="profile"
              />
            </div>
            <div className="p-p-md-2 p-p-1" id="info">
              <h5>
                {myProfile?.firstname} {myProfile?.lastname}
              </h5>
              <div className="text-muted">{myProfile?.position} </div>
            </div>
          </div>

          <div className="p-d-flex p-flex-column w-100" id="info">
            <div className="p-p-md-1 text-muted">
              {" "}
              <span className="pi pi-fw pi-envelope bg-light p-p-1 "></span>{" "}
              {myProfile?.email}
            </div>
            <div className="p-p-md-1 p-pt-sm-1 text-muted">
              {" "}
              <span className="pi pi-fw pi-phone bg-light p-p-1 "></span>{" "}
              {myProfile?.phone}
            </div>
          </div>
          <div className="p-p-lg-2 p-p-1 p-mr-lg-4" id="blue-500">
          </div>
        </div>
      </section>
      <div className="pl-lg-5 pt-lg-2 pt-md-1">
        <TabView>
          <TabPanel header="User Profile">
            {profileLoading ? (
              <Loader />
            ) : (
              <ProfileDetails
                saveData={updateProfile}
                sending={sending}
                initial_data={myProfile}
              />
            )}
          </TabPanel>
          <TabPanel header="Access">
            {profileLoading ? (
              <Loader />
            ) : (
              <Fragment>
                <Divider align="center" type="dashed">
                  <span className="p-tag">Roles</span>
                </Divider>
                {loaded ? renderRoles() : "Fetching"}
              </Fragment>
            )}
          </TabPanel>
        </TabView>
      </div>
      <Toast ref={toast} position="top-right" />
    </Fragment>
  );
}

export default observer(Profile);
