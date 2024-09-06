import { $Enums, Prisma, RestaurantGoogleMapOpeningHour, RestaurantHoliday } from "@prisma/client";
import { getJSTFromUTC } from "../timezone";
import { dayOfWeekToNumber } from "../day-of-week";
import { addHours } from "date-fns";

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

export function getDayOfWeekFromDate(date: number) {
  const splitted = date.toString().split("");
  const year = splitted.slice(0, 4).join("");
  const month = splitted.slice(4, 6).join("");
  const day = splitted.slice(6, 8).join("");
  const dayOfWeek = new Date(`${year}-${month}-${day}`).getDay();
  return dayOfWeek;
}

export type MergeOpeningHoursArgs = {
  regularOpeningHours: Omit<
    RestaurantGoogleMapOpeningHour,
    "id" | "restaurantId" | "isAutomaticallyApplied" | "createdAt" | "updatedAt"
  >[];
  holidays: Prisma.RestaurantHolidayGetPayload<{
    select: {
      date: true;
      openingHours: {
        select: {
          openHour: true;
          openMinute: true;
          openDayOfWeek: true;
          closeHour: true;
          closeMinute: true;
          closeDayOfWeek: true;
        };
      };
    };
  }>[];
};

export function mergeOpeningHours({
  regularOpeningHours,
  holidays
}: MergeOpeningHoursArgs): MergeOpeningHoursArgs["regularOpeningHours"] {
  if (holidays.length === 0) return regularOpeningHours;

  const res = Object.values($Enums.DayOfWeek)
    .map((dayOfWeek) => {
      const holiday = holidays.find((holiday) => getDayOfWeekFromDate(holiday.date) === dayOfWeekToNumber(dayOfWeek));
      const regularOpeningHour = regularOpeningHours.find((regular) => regular.openDayOfWeek === dayOfWeek);
      if (holiday) {
        // holidayはあるがopeningHoursがない場合は休みになっているのでnull返す
        return holiday.openingHours ? holiday.openingHours : null;
      }
      return regularOpeningHour ?? null;
    })
    .filter(Boolean)
    .flat() as MergeOpeningHoursArgs["regularOpeningHours"];
  return res;
}

export function createTodayDateNumber() {
  const now = new Date();
  const utc = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    )
  );
  const jst = addHours(utc, 9);
  const today = Number(jst.toISOString().split("T")[0].replaceAll("-", ""));
  return today;
}
