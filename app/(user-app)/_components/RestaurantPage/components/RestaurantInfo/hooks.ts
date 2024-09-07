import { useState, useEffect } from "react";
import { getDistanceMatrix } from "./action";

export const useGetDuration = (destination: { latitude?: number; longitude?: number }) => {
  const [duration, setDuration] = useState<string | undefined>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      if (destination.latitude && destination.longitude) {
        const dest = { latitude: destination.latitude, longitude: destination.longitude };
        await getDistanceMatrix({
          destination: dest,
          origin: { latitude: position.coords.latitude, longitude: position.coords.longitude }
        }).then((data) => {
          setDuration(data.rows[0].elements[0].duration.text);
        });
      }
    });
  }, [destination.latitude, destination.longitude]);

  return duration;
};
