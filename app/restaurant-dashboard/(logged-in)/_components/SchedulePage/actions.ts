"use server";

import {
  updateCurrentOpeningHours,
  updateRegularOpeningHours
} from "@/actions/mutations/restaurant-google-map-opening-hour";
import prisma from "@/lib/prisma/client";
import { createTodayDateNumber } from "@/utils/opening-hours";

export async function getRestaurantOpeningInfo(restaurantId: string) {
  const todayNumber = createTodayDateNumber();
  return await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      isAvailable: true,
      openingHours: true,
      holidays: {
        select: { date: true, openingHours: true },
        where: { date: { gte: todayNumber } }
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

  const updatedHours = await updateRegularOpeningHours({
    restaurantId: restaurant.id,
    googleMapPlaceId: restaurant.googleMapPlaceId
  });

  await updateCurrentOpeningHours({ googleMapPlaceId: restaurant.googleMapPlaceId, restaurantId: restaurant.id });

  return updatedHours;
}
