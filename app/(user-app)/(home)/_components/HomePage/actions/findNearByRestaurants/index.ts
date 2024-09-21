"use server";

import { formatDistance } from "@/app/(user-app)/_util/formatDistance";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { logger } from "@/utils/logger";
import { RestaurantListItem, RestaurantWithDistance } from "../../types/RestaurantWithDistance";

type Args = { lat: number; long: number; restaurants: RestaurantListItem[] };

export const findNearbyRestaurants = async ({ lat, long, restaurants }: Args): Promise<RestaurantWithDistance[]> => {
  const supabase = createServiceRoleClient();
  const { data: nearbyRestaurants, error } = await supabase.rpc("find_nearby_restaurants", { long, lat });

  if (error) {
    logger({ severity: "ERROR", message: "Error fetching nearby restaurants", payload: error });
    throw error;
  }

  if (!nearbyRestaurants) return [];

  const restaurantMap = restaurants.reduce((obj: { [id: string]: RestaurantListItem }, item) => {
    obj[item.id] = item;
    return obj;
  }, {});

  const result = nearbyRestaurants
    .filter((restaurant) => restaurantMap[restaurant.id])
    .map((restaurant) => {
      const restaurantInfo = restaurantMap[restaurant.id];
      return { ...restaurantInfo, distance: formatDistance(restaurant.distance) };
    });

  return result;
};
