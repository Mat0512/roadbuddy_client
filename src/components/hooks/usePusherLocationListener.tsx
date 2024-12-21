import { useState, useEffect } from 'react';
import pusher from 'configs/pusher';

interface Location {
  latitude: number | null;
  longitude: number | null;
}


const usePusherLocationListener = (requestId: string) => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
      // Initialize Pusher
      // Subscribe to the user's location channel
      const channel = pusher.subscribe(`location.${requestId}`);
  
      // Bind to location update events
      channel.bind('location.updated', (data: { lat: number; long: number }) => {
        console.log("!@#$% location updated")
        setLocation({
          latitude: data.lat,
          longitude: data.long,
        });
      });

      // Handle connection events
      pusher.connection.bind('connected', () => {
        console.log('!!!!!!!!!!!!!!! connected !!!!!!!!!!!!!!!')
        setConnected(true);
      });

      // Handle connection errors
      pusher.connection.bind('error',  (error: { message: string; code: number }) => {
        console.log('!!!!!!!!!!!!!!! error   !!!!!!!!!!!!!!!')
        setError(error.message)
        // Handle the error here
      });
    

    return () => {
      // Cleanup Pusher on unmount
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, [requestId, pusher]);

  return { location, error, connected };
};

export default usePusherLocationListener;
