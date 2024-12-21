import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GoogleMapProps {
  baseLocation: {
    lat: number | null;
    long: number | null;
  };
  targetLocation?: {
    lat: number | null;
    long: number | null;
  };
}

const MapComponent = ({ baseLocation, targetLocation }: GoogleMapProps) => {
  // Handle cases where lat or long might be null
  const basePosition: LatLngExpression = baseLocation.lat && baseLocation.long 
    ? [baseLocation.lat, baseLocation.long] 
    : [0, 0]; // Default to [0, 0] if baseLocation is invalid
  
  const oppositePosition: LatLngExpression = targetLocation?.lat && targetLocation?.long
    ? [targetLocation.lat, targetLocation.long]
    : basePosition; // Default to baseLocation if targetLocation is invalid

  return (
    <MapContainer
      center={basePosition}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marker for base location */}
      {baseLocation.lat && baseLocation.long && (
        <Marker position={basePosition}>
          <Popup>Base Location</Popup>
        </Marker>
      )}

      {/* Marker for target location (optional) */}
      {targetLocation?.lat && targetLocation?.long && (
        <Marker position={oppositePosition}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
