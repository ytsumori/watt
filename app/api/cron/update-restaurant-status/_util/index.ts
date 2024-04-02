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
  const currentDay = now.getDay();
  const yesterdayDay = currentDay === 0 ? 6 : currentDay - 1;
  const tomorrowDay = currentDay === 6 ? 0 : currentDay + 1;

  return openingHours.some((openingHour) => {
    const openTime = getJapanTime({ hour: openingHour.openHour, minute: openingHour.openMinute });
    const closeTime = getJapanTime({ hour: openingHour.closeHour, minute: openingHour.closeMinute });
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

function getJapanTime({ hour, minute }: { hour: number; minute: number }): Date {
  const offsetString = "+09:00";
  const dateString = new Date()
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Tokyo",
    })
    .replace(/\//g, "-");
  const hourString = hour < 10 ? `0${hour}` : `${hour}`;
  const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
  console.log(`${dateString}T${hourString}:${minuteString}:00${offsetString}`);
  return new Date(`${dateString}T${hourString}:${minuteString}:00${offsetString}`);
}
