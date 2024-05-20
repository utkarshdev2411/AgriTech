import React from "react";
import {Profile as ProfileComponent} from '../../components/Profile'
import Logout from "../../components/Logout";

function Profile() {
  return (
    <div className="max-w-2xl m-auto">
      
      <Logout/>
      <ProfileComponent/>
    </div>
  );
}

export default Profile;
