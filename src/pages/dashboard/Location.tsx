import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import Map from 'components/common/Map/Map'


export default function ServiceTrackingPage() {
const queryParams = new URLSearchParams(location.search); // Parse query string
  
  // Example: Get individual query parameters
  const lat = queryParams.get('lat');
  const long = queryParams.get('long'); 

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Location
      </Typography>
     
      {/* Location Details with OpenStreetMap */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardHeader title="Location Details" />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{ width: '100%', height: '300px', marginTop: '16px', position: 'relative' }}
            >
              <Map
                points={[lat, long]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  );
}
