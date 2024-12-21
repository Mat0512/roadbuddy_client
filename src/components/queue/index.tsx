import { useEffect } from 'react';
import { Dialog, DialogContent, Stack, Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useStore } from 'store';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'configs/axios';
import { useMutation } from '@tanstack/react-query';
import pusher from 'configs/pusher';


interface UpdateServiceRequestsParams {
    requestId: number;
    status: string;
}


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
  

  
const UpdateServiceRequest = async ({ requestId, status }: UpdateServiceRequestsParams) => {
    const { data } = await axiosInstance.put<ServiceRequestsResponse>(`/service-requests/${requestId}`, {
     status
    });
    return data;
  };


export function Queue() {
    const { userId, timeRemaining, reset , requestId } = useStore();
    console.log("userId", userId)
    const navigate = useNavigate()



    const {mutate, isPending } = useMutation({
        mutationKey: ["update-request-queue"],
        mutationFn: ({ requestId, status }: UpdateServiceRequestsParams) => 
        UpdateServiceRequest({ requestId, status }),
        onSuccess: () => {
        alert(`Request Cancelled!`)
        reset()
        },
        onError: () =>{
            alert("Failed to cancel request. Try again")
        }
    })

    
    const handleCancelService = () => {
        mutate({ requestId: Number(requestId), status: 'cancelled' });
    };
   

  
  // Initialize Pusher
    useEffect(() => {
        console.log("pusher connecting ")
        // Subscribe to user-specific channel
        if(!userId) return
        console.log("userId", userId)
        const channel = pusher.subscribe(`user.${userId}`);
        console.log("channel: ", `user.${userId}`)

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

        // Bind first event
        channel.bind('service.request.accepted', (data: { request_id: string }) => {
            console.log("data", data)
            alert("Request Accepted")
            reset();
            navigate('/pages/service-requests-accepted');
        });

        // Bind second event
        channel.bind('service.request.cancel', (data: { request_id: string }) => {
            alert(`Request was cancelled`);
            console.log("data", data)
            const requestId = data.request_id;
            navigate(`/pages/tracking/${requestId}`);   
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`user.${userId}`);
        };
    }, [userId, requestId]);
  
  useEffect(() => {
    if(timeRemaining === 0){
        mutate({ requestId: Number(requestId), status: 'cancelled' });
        reset();
    }
  }, [timeRemaining])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog 
      open={!!requestId} 
      onClose={() => {}}
      maxWidth="xs"
      fullWidth
    >
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <Typography variant="h5" textAlign="center">Waiting for Service Provider</Typography>
          <Box textAlign="center">
            <Typography variant="h3" fontWeight="bold">
              {formatTime(timeRemaining)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimated waiting time
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="error" 
            fullWidth
            onClick={handleCancelService}
            disabled={isPending}
            sx={{
              color: "white",
            }}
          >
            {isPending ? "Cancelling..." : "Cancel Request"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
