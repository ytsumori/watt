import { useState, useEffect } from "react";

export const useGetCurrentPosition = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | undefined>();
  const [error, setError] = useState<GeolocationPositionError | undefined>(undefined);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        setError(error);
      }
    );
  }, []);

  return { position, error };
};
