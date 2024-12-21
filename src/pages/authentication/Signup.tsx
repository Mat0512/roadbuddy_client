import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'configs/axios';
import { isAxiosError } from 'axios';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuth } from 'hooks/useAuth';
import { useForm } from 'react-hook-form';

import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  username: string;
  type: string;
  license_number?: string;
  vehicle?: string;
  contact_info?: string;
  location_lat?: number;
  location_lng?: number;
  logo?: FileList;
  business_permit_image?: FileList;
  profile_picture?: FileList;
  business_hours_monday?: string;
  business_hours_tuesday?: string;
  business_hours_wednesday?: string;
  business_hours_thursday?: string;
  business_hours_friday?: string;
  business_hours_saturday?: string;
  business_hours_sunday?: string;
  address?: string;
  business_permit_no?: string;
}

const Signup = () => {
  const { register, handleSubmit, setError, formState: { errors }, watch } = useForm<User>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      username: '',
      type: 'driver', // default to driver
      license_number: '',
      vehicle: '',
      contact_info: '',
      location_lat: undefined,
      location_lng: undefined,
      business_hours_monday: '',
      business_hours_tuesday: '',
      business_hours_wednesday: '',
      business_hours_thursday: '',
      business_hours_friday: '',
      business_hours_saturday: '',
      business_hours_sunday: '',
      address: '',
      business_permit_no: '',
    },
  });

  const user = watch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { mutate: login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (userData: User) => {
      // Prepare form data to include file uploads
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        const value = userData[key as keyof User]; // Assert key to be one of User's keys
      
        if (value) {
          if (value instanceof FileList) {
            // If value is a FileList, append files individually
            Array.from(value).forEach((file) => {
              formData.append(key, file);
            });
          } else {
            // Otherwise, convert value to a string (handles string | number)
            formData.append(key, String(value));
          }
        }
      });

      const response = await axios.post('/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Signup successful:', data);
      // Trigger login with username and password
      login({ username: user.username, password: user.password });
      // Handle successful signup (e.g., redirect or show a success message)
    },
    onError: (error) => {
      console.error('Signup failed:', error);
      setErrorMessage('Signup failed. Please try again.');
    },
  });

  const onSubmit = async (data: User) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const apiErrors = (error.response?.data as { errors: Record<string, string> })?.errors;
        for (const key in apiErrors) {
          setError(key as keyof User, { type: 'manual', message: apiErrors[key] });
        }
      } else if (error instanceof Error) {
        console.error('An unexpected error occurred:', error.message);
      }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Sign Up
      </Typography>
      {errorMessage && (
        <Typography color="error" align="center">
          {errorMessage}
        </Typography>
      )}
      <Stack component="form" mt={3} onSubmit={handleSubmit(onSubmit)} direction="column" gap={2}>
        <TextField
          id="name"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          variant="filled"
          placeholder="Your Name"
          fullWidth
          required
        />
        <TextField
          id="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          variant="filled"
          placeholder="Your Email"
          fullWidth
          required
        />
        <TextField
          id="phone"
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          variant="filled"
          placeholder="Your Phone"
          fullWidth
          required
        />
        <TextField
          id="username"
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          variant="filled"
          placeholder="Your Username"
          fullWidth
          required
        />
        <TextField
          id="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          type={showPassword ? 'text' : 'password'}
          variant="filled"
          placeholder="Your Password"
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <IconifyIcon icon="clarity:eye-hide-line" /> : <IconifyIcon icon="mdi:eye-outline" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="password_confirmation"
          {...register('password_confirmation')}
          error={!!errors.password_confirmation}
          helperText={errors.password_confirmation?.message}
          type={showPassword ? 'text' : 'password'}
          variant="filled"
          placeholder="Confirm Your Password"
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <IconifyIcon icon="clarity:eye-hide-line" /> : <IconifyIcon icon="mdi:eye-outline" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="type"
          {...register('type')}
          select
          variant="filled"
          fullWidth
          required
          SelectProps={{
            native: true,
          }}
        >
          <option value="driver">Driver</option>
          <option value="service_provider">Service Provider</option>
        </TextField>
        {user.type === 'driver' && (
          <>
            <TextField
              id="license_number"
              {...register('license_number')}
              variant="filled"
              placeholder="Your License Number"
              fullWidth
              required
            />
            <TextField
              id="vehicle"
              {...register('vehicle')}
              variant="filled"
              placeholder="Your Vehicle"
              fullWidth
              required
            />
          </>
        )}
        {user.type === 'service_provider' && (
          <>
            <TextField
              id="contact_info"
              {...register('contact_info')}
              variant="filled"
              placeholder="Contact Info"
              fullWidth
              required
            />
            <TextField
              id="location_lat"
              {...register('location_lat')}
              variant="filled"
              placeholder="Latitude"
              fullWidth
              required
            />
            <TextField
              id="location_lng"
              {...register('location_lng')}
              variant="filled"
              placeholder="Longitude"
              fullWidth
              required
            />
            <TextField
              id="address"
              {...register('address')}
              variant="filled"
              placeholder="Business Address"
              fullWidth
              required
            />
            <TextField
              id="business_hours_monday"
              {...register('business_hours_monday')}
              variant="filled"
              placeholder="Monday Business Hours (e.g., 9:00 AM - 5:00 PM)"
              fullWidth
              required
            />
            <TextField
              id="business_hours_tuesday"
              {...register('business_hours_tuesday')}
              variant="filled"
              placeholder="Tuesday Business Hours"
              fullWidth
              required
            />
            <TextField
              id="business_hours_wednesday"
              {...register('business_hours_wednesday')}
              variant="filled"
              placeholder="Wednesday Business Hours"
              fullWidth
              required
            />
            <TextField
              id="business_hours_thursday"
              {...register('business_hours_thursday')}
              variant="filled"
              placeholder="Thursday Business Hours"
              fullWidth
              required
            />
            <TextField
              id="business_hours_friday"
              {...register('business_hours_friday')}
              variant="filled"
              placeholder="Friday Business Hours"
              fullWidth
              required
            />
            <TextField
              id="business_hours_saturday"
              {...register('business_hours_saturday')}
              variant="filled"
              placeholder="Saturday Business Hours"
              fullWidth
              required
            />
            <TextField
              id="business_hours_sunday"
              {...register('business_hours_sunday')}
              variant="filled"
              placeholder="Sunday Business Hours"
              fullWidth
              required
            />
            <TextField
              id="business_permit_no"
              {...register('business_permit_no')}
              variant="filled"
              label="Business Permit Number"
              placeholder="Enter your business permit number"
              fullWidth
              required
            />
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Required Documents
            </Typography>

            <Stack spacing={2}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Business Logo
                </Typography>
                <input
                  type="file"
                  {...register('logo')}
                  accept="image/*"
                  style={{ 
                    display: 'block',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Business Permit
                </Typography>
                <input
                  type="file"
                  {...register('business_permit_image')}
                  accept="image/*"
                  style={{ 
                    display: 'block',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                />
              </Stack>
            </Stack>
          </>
        )}
        <Button type="submit" variant="contained" size="medium" fullWidth>
          Sign Up
        </Button>
      </Stack>
      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Already have an account? <Link href={paths.signin}>Signin</Link>
      </Typography>
    </>
  );
};

export default Signup;
