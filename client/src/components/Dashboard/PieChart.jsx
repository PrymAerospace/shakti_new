import React, { useState } from "react";
import { ResponsivePie } from "@nivo/pie";

const PieChart = () => {
  const allData = {
    Maharashtra: 5000,
    Gujarat: 3500,
    Punjab: 4500,
    "Uttar Pradesh": 3000,
  };

  const [selectedStates, setSelectedStates] = useState(Object.keys(allData));

  const handleCheckboxChange = (state) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const totalValue = selectedStates.reduce(
    (sum, state) => sum + allData[state],
    0
  );

  const data = selectedStates.map((state) => ({
    id: state,
    label: state,
    value: allData[state],
    percentage: ((allData[state] / totalValue) * 100).toFixed(2) + "%",
  }));

  return (
    <div className="flex flex-col h-[40vh] w-[38vw] bg-white rounded-2xl p-4 ">
      <div>
        <h2 className="text-2xl font-bold">Area Sprayed by State</h2>
      </div>
      <div className="flex  justify-around">
        <div  className="w-1/2 h-[40vh] flex items-center justify-center">
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "nivo" }}
            borderWidth={1}
            borderColor="white"
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLabel={({ data }) => `${data.percentage}`}
            arcLabelsRadiusOffset={0.55}
            sliceLabelsRadiusOffset={0.75}
          />
        </div>
        <div className="flex flex-col pt-20 gap-2">
        <label className="font-semibold text-lg mb-2 ms-4">Select States:</label>
          <div className="flex flex-col items-start gap-3">
            {Object.keys(allData).map((state) => (
              <label key={state} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={state}
                  checked={selectedStates.includes(state)}
                  onChange={() => handleCheckboxChange(state)}
                  className="cursor-pointer w-5 h-5"
                />
                <span className="text-lg">{state}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
