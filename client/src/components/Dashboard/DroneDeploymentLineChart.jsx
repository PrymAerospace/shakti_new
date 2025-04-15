import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const DroneDeploymentLineChart = () => {
// line chart data

const allData = {
  India: [
    { x: "January", y: 200 },
    { x: "February", y: 220 },
    { x: "March", y: 250 },
    { x: "April", y: 270 },
    { x: "May", y: 300 },
    { x: "June", y: 320 },
    { x: "July", y: 350 },
    { x: "August", y: 370 },
    { x: "September", y: 390 },
    { x: "October", y: 400 },
    { x: "November", y: 420 },
    { x: "December", y: 450 },
  ],
  Maharashtra: [
    { x: "January", y: 40 },
    { x: "February", y: 50 },
    { x: "March", y: 60 },
    { x: "April", y: 70 },
    { x: "May", y: 80 },
    { x: "June", y: 85 },
    { x: "July", y: 90 },
    { x: "August", y: 95 },
    { x: "September", y: 100 },
    { x: "October", y: 110 },
    { x: "November", y: 120 },
    { x: "December", y: 130 },
  ],
  Gujarat: [
    { x: "January", y: 20 },
    { x: "February", y: 30 },
    { x: "March", y: 40 },
    { x: "April", y: 50 },
    { x: "May", y: 60 },
    { x: "June", y: 70 },
    { x: "July", y: 80 },
    { x: "August", y: 85 },
    { x: "September", y: 90 },
    { x: "October", y: 100 },
    { x: "November", y: 110 },
    { x: "December", y: 120 },
  ],
  Punjab: [
    { x: "January", y: 30 },
    { x: "February", y: 40 },
    { x: "March", y: 45 },
    { x: "April", y: 50 },
    { x: "May", y: 55 },
    { x: "June", y: 60 },
    { x: "July", y: 65 },
    { x: "August", y: 70 },
    { x: "September", y: 80 },
    { x: "October", y: 90 },
    { x: "November", y: 100 },
    { x: "December", y: 110 },
  ],
};

const [selectedRegions, setSelectedRegions] = useState(["India"]);

const handleCheckboxChange = (region) => {
  if (region === "India") {
    setSelectedRegions((prevSelected) =>
      prevSelected.includes(region) ? [] : ["India"]
    );
  } else {
    setSelectedRegions((prevSelected) => {
      const isIndiaSelected = prevSelected.includes("India");
      const updatedSelection = isIndiaSelected
        ? prevSelected.filter((item) => item !== "India")
        : prevSelected;

      return updatedSelection.includes(region)
        ? updatedSelection.filter((item) => item !== region)
        : [...updatedSelection, region];
    });
  }
};

// Combine data for all selected regions
const combinedData = Object.keys(allData["India"]).map((monthIndex) => {
  const month = allData["India"][monthIndex].x;
  const total = selectedRegions.reduce((sum, region) => {
    return sum + (allData[region]?.[monthIndex]?.y || 0);
  }, 0);
  return { x: month, y: total };
});

const chartData = [
  {
    id: "Combined Data",
    color: "hsl(240, 70%, 50%)",
    data: combinedData,
  },
];


  return (
    <div className=" flex flex-col h-[50vh] w-[80vw] bg-[#ffffff] rounded-2xl ">
              <div className=" flex  items-center justify-between px-4 py-2">
                <div>
                  <h1 className="text-2xl font-bold">
                    Drones Deployed Over Time
                  </h1>
                </div>
                <div>
                  <label className="font-semibold text-lg">
                    Select Regions:
                  </label>
                  <div className="flex gap-4 mt-2">
                    {Object.keys(allData).map((region) => (
                      <label key={region} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={region}
                          checked={selectedRegions.includes(region)}
                          onChange={() => handleCheckboxChange(region)}
                          className="cursor-pointer"
                        />
                        {region}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <ResponsiveLine
                data={chartData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  orient: "bottom",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Months",
                  legendOffset: 36,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  orient: "left",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Number of Drones",
                  legendOffset: -40,
                  legendPosition: "middle",
                }}
                colors={{ scheme: "nivo" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                tooltip={({ point }) => (
                  <div
                    style={{
                      background: "white",
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Month: {point.data.x} <br />
                    Number of Drones: {point.data.y}
                  </div>
                )}
              />
            </div>
  );
};

export default DroneDeploymentLineChart;
