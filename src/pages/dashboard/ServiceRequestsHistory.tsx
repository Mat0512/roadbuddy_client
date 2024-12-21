  import { useEffect, useState } from 'react';
  import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
  import { useForm, Controller } from 'react-hook-form';
  import { TextField } from '@mui/material';
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
  import { useMutation, useQuery } from '@tanstack/react-query';
  import axiosInstance from 'configs/axios';
  import { useNavigate } from 'react-router-dom';
  import { useStore } from 'store';
  import pusher from 'configs/pusher';

  interface ServiceRequestData {
    requestId?: number;
    userId?: number;
    providerId?: number;
    requestDetails?: string;
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
    user_id: number;
    provider_id: number;
    type: string;
    location: string;
    status: "accepted" | "pending" | "cancelled" | "completed";
    time: string;
    service_name: string;
    rating?: {
      rating_id: number;
      rating: number;
      comment: string;
    };
  }

  interface ServiceRequestsResponse {
    message: string;
    service_requests: ServiceRequest[];
  }

  interface FetchServiceRequestsParams {
    userId: number;
    status: string;
  }

  const fetchServiceRequests = async ({ userId }: FetchServiceRequestsParams) => {
    const { data } = await axiosInstance.get<ServiceRequestsResponse>('/service-requests', {
      params: {
        user_id: userId,
      },
    });

    return data;
  };


  interface RatingPayload {
    driver_id: string;
    service_provider_id: string;
    request_id: string;
    rating: number;
    comment: string;
  }

  interface RatingResponse {
    message: string;
    data: {
      driver_id: number;
      service_provider_id: number;
      request_id: number;
      rating: number;
      comment: string;
      rating_id: number;
    };
  }

  // Define the function to send a rating
  async function sendRating(payload: RatingPayload) {
      const data = await axiosInstance.post<RatingResponse>('/rating', payload);
      return data;
  }
  interface FeedbackFormData {
    driver_id: string;
    service_provider_id: string;
    request_id: string;
    rating: number;
    comment: string;
  }

  const FeedbackForm = ({ serviceRequest , handleCloseDialog}: { serviceRequest: ServiceRequest | null, handleCloseDialog: () => void  }) => {
    const { control, handleSubmit } = useForm<FeedbackFormData>({
      defaultValues: {
        driver_id: serviceRequest?.user_id?.toString() ?? '',
        service_provider_id: serviceRequest?.provider_id?.toString() ?? '',
        rating: 3,
        comment: ''
      }
    });

    const {mutate, isPending} = useMutation({
      mutationKey: ["cancel-request"],
      mutationFn: ({driver_id, service_provider_id, request_id, comment, rating}: FeedbackFormData) => sendRating({driver_id, service_provider_id, rating, request_id, comment}),
      onSuccess: () => {
        alert("Feedback submitted!")
        handleCloseDialog();
      },
      onError: () =>{
        alert("Failed to cancel request. Try again")
      }
    })

    const onSubmitHandler = (data: FeedbackFormData) => {
      const payload = {
        ...data,
        request_id: serviceRequest?.request_id?.toString() || '0',
        driver_id: serviceRequest?.user_id?.toString() || '0',
        service_provider_id: serviceRequest?.provider_id?.toString() || '0',
      };
      console.log(payload);
      mutate(payload);
    };

    return (
      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{
        paddingTop: 2,
        display: 'flex',
        flexDirection: 'column', gap: 2,
        maxWidth: 500,
        width: "280px"
      }}>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Rating (1-5)"
              type="number"
              variant="outlined"
              required
              fullWidth
              inputProps={{ min: 1, max: 5 }}
            />
          )}
        />
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Comment"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
            />
          )}
        />
        <Button variant="contained" type="submit" disabled={isPending}>
          {isPending? "Loading..." : "Submit Feedback"}
        </Button>
      </Box>
    );
  };

  export default function ServiceRequestsHistory() {
    const user = useStore((state) => state.user);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedServiceRequest, setSelectedServiceRequest] = useState<ServiceRequest | null>(null);

    const { data, isLoading, error } = useQuery({
      queryKey: ['serviceRequests', { userId: user?.user_id ?? 0, status: 'completed' }],
      queryFn: () => fetchServiceRequests({ userId: user?.user_id ?? 0, status: 'completed' }),
    });

    useEffect(() => {
      const channel = pusher.subscribe(`service-provider.${user?.user_id}`);
      channel.bind('service.request.cancelled', (data: ServiceRequestData) => {
        alert(`Request was cancelled`);
        const requestId = data.requestId;
        navigate(`/pages/tracking/${requestId}`);
      });

      pusher.connection.bind('connected', () => {
        console.log('Pusher connected');
      });

      pusher.connection.bind('disconnected', () => {
        console.log('Pusher disconnected');
      });

      pusher.connection.bind('error', () => {
        console.error('Pusher connection error:');
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }, [user?.user_id]);

    const handleViewDetails = (id: number) => {
      navigate(`/pages/tracking/${id}`);
    };

    const handleOpenFeedbackDialog = (request: ServiceRequest) => {
      setSelectedServiceRequest(request);
      setOpenDialog(true);  
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
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
              ServiceRequestHistory
            </Typography>
          </Toolbar>
        </AppBar>

        <ScrollArea>
          <Container maxWidth="sm" sx={{ padding: '10px' }}>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Submit Feedback</DialogTitle>
              <DialogContent>
                {selectedServiceRequest && (
                  <FeedbackForm serviceRequest={selectedServiceRequest} handleCloseDialog={handleCloseDialog}/>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
              </DialogActions>
            </Dialog>

            {data?.service_requests
              ?.filter((request: ServiceRequest) => request.status !== 'pending' && request.status !== 'accepted')
              .map((request: ServiceRequest) => (
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
                        gap: 1,
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
                    
                    {request.rating && (
                      <Box sx={{ mt: 2, borderTop: 1, borderColor: 'divider', pt: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Feedback
                        </Typography>
                        <Typography variant="body2">
                          Rating: {request.rating.rating}/5
                        </Typography>
                        {request.rating.comment && (
                          <Typography variant="body2" color="text.secondary">
                            "{request.rating.comment}"
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleViewDetails(request.request_id)}
                    >
                      View Details
                    </Button>
                    {!request.rating && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenFeedbackDialog(request)}
                      >
                        Feedback
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))}
          </Container>
        </ScrollArea>
      </Box>
    );
  }

  const StatusChip = ({ status }: { status: 'accepted' | 'pending' | 'cancelled' | 'completed' }) => {
    // Define the status colors with strict values matching the valid `Chip` color types
    const statusColors: { [key in 'accepted' | 'pending' | 'cancelled' | 'completed']: 'success' | 'warning' | 'error' } = {
      completed: 'success',
      pending: 'warning',
      cancelled: 'error',
      accepted: 'success'
    };

    return <Chip label={status} color={statusColors[status]} />;
  };

