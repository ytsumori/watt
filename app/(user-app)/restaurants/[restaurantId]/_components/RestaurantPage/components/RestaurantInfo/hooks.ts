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
          const result = data.rows.at(0)?.elements.at(0)?.duration.text;
          result ? setDuration(result) : console.error("Failed to get duration");
        });
      }
    });
  }, [destination.latitude, destination.longitude]);

  return duration;
};
