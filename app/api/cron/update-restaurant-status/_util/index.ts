import { dayOfWeekToNumber } from "@/utils/day-of-week";
import { Prisma } from "@prisma/client";

type OpeningHour = Prisma.RestaurantGoogleMapOpeningHourGetPayload<{
  select: {
    openHour: true;
    openMinute: true;
    openDayOfWeek: true;
    closeHour: true;
    closeMinute: true;
    closeDayOfWeek: true;
  };
}>;

export function isOpenNow(openingHours: OpeningHour[]) {
  const now = new Date();
  console.log("currentTime", now.toString());
  const currentDay = now.getDay();
  const yesterdayDay = currentDay === 0 ? 6 : currentDay - 1;
  const tomorrowDay = currentDay === 6 ? 0 : currentDay + 1;

  return openingHours.some((openingHour) => {
    const openTime = new Date();
    openTime.setHours(openingHour.openHour);
    openTime.setMinutes(openingHour.openMinute);

    const closeTime = new Date();
    closeTime.setHours(openingHour.closeHour);
    closeTime.setMinutes(openingHour.closeMinute);
    if (
      openingHour.openDayOfWeek === openingHour.closeDayOfWeek &&
      dayOfWeekToNumber(openingHour.openDayOfWeek) === currentDay
    ) {
      return openTime <= now && now < closeTime;
    } else if (
      dayOfWeekToNumber(openingHour.openDayOfWeek) === yesterdayDay &&
      dayOfWeekToNumber(openingHour.closeDayOfWeek) === currentDay
    ) {
      openTime.setDate(openTime.getDate() - 1);

      return openTime <= now && now < closeTime;
    } else if (
      dayOfWeekToNumber(openingHour.openDayOfWeek) === currentDay &&
      dayOfWeekToNumber(openingHour.closeDayOfWeek) === tomorrowDay
    ) {
      closeTime.setDate(closeTime.getDate() + 1);

      return openTime <= now && now < closeTime;
    }
  });
}
