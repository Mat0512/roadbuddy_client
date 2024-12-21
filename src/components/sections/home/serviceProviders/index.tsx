import { useEffect, useState } from 'react';
import ServiceProviderCard from './ServiceProviderCard';
import axiosInstance from 'configs/axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { parse, isWithinInterval, getDay } from 'date-fns'; // Update import


interface Providers {
  provider_id: number;
  service_provider_name: string;
  contact_info?: string;
  location_lat?: number;
  location_lng?: number;
  business_hours_friday: string | null;
  business_hours_monday: string | null;
  business_hours_saturday: string | null;
  business_hours_sunday: string | null;
  business_hours_thursday: string | null;
  business_hours_tuesday: string | null;
  business_hours_wednesday: string | null;
  logo: string | null;
}
interface Data {
  message: string;
  providers: Providers[];
}

const mockServiceProviderData = [ // Mock data to use when no data is retrieved
  {
    provider_id: 1,
    service_provider_name: 'Mock Service 1',
    contact_info: '123-456-7890',
    location_lat: 12.34,
    location_lng: 56.78,
    business_hours_friday: null,
    business_hours_monday: null,
    business_hours_saturday: null,
    business_hours_sunday: null,
    business_hours_thursday: null,
    business_hours_tuesday: null,
    business_hours_wednesday: null,
    logo: null
  },
  {
    provider_id: 2,
    service_provider_name: 'Mock Service 2',
    contact_info: '987-654-3210',
    location_lat: 23.45,
    location_lng: 67.89,
    business_hours_friday: null,
    business_hours_monday: null,
    business_hours_saturday: null,
    business_hours_sunday: null,
    business_hours_thursday: null,
    business_hours_tuesday: null,
    business_hours_wednesday: null,
    logo: null
  },
];

const isCurrentlyOpen = (provider: Providers): boolean => {
  try {
    const currentDate = new Date();
    const dayOfWeek = getDay(currentDate); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the business hours for the current day
    let businessHours: string | null;
    switch (dayOfWeek) {
      case 0:
        businessHours = provider.business_hours_sunday;
        break;
      case 1:
        businessHours = provider.business_hours_monday;
        break;
      case 2:
        businessHours = provider.business_hours_tuesday;
        break;
      case 3:
        businessHours = provider.business_hours_wednesday;
        break;
      case 4:
        businessHours = provider.business_hours_thursday;
        break;
      case 5:
        businessHours = provider.business_hours_friday;
        break;
      case 6:
        businessHours = provider.business_hours_saturday;
        break;
      default:
        return false;
    }

    // If no business hours for current day, provider is closed
    if (!businessHours) return false;

    const [start, end] = businessHours.split(' - ');
    
    // Parse the business hours
    const startTime = parse(start, 'h:mm aa', currentDate);
    const endTime = parse(end, 'h:mm aa', currentDate);
    
    // Create current time with today's date
    const currentTime = new Date();
    
    return isWithinInterval(currentTime, { start: startTime, end: endTime });
  } catch (error) {
    console.error('Error parsing business hours:', error);
    return false;
  }
};

const getServiceProviders = async (category: string): Promise<Data> => {
  try {
    const { data } = await axiosInstance.get<Data>(`/service-providers?category=${category}`);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371; // Earth's radius in kilometers
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c; // Distance in kilometers
// };

const ServiceProviders = () => {
  const [formattedCategory, setFormattedCategory] = useState<string>('');
  const { category } = useParams<{ category: string }>(); // Extract category from the URL
  // const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
console.log("userLocation", userLocation)

  useEffect(() => {
    if (category) {
      const capitalizedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setFormattedCategory(capitalizedCategory);
    }
  }, [category]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['get-service-providers', category],
    queryFn: () => getServiceProviders(category!),
  });

  // Use mock data if no data is retrieved
  const providers = data?.providers.length ? data.providers : mockServiceProviderData;

  const navigate = useNavigate();

  const handleClick = (id: number) => {
    // Navigate to the "/about" page when the button is clicked
    navigate(`/pages/service-provider/${id}`);
  };

  return (
    <>
      <Typography variant="h4">{formattedCategory}</Typography>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        providers
          // .filter(provider => {
          //   if (!userLocation || !provider.location_lat || !provider.location_lng) return true;
          //   const distance = calculateDistance(
          //     userLocation.lat,
          //     userLocation.lng,
          //     provider.location_lat,
          //     provider.location_lng
          //   );
          //   return distance <= 5; // Filter providers within 5km
          // })
          .map((serviceProviderData) => (
            isCurrentlyOpen(serviceProviderData) ? <ServiceProviderCard
              key={serviceProviderData.provider_id}
              name={serviceProviderData.service_provider_name}
              imageUrl={serviceProviderData.logo || 'https://place.abh.ai/s3fs-public/placeholder/Sunset_400x400.jpeg'}
              onVisit={() => handleClick(serviceProviderData.provider_id)}
            /> : null
          ))
      )}
    </>
  );
};

export default ServiceProviders;
