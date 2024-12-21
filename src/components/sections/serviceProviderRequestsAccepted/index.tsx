import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  TextField,
  Box,
  Stack,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import { useStore } from 'store';
import axiosInstance from 'configs/axios';
import ServiceProviderNotifications from 'components/notification/ServiceProviderNotifications';
interface ServiceRequest {
  request_id: number;
  service_id: number;
  status: 'pending' | 'in-progress' | 'completed';
  request_time: string;
  rating?: number | { rating: number };
}
import pusher from 'configs/pusher';

interface ServiceRequestResponse {
  service_requests: ServiceRequest[];
}
// Styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

interface ServiceRequestData {
  requestId?: number;
  userId?: number;
  providerId?: number;
  requestDetails?: string; // Replace 'any' with the actual type if known
}

// Add this API function (you might want to move it to a separate api.ts file)
const fetchServiceRequests = async (providerId: number): Promise<ServiceRequestResponse> => {
  const { data } = await axiosInstance.get<ServiceRequestResponse>(`/service-requests`, {
    params: {
      provider_id: providerId,
      status: 'accepted',
    },
  });
  return data;
};

export default function ServiceProviderRequestsAccepted() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useStore();

  const { data, isLoading, error } = useQuery<ServiceRequestResponse, Error>({
    queryKey: ['serviceRequests', user?.user_id],
    queryFn: () => {
      if (!user?.user_id) throw new Error('User ID is required');
      return fetchServiceRequests(user.user_id);
    },
    enabled: !!user?.user_id,
  });

  useEffect(() => {
    // Initialize Pusher

    // Subscribe to the service provider's channel
    const channel = pusher.subscribe(`service-provider.${user?.user_id}`);
    // const channel = pusher.subscribe(`service-provider.`);

    channel.bind('service.request.created', (data: ServiceRequestData) => {
      console.log(data);
      const requestId = data.requestId;
      alert(`New service request from User`);
      navigate(`/pages/tracking/${requestId}`);
    });

    channel.bind('service.request.cancelled', (data: ServiceRequestData) => {
      alert(`Request was cancelled`);
      const requestId = data.requestId;
      navigate(`/pages/tracking/${requestId}`);
    });


    pusher.connection.bind('connected', () => {
      console.log('Pusher connected');
    });

    // Log disconnection
    pusher.connection.bind('disconnected', () => {
      console.log('Pusher disconnected');
    });

    // Log any errors
    pusher.connection.bind('error', () => {
      console.error('Pusher connection error:');
    });
    // Listen for the 'service.request.created' event

    // Clean up on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user?.user_id]);

  const requests = data?.service_requests ?? [];

  const filteredRequests = requests.filter(
    (request) =>
      request.request_id.toString().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (requestId: number) => {
    console.log('hello');
    navigate(`/pages/tracking/${requestId}`);
  };

  // Add loading and error states
  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
        <Typography color="error">Error loading requests</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <ServiceProviderNotifications providerId={user?.user_id ?? null} />

      <Typography variant="h4" gutterBottom>
        In Progress Requests
      </Typography>
      <StyledTextField
        fullWidth
        variant="outlined"
        label="Search requests"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Grid container spacing={2}>
        {filteredRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.request_id}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" component="div">
                    Request #{request.request_id}
                  </Typography>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </Stack>
                <Typography color="text.secondary" gutterBottom>
                  Service ID: {request.service_id}
                </Typography>
                {request.rating && (
                  <Typography variant="body2">Rating: {typeof request.rating === 'object' ? request.rating.rating : request.rating}</Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => handleViewDetails(request.request_id)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
