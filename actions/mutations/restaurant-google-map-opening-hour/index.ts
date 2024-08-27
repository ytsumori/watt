"use server";

import { getCurrentOpeningHours, getRegularOpeningHours } from "@/lib/places-api/actions";
import prisma from "@/lib/prisma/client";
import { dayNumberToDayOfWeek } from "@/utils/day-of-week";
import { createBusinessHourDiff } from "./util";

export async function updateRegularOpeningHours({
  restaurantId,
  googleMapPlaceId
}: {
  restaurantId: string;
  googleMapPlaceId: string;
}) {
  const previousOpeningHours = await prisma.restaurantGoogleMapOpeningHour.findMany({ where: { restaurantId } });

  const { regularOpeningHours: newOpeningHours } = await getRegularOpeningHours({ placeId: googleMapPlaceId });

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

export async function updateCurrentOpeningHours({
  restaurantId,
  googleMapPlaceId
}: {
  restaurantId: string;
  googleMapPlaceId: string;
}) {
  const { currentOpeningHours } = await getCurrentOpeningHours({ placeId: googleMapPlaceId });
  if (!currentOpeningHours) throw new Error("currentOpeningHours is not found");
  const regularOpeningHours = await prisma.restaurantGoogleMapOpeningHour.findMany({ where: { restaurantId } });
  const diffs = await createBusinessHourDiff({ currentOpeningHours, regularOpeningHours, restaurantId });

  diffs.forEach(async (diff) => {
    const restaurantHoliday = await prisma.restaurantHoliday.create({
      data: { restaurantId: restaurantId, date: diff.date }
    });
    diff.holidayOpeningHours.forEach(async (item) => {
      await prisma.restaurantHolidayOpeningHour.create({
        data: {
          restaurantHolidayId: restaurantHoliday.id,
          openHour: item.openHour,
          openMinute: item.openMinute,
          closeDayOfWeek: item.closeDayOfWeek,
          closeHour: item.closeHour,
          closeMinute: item.closeMinute,
          openDayOfWeek: item.openDayOfWeek
        }
      });
    });
  });
}
