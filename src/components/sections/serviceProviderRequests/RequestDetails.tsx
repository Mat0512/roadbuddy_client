import { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import {
  FaPhone,
  FaEnvelope,
  FaComments,
  FaMapMarkerAlt,
  FaCar,
  FaCheckCircle,
  // FaTimes,
} from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface GoogleMapProps {
  location: {
    lat: number;
    lng: number;
  };
}

// Replace the placeholder GoogleMap component with this:
const MapComponent = ({ location }: GoogleMapProps) => (
  <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
    <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={location} zoom={15}>
      <Marker position={location} />
    </GoogleMap>
  </LoadScript>
);

export default function ServiceRequestDetails() {
  //   const theme = useTheme();
  //   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [status, setStatus] = useState('Pending');

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1200, margin: 'auto' }}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Service Request Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">User Information</Typography>
                <Typography>John Doe</Typography>
                <Typography>
                  <FaPhone style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  (123) 456-7890
                </Typography>
                <Typography>
                  <FaEnvelope style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  johndoe@example.com
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Service Details</Typography>
                <Typography>Service Type: Tire Change</Typography>
                <Typography>Request Date: May 15, 2023 10:30 AM</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography sx={{ mr: 1 }}>Status:</Typography>
                  <Select
                    sx={{ width: 100, paddingLeft: 0, marginLeft: 0 }}
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Description</Typography>
                <Typography>
                  Left rear tire is flat. I'm parked on the side of Highway 101, mile marker 25.
                </Typography>
              </Box>
              <IconButton color="primary" aria-label="chat with user">
                <FaComments />
              </IconButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 300, mb: 2 }}>
                  <MapComponent location={{ lat: 37.7749, lng: -122.4194 }} />
                </Box>
                {/* <Button
                  variant="contained"
                  startIcon={<FaMapMarkerAlt />}
                  fullWidth
                  onClick={() =>
                    window.open('https://maps.google.com?q=37.7749,-122.4194', '_blank')
                  }
                >
                  Get Directions
                </Button> */}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={status === 'Pending' ? <FaCheckCircle /> : <FaCar />}
          sx={{ flex: 1 }}
        >
          {status === 'Pending' ? 'Accept Request' : 'Mark as Completed'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<FaMapMarkerAlt />}
          sx={{ flex: 1, ml: 1 }}
          onClick={() => window.open('https://maps.google.com?q=37.7749,-122.4194', '_blank')}
        >
          View Directions
        </Button>
      </Box>
    </Box>
  );
}
