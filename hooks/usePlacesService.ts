import { useCallback, useEffect, useRef, useState } from "react";

export function usePlacesService() {
  const ref = useRef<HTMLDivElement>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService>();

  const fetchPlaceDetails = useCallback(
    (placeId: string): Promise<google.maps.places.PlaceResult> => {
      return new Promise((resolve, reject) => {
        if (!placesService) {
          return reject("Places service is not initialized");
        }

        placesService.getDetails(
          {
            placeId: placeId,
            fields: ["place_id", "geometry"],
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              resolve(place);
            } else {
              reject();
            }
          }
        );
      });
    },
    [placesService]
  );

  useEffect(() => {
    if (!placesService && ref.current) {
      setPlacesService(new google.maps.places.PlacesService(ref.current));
    }
  }, [placesService]);

  return { fetchPlaceDetails };
}
