"use server";

import { getOpeningHours } from "@/lib/places-api";
import prisma from "@/lib/prisma/client";
import { dayNumberToDayOfWeek } from "@/utils/day-of-week";
import { convertOpeningHours } from "@/utils/openingHours";

export async function updateOpeningHours({
  restaurantId,
  googleMapPlaceId
}: {
  restaurantId: string;
  googleMapPlaceId: string;
}) {
  const previousOpeningHours = await prisma.restaurantGoogleMapOpeningHour.findMany({ where: { restaurantId } });
  const { currentOpeningHours } = await getOpeningHours({ placeId: googleMapPlaceId });
  const convertedOpeningHours = convertOpeningHours(currentOpeningHours);

  if (!convertedOpeningHours) {
    if (previousOpeningHours.length > 0) {
      await prisma.restaurantGoogleMapOpeningHour.deleteMany({ where: { restaurantId } });
    }
    return;
  }

  const isSameOpeningHours =
    previousOpeningHours.length === convertedOpeningHours.periods.length &&
    previousOpeningHours.every((previousOpeningHour) => {
      const key = `${previousOpeningHour.openDayOfWeek}-${previousOpeningHour.openHour}-${previousOpeningHour.openMinute}-${previousOpeningHour.closeDayOfWeek}-${previousOpeningHour.closeHour}-${previousOpeningHour.closeMinute}`;
      return convertedOpeningHours.periods.some((period) => {
        return (
          `${dayNumberToDayOfWeek(period.open.day)}-${period.open.hour}-${period.open.minute}-${dayNumberToDayOfWeek(period.close.day)}-${period.close.hour}-${period.close.minute}` ===
          key
        );
      });
    });
  if (isSameOpeningHours) return previousOpeningHours;

  return await prisma.$transaction([
    prisma.restaurantGoogleMapOpeningHour.deleteMany({ where: { restaurantId } }),
    prisma.restaurantGoogleMapOpeningHour.createMany({
      data: convertedOpeningHours.periods.map((period) => ({
        restaurantId,
        openDayOfWeek: dayNumberToDayOfWeek(period.open.day),
        openHour: period.open.hour,
        openMinute: period.open.minute,
        closeDayOfWeek: dayNumberToDayOfWeek(period.close.day),
        closeHour: period.close.hour,
        closeMinute: period.close.minute
      }))
    })
  ]);
}
