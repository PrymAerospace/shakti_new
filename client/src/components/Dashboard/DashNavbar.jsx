import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";
import ShaktiLogo from "../Logos/ShaktiLogo";
import { MdAddToPhotos } from "react-icons/md";

const DashNavbar = () => {
  return (
    <div className="h-[8vh] bg-[#FFFFFF] w-full flex items-center justify-between px-10 py-2 sm:px-10 shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <ShaktiLogo />
      </div>

      {/* Search & Icons */}
      <div className="flex items-center gap-10 sm:gap-10">
        {/* Search Bar */}
        <div className="border-2 flex items-center px-2 py-1 rounded-2xl w-[150px] sm:w-[200px]">
          <input
            className="w-full border-none focus:outline-none focus:ring-0 text-sm sm:text-base"
            type="search"
            placeholder="Search"
          />
          <IoSearch fontSize={20} className="text-gray-600 sm:text-xl" />
        </div>

        {/* Notification & User Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative group cursor-pointer flex items-center">
            <MdAddToPhotos
              fontSize={26}
              className="text-gray-700 sm:text-2xl"
            />
            <span className="absolute left-full ml-2 px-2 py-1 text-md text-green-500 bg-slate-100 font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Add Drone
            </span>
          </div>

          <MdNotificationsActive
            fontSize={26}
            className="text-gray-700 sm:text-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default DashNavbar;
