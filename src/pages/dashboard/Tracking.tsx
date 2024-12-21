import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import axios from 'configs/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useStore } from 'store';
import 'leaflet/dist/leaflet.css';
import axiosInstance from 'configs/axios';
import { useNavigate } from 'react-router-dom';
import usePusherLocationListener from 'components/hooks/usePusherLocationListener';
import useLocationUpdater from 'components/hooks/useLocationUpdate';

interface GoogleMapProps {
  location: {
    lat: number;
    lng: number;
  };
  spLocation: {
    lat: number;
    lng: number;
  };
}

interface QueryResponse {
  message: string;
  service_request: {
    request_id: number;
    user: {
      user_id: number;
      name: string;
    };
    provider_id: number;
    status: string;
    request_time: string;
    completion_time: string | null;
    location_lat: number;
    location_lng: number;
    service_id: number;
    rating: number;
    provider: {
      provider_id: number,
      service_provider_name: string,
      contact_info: string,
      location_lat: number,
      location_lng: number
    }
    service: {
      provider_service_id: number;
      provider_id: number;
      service_name: string;
      price: number;
      description: string;
    }
  };
}


const getServiceRequest = async (id: number): Promise<QueryResponse> => {
  const response = await axios.get<QueryResponse>(`/service-requests/${id}`);
  return response.data;
};


const MapComponent = ({ location, spLocation }: GoogleMapProps) => {
  const position: LatLngExpression = [location.lat, location.lng];
  const spPosition: LatLngExpression = [spLocation.lat, spLocation.lng];
  // const spPosition: LatLngExpression = [13.7665, 121.055];


  const polylinePosition = [position, spPosition]

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Driver Location</Popup>
      </Marker>
      <Marker position={spPosition}>
        <Popup>Service Provider location</Popup>
      </Marker>
      <Polyline positions={polylinePosition } color="red"/>
    </MapContainer>
  );
};

interface ServiceRequest {
  request_id: number;
  type: string;
  location: string;
  status: string;
  time: string;
  service_name: string;
}

interface ServiceRequestsResponse {
  message: string;
  service_requests: ServiceRequest[];
}
interface UpdateServiceRequestsParams {
  requestId: number;
  status: string;
}

const UpdateServiceRequest = async ({ requestId, status }: UpdateServiceRequestsParams) => {
  const { data } = await axiosInstance.put<ServiceRequestsResponse>(`/service-requests/${requestId}`, {
   status
  });
  return data;
};

