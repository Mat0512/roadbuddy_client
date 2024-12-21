import { useEffect } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Container,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from 'configs/axios';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'store';
import pusher from 'configs/pusher';

interface ServiceRequestData {
  requestId?: number;
  userId?: number;
  providerId?: number;
  requestDetails?: string; // Replace 'any' with the actual type if known
}

const ScrollArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
}));

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

interface FetchServiceRequestsParams {
  userId: number;
  status: string;
}

interface CancelServiceRequestsParams {
  requestId: number;
  status: string;
}

const fetchServiceRequests = async ({ userId, status }: FetchServiceRequestsParams) => {
  const { data } = await axiosInstance.get<ServiceRequestsResponse>('/service-requests', {
    params: {
      user_id: userId,
      status: status,
    },
  });

  return data;
};

const CancelServiceRequest = async ({ requestId, status }: CancelServiceRequestsParams) => {
  const { data } = await axiosInstance.put<ServiceRequestsResponse>(`/service-requests/${requestId}`, {
   status
  });

  return data;
};

export default function ServiceRequests() {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceRequests', { userId: user?.user_id ?? 0, status: 'pending' }],
    queryFn: () => fetchServiceRequests({ userId: user?.user_id ?? 0, status: 'pending' }),
  });

  const {mutate, isPending } = useMutation({
    mutationKey: ["cancel-request"],
    mutationFn: (requestId: number) => CancelServiceRequest({requestId, status: "cancelled"}),
    onSuccess: () => {
      alert("Request cancelled!")
    },
    onError: () =>{
      alert("Failed to cancel request. Try again")
    }
  })

  useEffect(() => {
    // Subscribe to the service provider's channel
    const channel = pusher.subscribe(`service-provider.${user?.user_id}`);

    channel.bind('service.request.cancelled.user', (data: ServiceRequestData) => {
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

  const handleViewDetails = (id: number) => {
    navigate(`/pages/tracking/${id}`);
  };

    if (isLoading) {
      return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading service requests</Typography>;
  }

  if (!data) {
    return <Typography>No service requests found</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Service Requests
          </Typography>
          {/* <Button variant="contained">New Request</Button> */}
        </Toolbar>
      </AppBar>

      <ScrollArea>
        <Container maxWidth="sm" sx={{ padding: '10px' }}>
          {data?.service_requests?.map((request: ServiceRequest) => (
            <Card
              key={request.request_id}
              sx={{
                mb: 2,
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid grey.300',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    // alignItems: '',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">{request.service_name}</Typography>
                  <StatusChip status={request.status} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {request.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.time}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleViewDetails(request.request_id)}
                >
                  View Details
                </Button>
                <Button size="small" color="error" onClick={() => {mutate(request.request_id)}} disabled={isPending}>
                  {isPending ? "Loading" : "Cancel"}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Container>
      </ScrollArea>
    </Box>
  );
}

function StatusChip({ status }: { status: string }) {
  let color: 'default' | 'warning' | 'success' = 'default';
  let label;

  switch (status) {
    case 'pending':
      color = 'default';
      label = '⏳ Pending';
      break;
    case 'In Progress':
      color = 'warning';
      label = '🚧 In Progress';
      break;
    case 'completed':
      color = 'success';
      label = '✅ Completed';
      break;
    default:
      color = 'default';
      label = '➡️ Other';
  }

  return <Chip label={label} color={color} size="small" />;
}
