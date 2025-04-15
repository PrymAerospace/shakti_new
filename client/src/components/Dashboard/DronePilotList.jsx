import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const DronePilotsList = () => {
  const [selectedOption, setSelectedOption] = useState("droneMasters");
  const [currentPage, setCurrentPage] = useState(1);
  

  const droneMasters = [
    { id: 1, name: "Ivy Taylor", crashes: 0, areaSprayed: 200 },
    { id: 2, name: "Henry Moore", crashes: 0, areaSprayed: 190 },
    { id: 3, name: "Grace Lee", crashes: 0, areaSprayed: 180 },
    { id: 4, name: "Frank Wilson", crashes: 0, areaSprayed: 170 },
    { id: 5, name: "Eve White", crashes: 0, areaSprayed: 160 },
    { id: 6, name: "Charlie Davis", crashes: 0, areaSprayed: 150 },
    { id: 7, name: "Bob Brown", crashes: 0, areaSprayed: 140 },
    { id: 8, name: "Alice Johnson", crashes: 0, areaSprayed: 130 },
    { id: 9, name: "Jane Smith", crashes: 1, areaSprayed: 110 },
    { id: 10, name: "John Doe", crashes: 0, areaSprayed: 120 },
  ];

  const droneStrugglers = [
    { id: 11, name: "Jack Adams", crashes: 3, areaSprayed: 80 },
    { id: 12, name: "Karen Hall", crashes: 2, areaSprayed: 90 },
    { id: 13, name: "Leo Clark", crashes: 4, areaSprayed: 70 },
    { id: 14, name: "Mia Lewis", crashes: 5, areaSprayed: 60 },
    { id: 15, name: "Noah Walker", crashes: 3, areaSprayed: 50 },
    { id: 16, name: "Olivia Young", crashes: 2, areaSprayed: 40 },
    { id: 17, name: "Paul Allen", crashes: 4, areaSprayed: 30 },
    { id: 18, name: "Quinn Scott", crashes: 5, areaSprayed: 20 },
    { id: 19, name: "Ryan Green", crashes: 3, areaSprayed: 10 },
    { id: 20, name: "Sara King", crashes: 2, areaSprayed: 5 },
  ];

  const pilotsPerPage = 5;
  const selectedData =
    selectedOption === "droneMasters" ? droneMasters : droneStrugglers;
  const startIndex = (currentPage - 1) * pilotsPerPage;

const totalPages = Math.ceil(selectedData.length / pilotsPerPage);
  const currentPilots = selectedData.slice(
    startIndex,
    startIndex + pilotsPerPage
  );

  return (
    <div className="h-[40vh] w-[40vw] bg-[#ffffff]  rounded-2xl p-4 ">
    <div className="flex  gap-30">
      <h1 className="text-2xl font-bold">Drone Pilots Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setSelectedOption("droneMasters");
            setCurrentPage(1);
          }}
          className={`px-4 text-lg font-semibold rounded-full shadow-md  ${
            selectedOption === "droneMasters"
              ? "bg-soft-teal text-black"
              : "bg-gray-200 text-gray-700 hover:"
          }`}
        >
          Drone Masters
        </button>
        <button
          onClick={() => {
            setSelectedOption("droneStrugglers");
            setCurrentPage(1);
          }}
          className={`px-4 text-lg font-semibold rounded-full shadow-md  ${
            selectedOption === "droneStrugglers"
              ? "bg-soft-teal text-black"
              : "bg-gray-200 text-gray-700 hover:"
          }`}
        >
          Drone Strugglers
        </button>
      </div>
    </div>
    <div className="mb-8">
      <h2
        className={`text-2xl font-semibold py-4 underline text-center ${
          selectedOption === "droneMasters"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {selectedOption === "droneMasters"
          ? "Top Performing Pilots"
          : "Pilots Needing Improvement"}
      </h2>
      <ul className="space-y-4">
        {currentPilots.map((pilot) => (
          <li
            key={pilot.id}
            className={`p-2 rounded-lg ${
              selectedOption === "droneMasters"
                ? "bg-mint-green"
                : "bg-pale-yellow"
            }`}
          >
            <div className="flex justify-between items-center text-gray-800">
              <span className="font-medium text-lg">
                {pilot.name}
              </span>
              <span className="text-sm font-semibold">
                Crashes: {pilot.crashes} | Area: {pilot.areaSprayed}{" "}
                sq. units
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>

    {/* Pagination with Icons */}

    <div className="flex justify-end pe-10 gap-4 mt-6">
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        disabled={currentPage === 1}
        className={`  ${
          currentPage === 1
            ? " text-gray-500 cursor-not-allowed"
            : "bg-soft-teal text-black "
        }`}
      >
        <MdOutlineKeyboardArrowLeft
          fontWeight={900}
          fontSize={36}
        />
      </button>

      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
        className={`  ${
          currentPage === totalPages
            ? " text-gray-500 cursor-not-allowed"
            : "bg-soft-teal text-black "
        }`}
      >
        <MdOutlineKeyboardArrowRight fontSize={36} />
      </button>
    </div>
  </div>
  );
};

export default DronePilotsList;
