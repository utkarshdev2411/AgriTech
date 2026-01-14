import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaGlobe, FaEnvelope, FaUserCircle } from "react-icons/fa";

function Profile() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  
  // Default avatar URL
  const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo?.fullname || userInfo?.username || "User") + "&size=200&background=22c55e&color=ffffff&bold=true";

  return (
    <>
      <div className="flex justify-center">
        {/* Main Profile Card */}
        <div className="relative w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Background with Gradient */}
          <div className="h-32 md:h-40 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-6 md:px-8 pb-8">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative -mt-16 md:-mt-20">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-75"></div>
                <img
                  src={userInfo?.avatar || defaultAvatar}
                  alt={userInfo?.fullname || "User avatar"}
                  className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-lg"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mt-4">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                {userInfo?.fullname || "Anonymous User"}
              </h1>
              <p className="text-green-600 font-medium mb-1">@{userInfo?.username || "user"}</p>
              {userInfo?.email && (
                <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
                  <FaEnvelope className="text-green-500" />
                  <span>{userInfo.email}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {userInfo?.bio && (
              <div className="mt-6 max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-100">
                  <p className="text-slate-700 text-center leading-relaxed">{userInfo.bio}</p>
                </div>
              </div>
            )}

            {/* Social Links */}
            {(userInfo?.links?.youtube || userInfo?.links?.facebook || userInfo?.links?.instagram || userInfo?.links?.twitter || userInfo?.links?.other) && (
              <div className="mt-6">
                <h3 className="text-center text-sm font-semibold text-slate-600 mb-3">Connect With Me</h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {userInfo.links?.youtube && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={userInfo.links.youtube}
                      className="group flex items-center justify-center w-12 h-12 rounded-full bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                    >
                      <FaYoutube className="text-xl" />
                    </a>
                  )}
                  {userInfo.links?.facebook && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={userInfo.links.facebook}
                      className="group flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                    >
                      <FaFacebook className="text-xl" />
                    </a>
                  )}
                  {userInfo.links?.instagram && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={userInfo.links.instagram}
                      className="group flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-pink-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                    >
                      <FaInstagram className="text-xl" />
                    </a>
                  )}
                  {userInfo.links?.twitter && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={userInfo.links.twitter}
                      className="group flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                    >
                      <FaTwitter className="text-xl" />
                    </a>
                  )}
                  {userInfo.links?.other && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={userInfo.links.other}
                      className="group flex items-center justify-center w-12 h-12 rounded-full bg-green-50 hover:bg-green-500 text-green-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                    >
                      <FaGlobe className="text-xl" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Edit Profile Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="group flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={() => navigate('/editprofile')}
              >
                <FaEdit className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Profile };
