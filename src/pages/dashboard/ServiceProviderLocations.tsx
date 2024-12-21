import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import Map from 'components/common/Map/Map';
import { useEffect, useState } from 'react';

export default function ServiceTrackingPage() {
  const [locations, setLocations] = useState<{ lat: number; long: number }[]>([]);

  useEffect(() => {
    // Make API call to fetch the list of locations
    fetch('http://localhost:5000/api/locations') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        // Assuming the response is an array of location objects
        setLocations(data);
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
      });
  }, []); // The empty array ensures this only runs once, like componentDidMount

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '10px' }}>
      <Typography variant="h4" gutterBottom>
        Service Provider Locations
      </Typography>

      {/* Location Details with OpenStreetMap */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardHeader title="Location Details" />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{ width: '100%', height: '300px', marginTop: '16px', position: 'relative' }}
            >
              <Map locations={locations} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
