import { useEffect, useState } from "react";

export function usePlacesDetail(
  map: google.maps.Map | google.maps.StreetViewPanorama | null | undefined,
  placeId: string
) {
  const [placeDetail, setPlaceDetail] =
    useState<google.maps.places.PlaceResult>();

  useEffect(() => {
    if (isMap(map) && !placeDetail) {
      const placesService = new google.maps.places.PlacesService(map);
      placesService.getDetails(
        {
          placeId,
          fields: ["place_id", "geometry", "url"],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            setPlaceDetail(place);
          }
        }
      );
    }
  }, [map, placeId, placeDetail]);

  return { placeDetail };
}

function isMap(
  map: google.maps.Map | google.maps.StreetViewPanorama | null | undefined
): map is google.maps.Map {
  return !!map && "getCenter" in map;
}