export default function ServiceTrackingPage() {
  const user = useStore((state) => state.user);
  const isServiceProvider = user && user.type === 'service_provider' ? true : false; // Check if user is not null
  const { id } = useParams();
  const {location} = usePusherLocationListener(id || '')
  const {location: updatedLocation} = useLocationUpdater(id, isServiceProvider)
  console.log("puhser location")
  console.log(location)

  console.log('updated location')
  console.log(updatedLocation)


  const navigate = useNavigate();


  const { data, isLoading, isError } = useQuery({
    queryKey: ['service-request', id],
    queryFn: () => getServiceRequest(Number(id)),
  });

  const {mutate, isPending } = useMutation({
    mutationKey: ["update-requ"],
    mutationFn: ({ requestId, status }: UpdateServiceRequestsParams) => 
      UpdateServiceRequest({ requestId, status }),
    onSuccess: () => {
      alert(`Request Updated`)
      navigate('/pages/sp/service-requests')    },
    onError: () =>{
      alert("Failed to cancel request. Try again")
    }
  })

  
  const handleCancelService = () => {
    mutate({ requestId: Number(id), status: 'cancelled' });
  };

  const handleAcceptService = () => {
    mutate({ requestId: Number(id), status: 'accepted' });
  };

  const handleMarkAsCompleted = () => {
    mutate({ requestId: Number(id), status: 'completed' });
  }

  const handleOpenChat = (id: string) => {
    navigate(`/pages/chat/${id}`)
  }
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching service request</div>;
  if (!data) return <div>No data available</div>;

  const handlePayment = async () => {
 
    // Create service request first
    try {
      const secretKey = 'sk_test_7Kcg3jtpPaycB76kR4sHW7xw'; // Replace with your actual secret key
      const basicToken = btoa(`${secretKey}:`);
  
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Basic ${basicToken}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              send_email_receipt: true,
              show_description: true,
              show_line_items: true,
              line_items: [
                {
                  currency: 'PHP',
                  amount: data.service_request.service.price * 100, // Use parameterized value for amount
                  description: data.service_request.service.service_name, // Parameterized description
                  name: data.service_request.service.service_name, // Parameterized service name
                  quantity: 1, // Quantity hardcoded as 1 for now
                },
              ],
              payment_method_types: ['card', 'gcash'], // Supported payment methods
              description: data.service_request.service.service_name, // Parameterized description
              success_url: `http://localhost:3000/dnx/pages/service-requests`,
            },
          },
        }),
      };
  
      const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options);
      const resData = await response.json();
  
      if (resData.data && resData.data.attributes.checkout_url) {
        // Redirect to the payment session URL
        window.location.replace(resData.data.attributes.checkout_url);
      } else {
        console.error('Failed to generate payment session:', resData);
        alert('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };



  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Service Tracking
      </Typography>

       {/* Service Status */}
       <Card variant="outlined" sx={{ mb: 2 }}>
        <CardHeader title="Service Provider" />
        <CardContent>
          <Typography variant="body1" display="flex" alignItems="center">
            {data.service_request.provider.service_provider_name}
          </Typography>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardHeader title="Service Status" />
        <CardContent>
          <Typography variant="body1" display="flex" alignItems="center">
            Status: {data.service_request.status.toUpperCase()}
          </Typography>
        </CardContent>
      </Card>

      {/* Request Information */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardHeader title="Request Information" />
        <CardContent>
        <Typography display="flex" alignItems="center" mt={1}>
            <strong>Request ID:</strong> {data.service_request.request_id}
          </Typography>
          <Typography display="flex" alignItems="center">
            <strong>Name:</strong> {data.service_request.user.name} 
            {/* make this name of driver */}
          </Typography>
      
  
        </CardContent>
      </Card>

      {/* Time Tracking */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardHeader title="Time Tracking" />
        <CardContent>
          <Typography display="flex" alignItems="center">
            <strong>Request Time:</strong>{' '}
            {new Date(data.service_request.request_time).toLocaleString()}
          </Typography>
      
        </CardContent>
      </Card>

      {/* Location Details with OpenStreetMap */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardHeader title="Location Details" />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{ width: '100%', height: '300px', marginTop: '16px', position: 'relative' }}
            >
              <MapComponent
                //this location never changes as it signify a broken vehicle
                location={{
                  lat: data.service_request.location_lat,
                  lng: data.service_request.location_lng,
                }}

                // this location constantly changes
                spLocation={{
                  lat: ["accepted"].includes(data.service_request.status) 
                    ? location.latitude ?? data.service_request.provider.location_lat // Default to 0 if null
                    : data.service_request.provider.location_lat,
                  lng: ["accepted"].includes(data.service_request.status) 
                    ? location.longitude ?? data.service_request.provider.location_lng // Default to 0 if null
                    : data.service_request.provider.location_lng,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons for Providers */}
      {isServiceProvider && data.service_request.status !== 'completed' &&  data.service_request.status !== 'accepted' && data.service_request.status !== 'cancelled' && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAcceptService}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isPending ? "Loading..." : "Accept"}
          </Button>
          <Button 
            variant="contained"
            color="error"
            onClick={handleCancelService}
            fullWidth
            sx={{ mt: 2 , color: "white"}}
          >
            {isPending ? "Loading..." : "Cancel"}          
          </Button>
        </div>
      )}
      {isServiceProvider && data.service_request.status == 'accepted' && ( 
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <Button
            variant="contained"
            color="success"
      
            onClick={handleMarkAsCompleted}
            fullWidth
            sx={{ mt: 2, color: "white" }}
          >
            {isPending ? "Loading..." : "Mark as Completed"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelService}
            fullWidth
            sx={{ mt: 2, color: "white" }}
          >
            {isPending ? "Loading..." : "Cancel"}          
          </Button>
        </div>
      )}
      {
        !isServiceProvider && data.service_request.status == 'accepted' && (
          <Button variant="contained"
          color="error"
          onClick={handlePayment}
          fullWidth
          sx={{ mt: 2, color: "white" }}>
            Pay Online
          </Button>
        )
      }
      {/* Only render chat button if status is not completed or cancelled */}
      {data.service_request.status !== 'completed' && data.service_request.status !== 'cancelled' && (
        <Button
          variant="contained"
          onClick={() => handleOpenChat(user?.type === "driver" ? 
            data.service_request.provider_id.toString() : 
            (data.service_request.user.user_id ?? 0).toString()
          )}
          fullWidth
          sx={{ mt: 2, color: "white" }}
        > 
          Open Chat        
        </Button>
      )}
    </div>
  );
}
