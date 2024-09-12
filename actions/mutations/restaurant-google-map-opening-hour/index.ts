"use server";

import { getCurrentOpeningHours, getRegularOpeningHours } from "@/lib/places-api/actions";
import prisma from "@/lib/prisma/client";
import { dayNumberToDayOfWeek } from "@/utils/day-of-week";
import { createBusinessHourDiff, RestaurantOpeningHour } from "./util";
import { createTodayDateNumber } from "@/utils/opening-hours";
import { RestaurantHolidayOpeningHour } from "@prisma/client";

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
  const today = createTodayDateNumber();
  const oldCurrentOpeningHours = await prisma.restaurantHoliday.findMany({
    where: { restaurantId, date: { gte: today } },
    select: { id: true, date: true, openingHours: true }
  });

  const convertedOldCurrentOpeningHours = oldCurrentOpeningHours.reduce(
    (acc: { [date: number]: { id: string; openingHours: RestaurantHolidayOpeningHour[] } }, oldCurrentOpeningHour) => ({
      ...acc,
      [oldCurrentOpeningHour.date]: { id: oldCurrentOpeningHour.id, openingHours: oldCurrentOpeningHour.openingHours }
    }),
    {}
  );

  const { currentOpeningHours } = await getCurrentOpeningHours({ placeId: googleMapPlaceId });

  if (!currentOpeningHours) throw new Error("currentOpeningHours is not found");
  const regularOpeningHours = await prisma.restaurantGoogleMapOpeningHour.findMany({ where: { restaurantId } });
  const diffs = await createBusinessHourDiff({ currentOpeningHours, regularOpeningHours, restaurantId });

  diffs.forEach(async (diff) => {
    if (convertedOldCurrentOpeningHours[diff.date]) {
      if (convertedOldCurrentOpeningHours[diff.date].openingHours.length !== diff.holidayOpeningHours.length) {
        await prisma.restaurantHolidayOpeningHour.deleteMany({
          where: { restaurantHolidayId: convertedOldCurrentOpeningHours[diff.date].id }
        });
        diff.holidayOpeningHours.forEach(async (item) => {
          await prisma.restaurantHolidayOpeningHour.create({
            data: {
              restaurantHolidayId: convertedOldCurrentOpeningHours[diff.date].id,
              openHour: item.openHour,
              openMinute: item.openMinute,
              closeDayOfWeek: item.closeDayOfWeek,
              closeHour: item.closeHour,
              closeMinute: item.closeMinute,
              openDayOfWeek: item.openDayOfWeek
            }
          });
        });
        return;
      }
      diff.holidayOpeningHours.forEach(async (item) => {
        const isSame = convertedOldCurrentOpeningHours[diff.date].openingHours.some((oldItem) => {
          return (
            oldItem.openHour === item.openHour &&
            oldItem.openMinute === item.openMinute &&
            oldItem.closeDayOfWeek === item.closeDayOfWeek &&
            oldItem.closeHour === item.closeHour &&
            oldItem.closeMinute === item.closeMinute &&
            oldItem.openDayOfWeek === item.openDayOfWeek
          );
        });
        if (!isSame) {
          await prisma.restaurantHolidayOpeningHour.deleteMany({
            where: { restaurantHolidayId: convertedOldCurrentOpeningHours[diff.date].id }
          });
          diff.holidayOpeningHours.forEach(async (item) => {
            await prisma.restaurantHolidayOpeningHour.create({
              data: {
                restaurantHolidayId: convertedOldCurrentOpeningHours[diff.date].id,
                openHour: item.openHour,
                openMinute: item.openMinute,
                closeDayOfWeek: item.closeDayOfWeek,
                closeHour: item.closeHour,
                closeMinute: item.closeMinute,
                openDayOfWeek: item.openDayOfWeek
              }
            });
          });
        }
      });
    } else {
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
    }
  });
}
