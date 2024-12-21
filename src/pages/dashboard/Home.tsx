import { Card, CardContent, CardHeader, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { Queue } from 'components/queue';


interface GoogleMapProps {
  location: {
    lat: number;
    lng: number;
  };
}



const MapComponent = ({ location }: GoogleMapProps) => {
  const position: LatLngExpression = [location.lat, location.lng];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default function Home() {

  // New state to hold user location
  const [userLocation, setUserLocation] = useState<{ location_lat: number; location_lng: number } | undefined>(undefined);
  const navigate = useNavigate()
  // const [requests, setRequests] = useState<ServiceRequest[]>([]);  

  // Get current user position
  useEffect(() => {
    const getLocation = async () => {
      // Check for permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log([position.coords.latitude, position.coords.longitude])
            setUserLocation({ location_lat: position.coords.latitude, location_lng: position.coords.longitude });
          },
          (error) => {
            console.error("Error getting user location:", error);
          },
          { enableHighAccuracy: true } // Request high accuracy
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  // Use userLocation if available, otherwise fallback to API data
  const location = userLocation ? [userLocation.location_lat, userLocation.location_lng] : [0, 0];

  const handleSendRequest = () => {
    navigate('/pages/service-provider-category');

  };



  if (!userLocation) return <div>Loading driver location...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: 0, padding: '16px' }}>
      {/* Location Details with OpenStreetMap */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Location   " />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{ width: '100%', height: '300px', marginTop: '16px', position: 'relative' }}
            >

              <MapComponent
                location={{
                  lat: (location as [number, number])[0],
                  lng: (location as [number, number])[1],
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendRequest}
          fullWidth
          sx={{ mt: 2 }}
        >
          Send Request       
         </Button>
      </div>
      <Queue />
    </div>
  );
}
