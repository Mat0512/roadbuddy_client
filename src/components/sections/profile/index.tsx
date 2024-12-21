'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'configs/axios';
import {
  Button,
  TextField,
  // Avatar,
  Card,
  CardContent,
  // CardHeader,
  Typography,
} from '@mui/material';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBusinessTime,
} from 'react-icons/fa';
import { useStore } from 'store';

// Add type definitions for API response
interface UpdateProfileResponse {
  message: string;
  user: {
    user_id: number;
    name: string;
    email: string;
    phone: string;
    type: string;
    username: string;
  };
}

// Type for the request payload
interface UpdateProfileRequest {
  name: string;
  phone?: string;
  provider_details?: ServiceProviderDetails;
}

// Add new interfaces
interface ServiceProviderDetails {
  contact_info: string;
  address: string;
  location_lat: number;
  location_lng: number;
  business_permit_no?: string;
  business_hours_monday?: string;
  business_hours_tuesday?: string;
  business_hours_wednesday?: string;
  business_hours_thursday?: string;
  business_hours_friday?: string;
  business_hours_saturday?: string;
  business_hours_sunday?: string;
}

// Add new interface for the API response
interface ServiceProviderResponse {
  message: string;
  provider: {
    provider_id: number;
    contact_info: string;
    business_hours_monday: string | null;
    business_hours_tuesday: string | null;
    business_hours_wednesday: string | null;
    business_hours_thursday: string | null;
    business_hours_friday: string | null;
    business_hours_saturday: string | null;
    business_hours_sunday: string | null;
    business_permit_no: string;
    location_lat: number;
    location_lng: number;
    address: string | null;
    // ... other fields
  };
}

// Update the API function with types
const updateUserProfile = async (
  userData: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  const response = await axios.put<UpdateProfileResponse>(
    'http://127.0.0.1:8001/api/auth/user/update',
    userData,
  );
  return response.data;
};

// First, add the API function at the top with other API functions
const updateServiceProvider = async (
  providerId: number,
  providerData: ServiceProviderDetails
): Promise<ServiceProviderResponse> => {
  const response = await axios.put<ServiceProviderResponse>(
    `/service-providers/${providerId}`,
    providerData
  );
  return response.data;
};


export default function ServiceProviderProfile() {
  const { user, updateUser } = useStore();
  
  // Add useQuery to fetch provider details
  const { data: providerData } = useQuery<ServiceProviderResponse>({
    queryKey: ['serviceProvider', user?.user_id],
    queryFn: async () => {
      const response = await axios.get(`/service-providers/${user?.user_id}`);
      return response.data;
    },
    enabled: user?.type === 'service_provider',
  });

  const [profile, setProfile] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
  });
  const [providerDetails, setProviderDetails] = useState<ServiceProviderDetails>({
    contact_info: '',
    address: '',
    location_lat: 0,
    location_lng: 0,
    business_permit_no: '',
    business_hours_monday: '',
    business_hours_tuesday: '',
    business_hours_wednesday: '',
    business_hours_thursday: '',
    business_hours_friday: '',
    business_hours_saturday: '',
    business_hours_sunday: '',
  });

  // Add a new mutation for service provider updates
    const updateProviderMutation = useMutation<
    ServiceProviderResponse,
    Error,
    ServiceProviderDetails
    >({
    mutationFn: (data) => {
      if (!user?.user_id) throw new Error('User ID is required');
      return updateServiceProvider(user.user_id, data);
    },
    onSuccess: (data) => {
      alert(data.message);
    },
    onError: (error) => {
      console.error('Error updating service provider:', error);
      alert('Failed to update business details. Please try again.');
    },
    });

    // Add a new handler for the business details form
    const handleBusinessDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProviderMutation.mutate(providerDetails);
} ;


  // Add useEffect to set provider details when data is fetched
  useEffect(() => {
    if (providerData?.provider) {
      const provider = providerData.provider;
      setProviderDetails({
        contact_info: provider.contact_info || '',
        address: provider.address || '',
        location_lat: provider.location_lat || 0,
        location_lng: provider.location_lng || 0,
        business_permit_no: provider.business_permit_no || '',
        business_hours_monday: provider.business_hours_monday || '',
        business_hours_tuesday: provider.business_hours_tuesday || '',
        business_hours_wednesday: provider.business_hours_wednesday || '',
        business_hours_thursday: provider.business_hours_thursday || '',
        business_hours_friday: provider.business_hours_friday || '',
        business_hours_saturday: provider.business_hours_saturday || '',
        business_hours_sunday: provider.business_hours_sunday || '',
      });
    }
  }, [providerData]);

  const updateProfileMutation = useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // Update local store with the complete user data from response
      updateUser(data.user);
      alert(data.message);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const result = e.target?.result;
  //       if (typeof result === 'string') {
  //         setProfile((prev) => ({ ...prev, profilePicture: result }));
  //       }
  //     };
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: UpdateProfileRequest = {
      name: `${profile.firstName} ${profile.lastName}`,
      phone: profile.phone,
    };

    if (user?.type === 'service_provider') {
      payload.provider_details = providerDetails;
    }

    updateProfileMutation.mutate(payload);
  };

  // Add handler for provider details
  const handleProviderDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProviderDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ maxWidth: '600px', padding: '16px' }}>
      <Typography variant="h5" component="h2">
        Service Provider Profile
      </Typography>

      <Card sx={{ margin: 'auto' }}>
        {/* <CardHeader
          title={
       
          }
        /> */}
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <FaUser style={{ marginRight: '8px' }} />,
                  }}
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <FaUser style={{ marginRight: '8px' }} />,
                  }}
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  label="Username"
                  name="username"
                  value={profile.username}
                  disabled
                  InputProps={{
                    startAdornment: <FaUser style={{ marginRight: '8px' }} />,
                  }}
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                  InputProps={{
                    startAdornment: <FaEnvelope style={{ marginRight: '8px' }} />,
                  }}
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <FaPhone style={{ marginRight: '8px' }} />,
                  }}
                  fullWidth
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '16px' }}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Service Provider Details Section */}
      {user?.type === 'service_provider' && (
        <Card sx={{ margin: 'auto', marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Business Details
            </Typography>
            <form onSubmit={handleBusinessDetailsSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TextField
                  label="Business Permit Number"
                  name="business_permit_no"
                  value={providerDetails.business_permit_no}
                  onChange={handleProviderDetailsChange}
                  InputProps={{
                    startAdornment: <FaBusinessTime style={{ marginRight: '8px' }} />,
                  }}
                  fullWidth
                />
                <TextField
                  label="Contact Information"
                  name="contact_info"
                  value={providerDetails.contact_info}
                  onChange={handleProviderDetailsChange}
                  InputProps={{
                    startAdornment: <FaPhone style={{ marginRight: '8px' }} />,
                  }}
                  fullWidth
                  required
                />
                <TextField
                  label="Address"
                  name="address"
                  value={providerDetails.address}
                  onChange={handleProviderDetailsChange}
                  InputProps={{
                    startAdornment: <FaMapMarkerAlt style={{ marginRight: '8px' }} />,
                  }}
                  fullWidth
                  required
                />
                
                <Typography variant="subtitle1" gutterBottom>
                  Business Hours
                </Typography>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <TextField
                    key={day}
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                    name={`business_hours_${day}`}
                    value={providerDetails[`business_hours_${day}` as keyof ServiceProviderDetails]}
                    onChange={handleProviderDetailsChange}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    fullWidth
                  />
                ))}
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={updateProviderMutation.isPending}
                >
                  {updateProviderMutation.isPending ? 'Updating...' : 'Update Business Details'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
