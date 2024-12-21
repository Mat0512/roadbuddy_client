import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {
  const { waypoints, defaultPoints } = props;

  
  console.log("!!!!!!!1 waypoints !!!!!!!!!")

  console.log(waypoints)
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(waypoints[0], waypoints[1]),
      L.latLng(defaultPoints[0], defaultPoints[1])
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
