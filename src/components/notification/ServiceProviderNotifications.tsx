// ServiceProviderNotifications.js
import { useEffect } from 'react';
import pusher from 'configs/pusher';
interface ServiceProviderNotificationsProps {
  providerId: number | null; // Specify the type for providerId
}

// Define the interface for the data structure
interface ServiceRequestData {
  requestId: number;
  userId: number;
  requestDetails: string; // Replace 'any' with the actual type if known
}

function ServiceProviderNotifications({ providerId }: ServiceProviderNotificationsProps) {
  useEffect(() => {
    // Initialize Pusher

    // Subscribe to the service provider's channel
    const channel = pusher.subscribe(`service-provider.${providerId}`);

    // Listen for the 'service.request.created' event
    channel.bind('service.request.created', (data: ServiceRequestData) => {
      console.log('New service request:', data);
      alert(`New service request from User`);
    });

    // Clean up on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [providerId]); 

  return <></>;
}

export default ServiceProviderNotifications;
