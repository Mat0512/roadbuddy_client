import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import SPMap from 'components/common/Map/v2/SPMap';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'configs/axios';

interface Location {
  name: string;
  location_lat: number | null;
  location_lng: number | null;
}

interface LocationsApiResponse {
  message: string;
  locations: Location[];
}

// Fetch location list
async function fetchLocations(): Promise<LocationsApiResponse> {
  const response = await axiosInstance.get<LocationsApiResponse>('/service-providers/locations');
  return response.data; // API returns a single object, not an array
}

export default function SPMaps() {
  // Fetch location list
  const { data, isLoading, isError } = useQuery<LocationsApiResponse>({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: 'auto', padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Location
      </Typography>

      {/* Location Details with OpenStreetMap */}
      <Card variant="outlined" sx={{ mb: 2, width: '100%' }}>
        <CardHeader title="Location Details" />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '300px', marginTop: '16px', position: 'relative' }}>
              {isLoading && <Typography>Loading map...</Typography>}
              {isError && <Typography>Error loading locations</Typography>}
              {!isLoading && !isError && data && (
                <SPMap
                  locationList={data.locations.map(location => ({
                    name: location.name,
                    lat: location.location_lat,
                    long: location.location_lng,
                  }))}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
