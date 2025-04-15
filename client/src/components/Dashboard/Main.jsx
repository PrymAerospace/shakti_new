import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiDeliveryDrone } from "react-icons/gi";
import { TbDroneOff } from "react-icons/tb";
import { PiDrone } from "react-icons/pi";
import { GiAutoRepair } from "react-icons/gi";

const Main = () => {
  const [stats, setStats] = useState({
    totalDrones: 0,
    activeDrones: 0,
    repairDrones: 0,
    crashedDrones: 0,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("http://0.0.0.0:9000/api/drones/status");
        const data = await response.json();
        if (data.success) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching drone stats:", error);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="w-[80vw] bg-[#ffffff] flex justify-evenly rounded-2xl">
      {/* Deployed Drones */}
      <div className="px-6 py-4 w-[18vw] flex justify-between">
        <div className="flex flex-col justify-center">
          <h1 className="underline font-semibold text-lg">DEPLOYED DRONES</h1>
          <h1 className="font-black text-4xl">{stats.totalDrones}</h1>
        </div>
        <div className="flex items-center shadow-lg p-2 rounded-full bg-[#f5f5f5]">
          <PiDrone fontSize={60} />
        </div>
      </div>

      <div className="vertical-line"></div>

      {/* Active Drones */}
      <div className="px-6 py-4 w-[18vw] flex justify-between">
        <div className="flex flex-col justify-center">
          <Link to="/ActiveDrones">
            <h1 className="underline font-semibold text-lg">ACTIVE DRONES</h1>
          </Link>
          <h1 className="font-black text-4xl">{stats.activeDrones}</h1>
        </div>
        <div className="flex items-center shadow-lg p-2 rounded-full bg-[#f5f5f5]">
          <GiDeliveryDrone fontSize={60} />
        </div>
      </div>

      <div className="vertical-line"></div>

      {/* Crashed Drones */}
      <div className="px-6 py-4 w-[18vw] flex justify-between">
        <div className="flex flex-col justify-center">
          <h1 className="underline font-semibold text-lg">CRASHED DRONES</h1>
          <h1 className="font-black text-4xl">{stats.crashedDrones}</h1>
        </div>
        <div className="flex items-center shadow-lg p-2 rounded-full bg-[#f5f5f5]">
          <GiAutoRepair fontSize={60} />
        </div>
      </div>

      <div className="vertical-line"></div>

      {/* Repair Drones */}
      <div className="px-6 py-4 w-[18vw] flex justify-between">
        <div className="flex flex-col justify-center">
          <h1 className="underline font-semibold text-lg">REPAIR DRONES</h1>
          <h1 className="font-black text-4xl">{stats.repairDrones}</h1>
        </div>
        <div className="flex items-center shadow-lg p-2 rounded-full bg-[#f5f5f5]">
          <TbDroneOff fontSize={60} />
        </div>
      </div>
    </div>
  );
};

export default Main;
