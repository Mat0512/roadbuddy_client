import { useState, useEffect } from 'react';

interface Location {
    lat: number | null;
    long: number | null;
}

const useGeolocation = () => {
  const [location, setLocation] = useState<Location>({ lat: null, long: null });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // If geolocation is available in the browser
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, long: longitude });
          setLoading(false);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []); // Empty dependency array means this runs once when the component mounts

  return { location, error, loading };
};

export default useGeolocation;

