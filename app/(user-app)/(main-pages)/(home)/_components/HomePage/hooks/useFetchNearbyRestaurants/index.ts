import { useEffect, useState } from "react";
import { findNearbyRestaurants } from "../../_actions/findNearByRestaurants";
import { calculateDistance } from "@/app/(user-app)/_util/calculateDistance";
import { RestaurantWithDistance } from "../../_types/RestaurantWithDistance";
import { logger } from "@/utils/logger";

type Args = { position?: { lat: number; lng: number }; restaurants: RestaurantWithDistance[] };
export const useFetchNearbyRestaurants = ({ position, restaurants }: Args) => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState(restaurants);
  useEffect(() => {
    if ((position?.lat, !position?.lng)) return;
    findNearbyRestaurants({ long: position.lng, lat: position.lat, restaurants })
      .then((sortedRestaurants) => {
        setNearbyRestaurants(sortedRestaurants);
      })
      .catch((error) => {
        setNearbyRestaurants(
          restaurants.map((restaurant) => ({
            ...restaurant,
            distance: calculateDistance({
              origin: { lat: position.lat, lng: position.lng },
              destination: {
                lat: restaurant.googleMapPlaceInfo?.latitude,
                lng: restaurant.googleMapPlaceInfo?.longitude
              }
            })?.formatted
          }))
        );
        logger({
          severity: "ERROR",
          message: "findNearbyRestaurantsの呼び出しに失敗しました",
          payload: { error: JSON.stringify(error) }
        });
      });
  }, [position?.lat, position?.lng, restaurants]);
  return { nearbyRestaurants };
};
