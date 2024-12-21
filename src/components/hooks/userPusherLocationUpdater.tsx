import { useEffect, useState, useCallback } from 'react';
import pusher from 'configs/pusher';
// Define types for the hook's parameters and return values


interface Location {
  latitude: number | null;
  longitude: number | null;
}

const usePusherLocationUpdater = (
    isServiceProvider: boolean,
    requestId: string,
    ) => {
  const [location, setLocation] = useState<Location>({ latitude: null, longitude: null });
  const [error, setError] = useState<string | null>(null);

  const updateLocationToPusher = useCallback(() => {
    if (isServiceProvider && location.latitude !== null && location.longitude !== null) {

      const channel = pusher.subscribe(`location.${requestId}`);
      channel.trigger('client-location-updated', {
        lat: location.latitude,
        long: location.longitude,
      });

    }
  }, [isServiceProvider, location, requestId]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  useEffect(() => {
    if (isServiceProvider) {
      getCurrentLocation();
      const interval = setInterval(() => {
        getCurrentLocation();
      }, 10000); // Update location every 10 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [isServiceProvider, getCurrentLocation]);

  useEffect(() => {
    updateLocationToPusher();
  }, [location, updateLocationToPusher]);

  return { location, error };
};

export default usePusherLocationUpdater;
