


// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import { FaMapMarkedAlt, FaMap } from "react-icons/fa";
// import "leaflet/dist/leaflet.css";
// import droneIconImg from "/droneicon.png"; // Ensure correct path

// const droneIcon = L.icon({
//   iconUrl: droneIconImg,
//   iconSize: [50, 50],
//   iconAnchor: [25, 25],
//   popupAnchor: [0, -25],
// });

// const MapView = () => {
//   const [drones, setDrones] = useState([]);
//   const [selectedDrone, setSelectedDrone] = useState(null);
//   const [useSatellite, setUseSatellite] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDrones = async () => {
//       try {
//         const response = await fetch("http://192.168.31.68:9000/api/drones");
//         const data = await response.json();

//         // Filter only active & flying drones
//         const activeDrones = data.filter(
//           (drone) => drone.status === "Active" || drone.status === "Flying"
//         );

//         setDrones(activeDrones);
//       } catch (error) {
//         console.error("Error fetching drone data:", error);
//         setError("Failed to load drones.");
//       }
//     };

//     fetchDrones();
//     const interval = setInterval(fetchDrones, 5000); // Auto-refresh every 5 seconds
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative h-[100vh] w-[100vw]">
//       <button
//         onClick={() => setUseSatellite(!useSatellite)}
//         className="absolute bottom-10 right-8 z-50 bg-[#1c4684] text-white p-3 rounded-full shadow-md transition"
//       >
//         {useSatellite ? <FaMap className="text-4xl" /> : <FaMapMarkedAlt className="text-4xl" />}
//       </button>

//       {drones.length > 0 ? (
//         <MapContainer center={[drones[0].Latitude, drones[0].Longitude]} zoom={10} className="h-[100vh] w-[100vw] z-0">
//           <TileLayer
//             url={
//               useSatellite
//                 ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//                 : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             }
//           />

//           {drones.map((drone) => (
//             <Marker
//               key={drone.id}
//               position={[drone.Latitude, drone.Longitude]}
//               icon={droneIcon}
//               eventHandlers={{
//                 click: () => setSelectedDrone(drone),
//               }}
//             >
//               <Popup>
//                 <strong>{drone.droneId}</strong> <br />
//                 Status: {drone.status} <br />
//                 Click to view details.
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       ) : (
//         <div className="flex items-center justify-center h-full text-gray-500 text-xl">
//           {error || "No active drones found"}
//         </div>
//       )}

//       {selectedDrone && (
//         <SensorsData drone={selectedDrone} onClose={() => setSelectedDrone(null)} />
//       )}
//     </div>
//   );
// };

// export default MapView;


import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FaMapMarkedAlt, FaMap } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import droneIconImg from "/droneicon.png"; // Make sure to place the image in the assets folder

const droneIcon = L.icon({
  iconUrl: droneIconImg, // Path to your drone icon
  iconSize: [50, 50], // Adjust size as needed
  iconAnchor: [25, 25], // Adjust anchor to center the icon properly
  popupAnchor: [0, -25], // Adjust popup position
});

const MapView = () => {
  const [position, setPosition] = useState(null);
  const [useSatellite, setUseSatellite] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestSensorData = async () => {
      try {
        const response = await fetch("http://0.0.0.0:9000/api/sensors");
        const data = await response.json();

        if (data.length > 0) {
          const latest = data[0];
          if (latest.Latitude && latest.Longitude) {
            setPosition({ lat: latest.Latitude, lng: latest.Longitude });
            setError(null);
          } else {
            setPosition(null);
            setError("No valid location data found.");
          }
        } else {
          setPosition(null);
          setError("No location data available.");
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setPosition(null);
        setError("Error fetching location data.");
      }
    };

    fetchLatestSensorData();
    const interval = setInterval(fetchLatestSensorData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[100vh] w-[100vw]">
      <button
        onClick={() => setUseSatellite(!useSatellite)}
        className="absolute bottom-10 right-8 z-50 bg-[#1c4684] text-white p-3 rounded-full shadow-md transition"
      >
        {useSatellite ? <FaMap className="text-4xl" /> : <FaMapMarkedAlt className="text-4xl" />}
      </button>

      {position ? (
        <MapContainer center={[position.lat, position.lng]} zoom={16} className="h-[100vh] w-[100vw] z-0">
          <TileLayer
            url={
              useSatellite
                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          <Marker position={[position.lat, position.lng]} icon={droneIcon}>
            <Popup>Drone Live Location 📍</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-xl">
          {error || "No Location Found"}
        </div>
      )}
    </div>
  );
};

export default MapView;
