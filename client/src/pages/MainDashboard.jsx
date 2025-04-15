import React from "react";
import PieChart from "../components/Dashboard/PieChart";
import MapView from "../components/Maps/MapView";
import DronePilotsList from "../components/Dashboard/DronePilotList";
import DashNavbar from "../components/Dashboard/DashNavbar";
import Sidebar from "../components/Dashboard/Sidebar";
import Main from "../components/Dashboard/Main";
import DroneDeploymentLineChart from "../components/Dashboard/DroneDeploymentLineChart";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const MainDashboard = () => {
  return (
    <div className="bg-[#F5F5F5] h-screen flex overflow-hidden">
      {/* Sidebar (Sticky) */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Navbar */}
        <DashNavbar />

        {/* Main Content */}
        <div className="flex flex-col items-center py-10 gap-10 px-5">
          {/* Drones Deployed / Crashed / Active / Repair */}
          <Main />

          {/* Map View */}
          {/* Map View */}
          <div className="relative h-[50vh] w-[80vw] bg-[#ffffff] rounded-2xl overflow-hidden -mb-28">
            {/* Clickable Title */}
            <Link
              to="/ActiveDrones"
              className="absolute top-2 left-12 text-2xl font-bold bg-white/75  bg-opacity-75 px-4 py-2 rounded-lg shadow-md z-40 cursor-pointer"
            >
              Drone Deployments Map
            </Link>

            {/* Map Component */}
            <MapView />
          </div>

          {/* Line Chart */}
          <DroneDeploymentLineChart />

          {/* Drone Pilots Info & Pie Chart */}
          <div className="flex justify-between h-[50vh] w-[80vw] rounded-2xl">
            <DronePilotsList />
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;