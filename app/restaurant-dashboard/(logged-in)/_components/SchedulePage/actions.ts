"use server";

import { updateOpeningHours } from "@/actions/mutations/restaurant-google-map-opening-hour";
import prisma from "@/lib/prisma/client";

export async function getRestaurantOpeningInfo(restaurantId: string) {
  return await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      isOpen: true,
      isFullStatusAvailable: true,
      openingHours: {
        orderBy: {
          openHour: "asc"
        }
      },
      fullStatuses: {
        where: {
          easedAt: null
        }
      }
    }
  });
}

export async function updateBusinessHours({ restaurantId }: { restaurantId: string }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, googleMapPlaceId: true }
  });
  if (!restaurant) throw new Error("Restaurant not found.");

  return await updateOpeningHours({ restaurantId: restaurant.id, googleMapPlaceId: restaurant.googleMapPlaceId });
}
