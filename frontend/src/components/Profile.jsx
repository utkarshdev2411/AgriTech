import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Profile() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate()
  return (
    <>
      <div className="flex justify-center">
        <div className="flex justify-center items-center bg-gray-200 shadow-2xl flex-col border border-[#242535] rounded-lg m-4 w-full py-8">
          <div className="flex items-center gap-2 ">
            <img
              src={userInfo.avatar}
              alt="avatar"
              className="w-20 h-20 border border-[#3c3e57] rounded-full overflow-hidden"
            />
            <div>
              <h2 className="text-xl">{userInfo.username}</h2>
              <h2 className="text">{userInfo.fullname}</h2>
            </div>
          </div>
          {userInfo.bio && (
            <div className="w-[75%] max-w-2xl text-center py-3">
              {userInfo.bio}
            </div>
          )}
          <div className="flex gap-2 py- text-2xl">
            {userInfo.links?.youtube && (
              <a target="_blank" href={userInfo.links.youtube}>
                <i className="fa-brands fa-youtube"></i>
              </a>
            )}
            {userInfo.links?.facebook && (
              <a target="_blank" href={userInfo.links.facebook}>
                <i className="fa-brands fa-facebook"></i>
              </a>
            )}
            {userInfo.links?.instagram && (
              <a target="_blank" href={userInfo.links.instagram}>
                <i className="fa-brands fa-instagram"></i>
              </a>
            )}
            {userInfo.links?.twitter && (
              <a target="_blank" href={userInfo.links.twitter}>
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            )}
            {userInfo.links?.other && (
              <a target="_blank" href={userInfo.links.other}>
                <i className="fa-solid fa-globe"></i>
              </a>
            )}
          </div>
            <div className="mt-2">

          <button
            type="submit"
            className="px-4 rounded-md py-2 bg-slate-800 text-white font-semibold"
            onClick={() => navigate('/editprofile')}
            >
            <i className="fa-solid fa-pen-to-square mr-2"></i>
            Edit Profile
          </button>
            </div>
        </div>
      </div>
    </>
  );
}

export { Profile };
