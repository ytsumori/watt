"use server";

import { calculateDistance } from "@/utils/calculateDistance";
import { Prisma } from "@prisma/client";

type Restaurants = Prisma.RestaurantGetPayload<{
  include: { meals: true; googleMapPlaceInfo: { select: { latitude: true; longitude: true } } };
}>[];

export const sortRestaurants = async (origin: { lat: number; lng: number }, restaurants: Restaurants) => {
  return restaurants.sort((a, b) => {
    const destinationA = a.googleMapPlaceInfo
      ? { lat: a.googleMapPlaceInfo.latitude, lng: a.googleMapPlaceInfo.longitude }
      : { lat: 0, lng: 0 };
    const destinationB = b.googleMapPlaceInfo
      ? { lat: b.googleMapPlaceInfo.latitude, lng: b.googleMapPlaceInfo.longitude }
      : { lat: 0, lng: 0 };

    const distanceA = calculateDistance({ origin, destination: { ...destinationA } });
    const distanceB = calculateDistance({ origin, destination: { ...destinationB } });

    return distanceA.raw - distanceB.raw;
  });
};
