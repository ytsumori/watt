"use server";

import { formatDistance } from "@/app/(user-app)/_util/formatDistance";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { logger } from "@/utils/logger";
import { Prisma } from "@prisma/client";
import { RestaurantWithDistance } from "../../_types/RestaurantWithDistance";

type Restaurant = Prisma.RestaurantGetPayload<{
  include: {
    meals: {
      select: {
        id: true;
        title: true;
        price: true;
        listPrice: true;
        imagePath: true;
      };
    };
    googleMapPlaceInfo: { select: { latitude: true; longitude: true } };
    openingHours: {
      select: {
        openHour: true;
        openMinute: true;
        openDayOfWeek: true;
        closeHour: true;
        closeMinute: true;
        closeDayOfWeek: true;
      };
    };
    fullStatuses: {
      select: {
        easedAt: true;
      };
    };
  };
}>;

type Args = { lat: number; long: number; restaurants: Restaurant[] };

export const findNearbyRestaurants = async ({ lat, long, restaurants }: Args): Promise<RestaurantWithDistance[]> => {
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
