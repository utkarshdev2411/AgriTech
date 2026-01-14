import React from "react";
import {Profile as ProfileComponent} from '../../components/Profile'
import Logout from "../../components/Logout";

function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <ProfileComponent/>
      </div>
    </div>
  );
}

export default Profile;
