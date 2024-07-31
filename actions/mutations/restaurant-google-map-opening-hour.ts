"use server";

import { getOpeningHours } from "@/lib/places-api/actions";
import prisma from "@/lib/prisma/client";
import { dayNumberToDayOfWeek } from "@/utils/day-of-week";

export async function updateOpeningHours({
  restaurantId,
  googleMapPlaceId
}: {
  restaurantId: string;
  googleMapPlaceId: string;
}) {
  const previousOpeningHours = await prisma.restaurantGoogleMapOpeningHour.findMany({ where: { restaurantId } });
  const { currentOpeningHours: newOpeningHours } = await getOpeningHours({ placeId: googleMapPlaceId });

  if (!newOpeningHours) {
    if (previousOpeningHours.length > 0) {
      await prisma.restaurantGoogleMapOpeningHour.deleteMany({ where: { restaurantId } });
    }
    return;
  }

  const deleteTransactions = previousOpeningHours.flatMap((previousOpeningHour) => {
    const identicalPeriodIndex = newOpeningHours.periods.findIndex((period) => {
      return (
        previousOpeningHour.openDayOfWeek === dayNumberToDayOfWeek(period.open.day) &&
        previousOpeningHour.openHour === period.open.hour &&
        previousOpeningHour.openMinute === period.open.minute &&
        previousOpeningHour.closeDayOfWeek === dayNumberToDayOfWeek(period.close.day) &&
        previousOpeningHour.closeHour === period.close.hour &&
        previousOpeningHour.closeMinute === period.close.minute
      );
    });
    if (identicalPeriodIndex > -1) {
      newOpeningHours.periods.splice(identicalPeriodIndex, 1);
      return [];
    }
    return [prisma.restaurantGoogleMapOpeningHour.delete({ where: { id: previousOpeningHour.id } })];
  });

  const createTransactions = newOpeningHours.periods.flatMap((period) => {
    return prisma.restaurantGoogleMapOpeningHour.create({
      data: {
        restaurantId,
        openDayOfWeek: dayNumberToDayOfWeek(period.open.day),
        openHour: period.open.hour,
        openMinute: period.open.minute,
        closeDayOfWeek: dayNumberToDayOfWeek(period.close.day),
        closeHour: period.close.hour,
        closeMinute: period.close.minute
      }
    });
  });

  return await prisma.$transaction([...deleteTransactions, ...createTransactions]);
}
