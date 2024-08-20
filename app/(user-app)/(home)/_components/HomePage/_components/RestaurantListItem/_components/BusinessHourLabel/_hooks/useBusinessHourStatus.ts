import { RestaurantWithDistance } from "@/app/(user-app)/(home)/_components/HomePage/_types/RestaurantWithDistance";
import { useMemo } from "react";
import { BusinessHourStatus } from "../../../_types/BusinessHourStatus";
import { getCurrentOpeningHour, getNextOpeningHour } from "@/utils/opening-hours";
import { getJSTFromUTC } from "@/utils/timezone";
import { dayNumberToDayOfWeek } from "@/utils/day-of-week";

export function useBusinessHourStatus(openingHours: RestaurantWithDistance["openingHours"]) {
  const now = useMemo(() => new Date(), []);
  const { jstDayOfWeek: jstCurrentDayOfWeek, jstHour: jstCurrentHour } = getJSTFromUTC(
    now.getUTCDay(),
    now.getUTCHours()
  );
  const currentMinute = now.getMinutes();
  const tomorrowDay = dayNumberToDayOfWeek(jstCurrentDayOfWeek === 6 ? 0 : jstCurrentDayOfWeek + 1);

  const currentOpeningHour = getCurrentOpeningHour(openingHours);

  const closingTime = useMemo(() => {
    if (!currentOpeningHour) return undefined;

    return {
      hour:
        currentOpeningHour.closeDayOfWeek === tomorrowDay
          ? currentOpeningHour.closeHour + 24
          : currentOpeningHour.closeHour,
      minute: currentOpeningHour.closeMinute
    };
  }, [currentOpeningHour, tomorrowDay]);

  const nextOpeningTime = getNextOpeningHour(openingHours);

  const businessHourStatus = useMemo(() => {
    if (openingHours.length === 0) {
      return "unknown";
    }

    if (currentOpeningHour) {
      if (closingTime) {
        if (closingTime.hour === jstCurrentHour && closingTime.minute - currentMinute <= 30) {
          return "closing";
        }
        if (closingTime.hour - jstCurrentHour === 1 && closingTime.minute + 60 - currentMinute <= 30) {
          return "closing";
        }
      }
      return "open";
    } else {
      if (nextOpeningTime) {
        if (nextOpeningTime.hour === jstCurrentHour && nextOpeningTime.minute - currentMinute <= 30) {
          return "opening";
        }
        if (nextOpeningTime.hour - jstCurrentHour === 1 && nextOpeningTime.minute + 60 - currentMinute <= 30) {
          return "opening";
        }
      }
      return "closed";
    }
  }, [closingTime, currentMinute, currentOpeningHour, jstCurrentHour, nextOpeningTime, openingHours.length]);

  return {
    businessHourStatus: businessHourStatus as BusinessHourStatus,
    closingTime: closingTime ? getTimeString(closingTime.hour, closingTime.minute) : undefined,
    nextOpeningTime: nextOpeningTime ? getTimeString(nextOpeningTime.hour, nextOpeningTime.minute) : undefined
  };
}

function getTimeString(hour: number, minute: number) {
  if (hour >= 24) {
    return `明日 ${hour - 24}:${minute.toString().padStart(2, "0")}`;
  }

  return `${hour}:${minute.toString().padStart(2, "0")}`;
}
