"use server";

import prisma from "@/lib/prisma/client";
import { createRestaurantCoordinate } from "./create-restaurant-coordinates";
import { deleteRestaurant } from "./deleteRestaurant";
import { logger } from "@/utils/logger";
import { Prisma } from "@prisma/client";
import { Result } from "@/types/error";

type Restaurant = Prisma.RestaurantGetPayload<{}>;

type Args = { name: string; googleMapPlaceId: string; latitude: number; longitude: number; url: string };

export async function createRestaurant({
  name,
  googleMapPlaceId,
  latitude,
  longitude,
  url
}: Args): Promise<Result<Restaurant>> {
  const restaurant = await prisma.restaurant.create({
    data: { name, googleMapPlaceId, googleMapPlaceInfo: { create: { latitude, longitude, url } } }
  });

  try {
    await createRestaurantCoordinate({ restaurantId: restaurant.id, lat: latitude, lng: longitude });
    return { data: restaurant, error: null };
  } catch (e) {
    await deleteRestaurant({ restaurantId: restaurant.id });
    logger({
      severity: "ERROR",
      message: "RestaurantCoordinateの作成に失敗しました",
      payload: { name: restaurant.name, error: JSON.stringify(e) }
    });
    return { data: null, error: { message: "意図しないエラーが発生しました" } };
  }
}
