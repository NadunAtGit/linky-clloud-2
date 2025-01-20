import React from "react";
import { FaUser, FaEnvelope, FaLink } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for internal navigation

const UserDetailsCard = ({ userInfo }) => {
  if (!userInfo) return null;

  return (
    userInfo && (
      <div className="flex flex-col items-center pt-5 mx-auto p-10 rounded-lg">
        {/* Profile Picture */}
        <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden shadow-md border-4 border-purple-300">
          <img
            src={userInfo.profilePicUrl}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>

        {/* User Information */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-purple-600 mb-1">
            {userInfo.userName || "User"}
          </h3>

          {/* Email */}
          <div className="flex items-center justify-center gap-2 text-gray-700 text-lg">
            <FaEnvelope className="text-purple-500" />
            <h4>{userInfo.email}</h4>
          </div>

          {/* Link Tree URL */}
          <div className="flex items-center justify-center gap-2 text-gray-700 text-lg mt-3">
            <FaLink className="text-cyan-500" />
            {/* If linkTreeUrl exists, show as clickable Link, otherwise show fallback text */}
            {userInfo.linkTreeUrl ? (
              <Link
                to={userInfo.linkTreeUrl} // This assumes the link is internal (e.g., a route in your app)
                className="text-blue-500 hover:underline"
              >
                <h5>{userInfo.linkTreeUrl}</h5>
              </Link>
            ) : (
              <h4>Not yet generated</h4>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default UserDetailsCard;
