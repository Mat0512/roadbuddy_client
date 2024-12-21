import { Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import RoutingMachine from "./RoutingMachine";
import 'leaflet/dist/leaflet.css';


    
const Map = (props) => {
  const { points } = props
  console.log("points")

  console.log(points)
  const [location, setLocation] = useState(null);
  console.log(location)

  console.log(location)
  const rMachine = useRef();


  useEffect(() => {
    // Check if geolocation is available in the browser
    if ("geolocation" in navigator) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
        },
        (error) => {
          console.log(error)
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (rMachine.current) {
      console.log(rMachine.current);
      rMachine.current.setWaypoints(points);  // Correct reference to 'points'
    }
  }, [points, rMachine]);

  if (location == null || !points) return <Typography>Loading...</Typography>

  return (
    <MapContainer
      doubleClickZoom={false}
      id="mapId"
      // zoom={14}
      center={[15.547902, 120.713378]}
      style={{ width: '100%', height: '100%',  }}

    >
      <TileLayer
         url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
      />
      <RoutingMachine ref={rMachine} waypoints={points} defaultPoints={location}/>
     
    </MapContainer>
  );
};

export default Map;
