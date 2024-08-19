/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
} from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Divider } from "primereact/divider";
import Loader from "../shared/Loader";
import ProfileDetails from "../components/profile/ProfileDetails";
import { useGetProfile } from "../hooks/account";
import MyPermissions from "../components/profile/MyPermissions";
import useAccountStore from "../stores/AccountStore";

const Profile = () => {

  const { isLoading } = useGetProfile();

  const { myProfile } = useAccountStore();
 

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
            {isLoading ? (
              <Loader />
            ) : (
              <ProfileDetails />
            )}
          </TabPanel>
          <TabPanel header="Access">
            {isLoading ? (
              <Loader />
            ) : (
              <Fragment>
                <Divider align="center" type="dashed">
                  <span className="p-tag">Roles</span>
                </Divider>
                {!isLoading ? <MyPermissions data={myProfile.roles} /> : "Fetching"}
              </Fragment>
            )}
          </TabPanel>
        </TabView>
      </div>
    </Fragment>
  );
}

export default Profile;
