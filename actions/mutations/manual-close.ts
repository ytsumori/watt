"use server";
import prisma from "@/lib/prisma/client";
import { getCurrentOpeningHour, mergeOpeningHours } from "@/utils/opening-hours";

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

  const currentHour = getCurrentOpeningHour(mergedOpeningHours);

  if (!isAvailable && currentHour) {
    const isHoliday = !!(await prisma.restaurantHolidayOpeningHour.findUnique({ where: { id: currentHour.id } }));
    return isHoliday
      ? await prisma.restaurantManualClose.create({ data: { restaurantId, holidayOpeningHourId: currentHour.id } })
      : await prisma.restaurantManualClose.create({ data: { restaurantId, googleMapOpeningHourId: currentHour.id } });
  }
}
