import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CardMedia,
  Button,
  Container,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import axiosInstance from 'configs/axios';
import Map from 'components/common/Map/v2/Map';
import { useStore } from 'store';
import useGeolocation from 'components/hooks/useGeolocation';

interface Service {
  provider_service_id: number;
  provider_id: number;
  service_name: string;
  price: number;
  description: string;
  ratings: number | null;
}

const getServiceProvider = async (id: string | undefined) => {
  try {
    const { data } = await axiosInstance.get(`/service-providers/${id}`);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const ServiceProviderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setRequestId, setUserId, startTimer, setIsActive } = useStore();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<{ id: number; name: string; price: number } | null>(null);
  const {location} = useGeolocation()
  const user = useStore(state => state.user)

  const { data, error, isLoading } = useQuery({
    queryKey: ['serviceProvider', id],
    queryFn: () => getServiceProvider(id),
  });

  const createServiceRequest = async (payload: {
    user_id: number | undefined;
    provider_id: number;
    service_id: number;
    status: string;
    location_lat: number;
    location_lng: number;
  }) => {
    const { data } = await axiosInstance.post('/service-requests', payload);
    return data;
  };

  const mutation = useMutation({
    mutationFn: createServiceRequest,
    onSuccess: (data) => {
      console.log("data at create service request", data)
      console.log("data.request", data.service_request.service_id)
      console.log("data.service_request.user_id", data.service_request.user_id)

      alert('Service request created successfully');
      startTimer();
      setRequestId(data.service_request.request_id);
      setUserId(data.service_request.user_id);
      setIsActive(true);
      handleCloseModal();

      navigate("/")
      // Optionally show success message
    },
    onError: (error) => {
      handleCloseModal();
      // Optionally show error message
      console.error('Error creating service request:', error);
      alert('Error creating service request');
    },
  });

  const handleCreateServiceRequest = async () => {
    if (!selectedService || selectedService.price === undefined) {
      alert('Selected service or price is not defined. Please try again.');
      return;
    }

    const payload = {
      user_id: user?.user_id,
      provider_id: serviceProvider.provider_id,
      service_id: selectedService.id,
      status: 'pending',
      location_lat: location?.lat || 0,
      location_lng: location?.long || 0,
    };

    mutation.mutate(payload);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  if (!data) return null;

  const serviceProvider = data.provider;

  const handleOpenModal = (serviceId: number, serviceName: string, price: number) => {
    setSelectedService({ id: serviceId, name: serviceName, price });
    setOpenModal(true);
  
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
    
  };

  const baseLocation = {
    lat: serviceProvider.location_lat,
    long: serviceProvider.location_lng,
  };

  return (
    <Container maxWidth="sm">
        <Typography variant="h4" component="div" sx={{ mt: 2, mb: 1 }}>
          {serviceProvider.service_provider_name}
        </Typography>
      <Card sx={{ p: 0 }}>
        <CardMedia
          component="img"
          height="200"
          image={serviceProvider.logo || "https://place.abh.ai/s3fs-public/placeholder/DSC_0057_400x400.jpeg"}
          alt={serviceProvider.name}
        />

        <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
          Services Offered:
        </Typography>
        <Grid container spacing={2}>
        {serviceProvider.services.map((service: Service) => (
          <Grid item xs={12} sm={6} md={4} key={service.provider_service_id}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6">{service.service_name}</Typography>
                <Typography variant="body2">{service.description}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Price: PHP{service.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal(service.provider_service_id, service.service_name, service.price)}
                >
                  Avail Service
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
        <CardContent>
          <Typography variant="h5" component="div" mt={1}>
            {serviceProvider.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact: {serviceProvider.contact_info}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Business Permit No: {serviceProvider.business_permit_no}
          </Typography>
          {serviceProvider.business_permit && (
            <Button
              variant="text"
              color="primary"
              onClick={() => window.open(serviceProvider.business_permit, '_blank')}
              sx={{ mt: 1 }}
            >
              View Business Permit
            </Button>
          )}
        </CardContent>
      </Card>
      <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>Service Hours</Typography>

      <Card sx={{border: '1px solid #e0e0e0', borderRadius: '10px', mt: 2}}>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">Monday: {serviceProvider.business_hours_monday}</Typography>
            <Typography variant="body2">Tuesday: {serviceProvider.business_hours_tuesday}</Typography>
            <Typography variant="body2">Wednesday: {serviceProvider.business_hours_wednesday}</Typography>
            <Typography variant="body2">Thursday: {serviceProvider.business_hours_thursday}</Typography>
            <Typography variant="body2">Friday: {serviceProvider.business_hours_friday}</Typography>
            <Typography variant="body2">Saturday: {serviceProvider.business_hours_saturday}</Typography>
            <Typography variant="body2">Sunday: {serviceProvider.business_hours_sunday}</Typography>
          </Stack>
        </CardContent>
      </Card>

      

      <Grid container >
        <Card sx={{ mb: 2, width: '100%', height: 'auto' }}>
          <CardHeader title="Location" />
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '300px', marginTop: '16px', position: 'relative' }}>
                {baseLocation.lat && baseLocation.long && <Map baseLocation={baseLocation} />}
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Avail Service</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Do you want to avail {selectedService?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            color="error" 
            sx={{color: 'white'}} 
            onClick={handleCloseModal}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            sx={{color: 'white'}} 
            onClick={handleCreateServiceRequest}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Creating...' : 'Avail'}
          </Button>
        </DialogActions>
      </Dialog>

     
    </Container>
  );
};

export default ServiceProviderView;
