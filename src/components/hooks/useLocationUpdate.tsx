import { useState, useEffect, useCallback } from 'react';
import axios from 'configs/axios';

interface Location {
  latitude: number | null;
  longitude: number | null;
}

const useLocationUpdater = (requestId: string | undefined, isServiceProvider: boolean) => {
  const [location, setLocation] = useState<Location>({ latitude: null, longitude: null });
  const [error, setError] = useState<string | null>(null);

  // Function to update the location on the server
  const updateLocationToServer = useCallback(() => {
    if (!requestId || location.latitude === null || location.longitude === null) return;

    axios
      .post('/service-requests/location', {
        requestId,
        latitude: location.latitude,
        longitude: location.longitude,
      })
      .then((response) => {
        console.log(response)
        console.log('Location updated successfully');
      })
      .catch((error) => {
        console.error('Error updating location:', error);
        setError('Failed to update location');
      });
  }, [requestId, location]);

  // Function to get the current location from the browser
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

  // Effect hook to get the initial location and set interval for updates (only if service provider)
  useEffect(() => {
    if (isServiceProvider && requestId) {
      getCurrentLocation(); // Get the location immediately
      const interval = setInterval(() => {
        getCurrentLocation(); // Update the location every 10 seconds
      }, 15000); // 10000ms = 10 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [isServiceProvider, requestId, getCurrentLocation]);

  // Effect hook to send location to the server (only if service provider)
  useEffect(() => {
    if (isServiceProvider) {
      updateLocationToServer();
    }
  }, [isServiceProvider, location, updateLocationToServer]); // Only update when location changes

  return { location, error };
};

export default useLocationUpdater;
