import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useGeolocation from 'components/hooks/useGeolocation';
import { Typography } from '@mui/material';
interface Coordinates {
    name?: string;
    lat: number | null;
    long: number | null;
  }

interface Props {       

    locationList: Coordinates[];
}

const SPMap = ({ locationList }: Props) => {

    const { location, error, loading } = useGeolocation();
    const {lat, long} = location

    // Handle cases where lat or long might be null
    const basePosition: LatLngExpression = lat && long
        ? [lat, long]
        : [0, 0]; // Default to [0, 0] if baseLocation is invalid

    if(loading) return <Typography>Loading...</Typography>
    if(error) return <Typography>Can't get your location.</Typography>

    return (
        <MapContainer
            center={basePosition}
            zoom={15}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Marker for base location */}
        
            {lat !== null && long !== null &&    <Marker position={[lat, long]}>
                        <Popup>Your Location</Popup>
                    </Marker> }
            {/* Marker for target location (optional) */}
            {locationList && locationList.map((l, i) =>
                (l.lat !== null && l.long !== null) && (
                    <Marker key={i} position={[l.lat, l.long]}>
                        <Popup>{l.name}</Popup>
                    </Marker>
                )
            )}
        </MapContainer>
    );
};

export default SPMap;
