import React, { useState } from "react";
import { MdOutlineLogout } from "react-icons/md";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { GiDeliveryDrone } from "react-icons/gi";
import { PiDroneBold } from "react-icons/pi";
import { IoInformationCircleSharp } from "react-icons/io5";
import { MdDescription } from "react-icons/md";
import { FaQuora } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import PrymLogo from "../Logos/PrymLogo";

const Sidebar = () => {
  const [activeNav, setActiveNav] = useState("dashboard");
  const navigate = useNavigate();

  const handleNavClick = (nav) => {
    navigate(`/${nav}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="w-[15vw] h-screen bg-[#FFFFFF] p-4 flex flex-col justify-between shadow-md sticky top-0 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <ul>
            <li
              className={`flex gap-4 items-center text-xl cursor-pointer p-2 ${
                activeNav === "dashboard" ? "bg-[#F5F5F5] rounded-2xl m-2" : ""
              }`}
              onClick={() => handleNavClick("dashboard")}
            >
             <div className="bg-white p-2 rounded-2xl">
             <MdOutlineDashboardCustomize fontSize={26} />
             </div>
              Dashboard
            </li>
            <li
              className="flex gap-4 items-center text-xl cursor-pointer p-2 hover:bg-[#F5F5F5] rounded-2xl transition-all"
              onClick={() => handleNavClick("activeDrones")}
            >
            <div className="bg-[#F5F5F5] p-2 rounded-2xl">
            <GiDeliveryDrone fontSize={26} />
            </div>
              Active Drones
            </li>
            <li
              className="flex gap-4 items-center text-xl cursor-pointer p-2 hover:bg-[#F5F5F5] rounded-2xl transition-all"
              onClick={() => handleNavClick("allDrones")}
            >
              <div className="bg-[#F5F5F5] p-2 rounded-2xl">
              <PiDroneBold fontSize={26} />
              </div>
              All Drones
            </li>
            <li
              className="flex gap-4 items-center text-xl cursor-pointer p-2 hover:bg-[#F5F5F5] rounded-2xl transition-all"
              onClick={() => handleNavClick("faqs")}
            >
             <div className="bg-[#F5F5F5] p-2 rounded-2xl">
             <FaQuora fontSize={26} />
             </div>
             FAQ`s
            </li>
            <li
              className="flex gap-4 items-center text-xl cursor-pointer p-2 hover:bg-[#F5F5F5] rounded-2xl transition-all"
              onClick={() => handleNavClick("aboutUs")}
            >
              <div className="bg-[#F5F5F5] p-2 rounded-2xl">
              <IoInformationCircleSharp fontSize={26} />
              </div>
              About Us
            </li>
            <li
              className="flex gap-4 items-center text-xl cursor-pointer p-2 hover:bg-[#F5F5F5] rounded-2xl transition-all"
              onClick={() => handleNavClick("termsConditions")}
            >
              <div className="bg-[#F5F5F5] p-2 rounded-2xl">
              <MdDescription fontSize={26} />
              </div>
              Terms & Conditions
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div className="flex justify-center items-center">
          <PrymLogo />
        </div>
        <div className="flex justify-between p-2 cursor-pointer items-center rounded-2xl bg-[#F5F5F5]" onClick={handleLogout}>
          <h1 className="font-bold text-xl">Logout</h1>
          <div className="bg-white rounded-xl p-2">
            <MdOutlineLogout fontSize={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
