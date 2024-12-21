import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Modal, TextField, Typography, Button } from '@mui/material';
import axios from 'configs/axios';
import { useMutation } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useStore } from 'store';

interface Props {
  open: boolean;
  handleCloseModal: () => void;
  serviceId: number;
  selectedService: string;
}

interface FormData {
  name: string;
  phone: string;
  user_id: number;
  provider_id: number;
  service_id: number;
  status: string;
  location_lat: number | null;
  location_lng: number | null;
}

const RequestForm: React.FC<Props> = ({ open, handleCloseModal, serviceId, selectedService }) => {
  const user = useStore((state) => state.user);
  const { id: storeId } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [location, setLocation] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    // Get user's location when the component mounts
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setValue('location_lat', position.coords.latitude);
        setValue('location_lng', position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
    );
  }, [setValue]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: FormData) => {
      return axios.post('/service-requests', data);
    },
    onSuccess: () => {
      handleCloseModal();
      alert('Service request submitted successfully!');
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    data.user_id = user?.user_id ?? 0;
    data.provider_id = parseInt(storeId || '10', 10);
    data.service_id = serviceId;
    data.status = 'pending';
    data.location_lat = location.lat;
    data.location_lng = location.lng;

    mutate(data);
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 320,
          width: 1,
          bgcolor: 'background.paper',
          borderRadius: '5px',
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Request {selectedService}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            An error occurred while submitting your request. Please try again.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Your Name"
            {...register('name', { required: 'Name is required' })}
            fullWidth
            required
            sx={{ mb: 1, py: 1 }}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Your Phone Number"
            {...register('phone', { required: 'Phone number is required' })}
            fullWidth
            required
            sx={{ mb: 1, py: 1 }}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <Button type="submit" variant="contained" color="primary" disabled={isPending}>
            {isPending ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
          </Button>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            color="secondary"
            sx={{ ml: 2 }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default RequestForm;
