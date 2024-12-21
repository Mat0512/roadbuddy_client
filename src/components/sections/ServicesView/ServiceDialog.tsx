import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { UseFormRegister, UseFormHandleSubmit } from 'react-hook-form';

interface ServiceData {
  provider_id: number;
  service_name: string;
  price: number;
  description: string;
  image?: File;
}

interface ServiceDialogProps {
  open: boolean;
  onClose: () => void;
    register: UseFormRegister<ServiceData>;
  initialData?: ServiceData;
  onSubmit: (data: ServiceData) => void;
  handleSubmit: UseFormHandleSubmit<ServiceData>;
} 

const ServiceDialog: React.FC<ServiceDialogProps> = ({
  open,
  onClose,
  register,
  initialData,
  onSubmit,
  handleSubmit,
}) => {
  return (
    <Dialog component="form" onSubmit={handleSubmit(onSubmit)} open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Service' : 'Add New Service'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Service Name"
          fullWidth
          {...register('service_name', { required: true })}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          {...register('price', { 
            required: true,
            valueAsNumber: true,
            min: 0 
          })}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          {...register('description', { required: true })}
        />
        <Typography variant="body1" gutterBottom>
          Upload Image
        </Typography>
        <input
          type="file"
          accept="image/*"  
          {...register('image')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceDialog;

