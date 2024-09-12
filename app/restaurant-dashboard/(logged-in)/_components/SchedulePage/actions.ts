"use server";

import {
  updateCurrentOpeningHours,
  updateRegularOpeningHours
} from "@/actions/mutations/restaurant-google-map-opening-hour";
import prisma from "@/lib/prisma/client";
import { createTodayDateNumber, mergeOpeningHours } from "@/utils/opening-hours";
import { getCurrentOpeningHourWithId } from "./util";

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

export async function createManualClose(restaurantId: string, isAvailable: boolean) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { openingHours: true, holidays: { select: { openingHours: true, date: true } } }
  });
  if (!restaurant) throw new Error("Restaurant not found.");

  const mergedOpeningHours = mergeOpeningHours({
    regularOpeningHours: restaurant.openingHours,
    holidays: restaurant.holidays
  });

  const currentHour = getCurrentOpeningHourWithId(mergedOpeningHours);

  if (!isAvailable && currentHour) {
    currentHour.isRegular
      ? await prisma.restaurantManualClose.create({ data: { restaurantId, googleMapOpeningHourId: currentHour.id } })
      : await prisma.restaurantManualClose.create({ data: { restaurantId, holidayOpeningHourId: currentHour.id } });
  }
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
