import { Prisma } from "@prisma/client";
import { getJSTFromUTC } from "../timezone";
import { dayOfWeekToNumber } from "../day-of-week";

type JstOpeningHours = Prisma.RestaurantGoogleMapOpeningHourGetPayload<{
  select: {
    openDayOfWeek: true;
    openHour: true;
    openMinute: true;
    closeDayOfWeek: true;
    closeHour: true;
    closeMinute: true;
  };
}>[];

export function getCurrentOpeningHour(jstOpeningHours: JstOpeningHours) {
  const current = new Date();
  const currentUtcDay = current.getUTCDay();
  const currentUtcHour = current.getUTCHours();
  const currentUtcMinute = current.getUTCMinutes();
  const { jstDayOfWeek: currentJstDay, jstHour: currentJstHour } = getJSTFromUTC(currentUtcDay, currentUtcHour);
  return jstOpeningHours.find((openingHour) => {
    const openDay = dayOfWeekToNumber(openingHour.openDayOfWeek);
    const closeDay = dayOfWeekToNumber(openingHour.closeDayOfWeek);
    if (
      openDay === currentJstDay &&
      (openingHour.openHour < currentJstHour ||
        (openingHour.openHour === currentJstHour && openingHour.openMinute <= currentUtcMinute))
    ) {
      // if opening day is today
      if (closeDay === currentJstDay) {
        // if closing day is today
        return (
          openingHour.closeHour > currentJstHour ||
          (openingHour.closeHour === currentJstHour && openingHour.closeMinute > currentUtcMinute)
        );
      } else if (closeDay === currentJstDay + 1 || (currentJstDay === 6 && closeDay === 0)) {
        // if the closing day is tomorrow
        return true;
      }
    } else if (openDay === currentJstDay - 1 || (currentJstDay === 0 && openDay === 6)) {
      // if opening day is yesterday
      return (
        closeDay === currentJstDay &&
        (openingHour.closeHour > currentJstHour ||
          (openingHour.closeHour === currentJstHour && openingHour.closeMinute > currentUtcMinute))
      );
    }
  });
}

export function isCurrentlyWorkingHour(jstOpeningHours: JstOpeningHours) {
  return !!getCurrentOpeningHour(jstOpeningHours);
}

export function getNextOpeningHour(jstOpeningHours: JstOpeningHours) {
  const current = new Date();
  const currentUtcDay = current.getUTCDay();
  const currentUtcHour = current.getUTCHours();
  const currentUtcMinute = current.getUTCMinutes();
  const { jstDayOfWeek: currentJstDay, jstHour: currentJstHour } = getJSTFromUTC(currentUtcDay, currentUtcHour);
  const nextOpeningHour = jstOpeningHours.find((openingHour) => {
    const openDay = dayOfWeekToNumber(openingHour.openDayOfWeek);
    if (
      openDay === currentJstDay &&
      (openingHour.openHour > currentJstHour ||
        (openingHour.openHour === currentJstHour && openingHour.openMinute > currentUtcMinute))
    ) {
      return true;
    }
  });
  return nextOpeningHour ? { hour: nextOpeningHour.openHour, minute: nextOpeningHour.openMinute } : undefined;
}
