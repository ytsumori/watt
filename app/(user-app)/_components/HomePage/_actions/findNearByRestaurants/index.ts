"use server";
import { calculateDistance } from "@/app/(user-app)/_util/calculateDistance";
import { formatDistance } from "@/app/(user-app)/_util/formatDistance";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { logger } from "@/utils/logger";
import { Prisma } from "@prisma/client";

type Restaurant = Prisma.RestaurantGetPayload<{
  include: { meals: true; googleMapPlaceInfo: { select: { latitude: true; longitude: true } } };
}>;

type Args = { lat: number; long: number; restaurants: Restaurant[] };

export const findNearbyRestaurants = async ({
  lat,
  long,
  restaurants
}: Args): Promise<(Restaurant & { distance: string })[]> => {
  const supabase = createServiceRoleClient();
  const { data: nearbyRestaurants, error } = await supabase.rpc("find_nearby_restaurants", { long, lat });

  if (error) {
    logger({ severity: "ERROR", message: "Error fetching nearby restaurants", payload: error });
    throw error;
  }

  if (!nearbyRestaurants) return [];

  const restaurantMap = restaurants.reduce((obj: { [id: string]: Restaurant }, item) => {
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
