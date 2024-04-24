"use server";

import prisma from "@/lib/prisma/client";

type Args = {
  name: string;
  googleMapPlaceId: string;
  latitude: number;
  longitude: number;
  url: string;
};

export async function createRestaurant({ name, googleMapPlaceId, latitude, longitude, url }: Args) {
  return await prisma.restaurant.create({
    data: {
      name,
      googleMapPlaceId,
      googleMapPlaceInfo: {
        create: {
          latitude,
          longitude,
          url
        }
      }
    }
  });
}
