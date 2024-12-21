import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import axiosInstance from 'configs/axios';
import ServiceDialog from './ServiceDialog';
import IconifyIcon from 'components/base/IconifyIcon';
import { useStore } from 'store';

interface ServiceData {
  provider_service_id: number;
  provider_id: number;
  service_name: string;
  price: number;
  description: string;
  image?: File;
}

interface ServiceFormData {
  provider_id: number;
  service_name: string;
  price: number;
  description: string;
  image?: File;
}

const Services: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const user = useStore((state) => state.user);
  
  const { register, reset, handleSubmit } = useForm<ServiceFormData>({
    defaultValues: {
      provider_id: user?.user_id || 0,
      service_name: '',
      price: 0,
      description: '',
      image: undefined,
    },
  });

  const { data: services = [], refetch } = useQuery({
    queryKey: ['services', user?.user_id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/provider-services?provider_id=${user?.user_id}`);
      return response.data.data;
    },
  });

  const addServiceMutation = useMutation({
    mutationFn: (data: FormData) => axiosInstance.post('/provider-services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {  
      alert('Service added successfully!');
      refetch();
      handleDialogClose();
    },
    onError: () => {
      alert('Failed to save service. Please try again.');
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      axiosInstance.post(`/provider-services/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    onSuccess: () => {
      alert('Service updated successfully!');
      refetch();
      handleDialogClose();
    },
    onError: () => {
      alert('Failed to update service. Please try again.');
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: number) => axiosInstance.delete(`/provider-services/${id}`),
    onSuccess: () => {
      alert('Service deleted successfully!');
      refetch();
    },
    onError: () => {    
      alert('Failed to delete service. Please try again.');
    },
  });

  const handleAddService = () => {
    setEditingService(null);
    reset(); // Reset form when adding new service
    setDialogOpen(true);
  };

  const handleEditService = (service: ServiceData) => {
    setEditingService(service);
    // Reset form with editing service data
    reset({
      provider_id: service.provider_id,
      service_name: service.service_name,
      price: service.price,
      description: service.description,
    }); 
    setDialogOpen(true);
  };

  const handleDeleteService = (id: number) => {
    deleteServiceMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingService(null);
    reset(); // Reset form on close
  };

  const onSubmit = (data: ServiceFormData) => {

    console.log("data");
    console.log(data);
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof ServiceFormData];
      
      // Skip empty values and empty image objects
      if (!value || (key === 'image' && typeof value === 'object' && Object.keys(value).length === 0)) {
        return;
      }

      // Special handling for image field
      if (key === 'image') {
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
        }
      } else {
        // Handle other fields
        formData.append(key, String(value));
      }
    });

    // Debug logs
    console.log('Form Data Contents:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.provider_service_id, data: formData });
    } else {
      addServiceMutation.mutate(formData);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Button
        sx={{
          width: 200,
          alignSelf: 'end',
          mb: 2,
        }}
        variant="contained"
        color="primary"
        onClick={handleAddService}
      >
        Add New Service
      </Button>
      <List>
        {services?.map((service: ServiceData) => (
          <ListItem
            key={service.provider_service_id}
            sx={{ mb: 1, p: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)', borderRadius: 2 }}
          >
            <ListItemText
              primary={service.service_name}
              secondary={`Php${service.price.toFixed(2)} - ${service.description}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditService(service)}>
                <IconifyIcon icon="material-symbols:edit" />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteService(service.provider_service_id)}
              >
                <IconifyIcon icon="material-symbols:delete" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <ServiceDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        initialData={editingService || undefined}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default Services;
