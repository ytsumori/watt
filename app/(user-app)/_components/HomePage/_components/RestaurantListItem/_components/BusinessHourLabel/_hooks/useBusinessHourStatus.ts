import { RestaurantWithDistance } from "@/app/(user-app)/_components/HomePage/_types/RestaurantWithDistance";
import { dayOfWeekToNumber } from "@/utils/day-of-week";
import { useMemo } from "react";
import { BusinessHourStatus } from "../../../_types/BusinessHourStatus";
import { getUTCFromJST } from "@/utils/timezone";

export function useBusinessHourStatus(openingHours: RestaurantWithDistance["openingHours"]) {
  const now = useMemo(() => new Date(), []);
  const currentDay = now.getUTCDay();
  const yesterdayDay = currentDay === 0 ? 6 : currentDay - 1;
  const tomorrowDay = currentDay === 6 ? 0 : currentDay + 1;
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();

  const utcOpeningHours = useMemo(() => {
    return openingHours.map(({ openDayOfWeek, openHour, openMinute, closeDayOfWeek, closeHour, closeMinute }) => {
      const { utcDayOfWeek: utcOpenDayOfWeek, utcHour: utcOpenHour } = getUTCFromJST(
        dayOfWeekToNumber(openDayOfWeek),
        openHour
      );
      const { utcDayOfWeek: utcCloseDayOfWeek, utcHour: utcCloseHour } = getUTCFromJST(
        dayOfWeekToNumber(closeDayOfWeek),
        closeHour
      );
      return {
        openDayOfWeek: utcOpenDayOfWeek,
        openHour: utcOpenHour,
        openMinute,
        closeDayOfWeek: utcCloseDayOfWeek,
        closeHour: utcCloseHour,
        closeMinute
      };
    });
  }, [openingHours]);

  const currentOpeningHour = useMemo(() => {
    return utcOpeningHours.find((openingHour) => {
      if (openingHour.openDayOfWeek === yesterdayDay && openingHour.closeDayOfWeek === currentDay) {
        return (
          currentHour < openingHour.closeHour ||
          (openingHour.closeHour === currentHour && currentMinute <= openingHour.closeMinute)
        );
      } else if (openingHour.openDayOfWeek === currentDay && openingHour.closeDayOfWeek === tomorrowDay) {
        return (
          openingHour.openHour < currentHour ||
          (openingHour.openHour === currentHour && openingHour.openMinute <= currentMinute)
        );
      } else if (openingHour.openDayOfWeek === currentDay && openingHour.closeDayOfWeek === currentDay) {
        return (
          (openingHour.openHour < currentHour && currentHour < openingHour.closeHour) ||
          (openingHour.openHour === currentHour && openingHour.openMinute <= currentMinute) ||
          (openingHour.closeHour === currentHour && currentMinute <= openingHour.closeMinute)
        );
      }

      return false;
    });
  }, [currentDay, currentHour, currentMinute, tomorrowDay, utcOpeningHours, yesterdayDay]);

  const closingTime = useMemo(() => {
    if (!currentOpeningHour) return undefined;

    if (currentOpeningHour.closeDayOfWeek === tomorrowDay) {
      return { hour: currentOpeningHour.closeHour + 24, minute: currentOpeningHour.closeMinute };
    }
    return {
      hour:
        currentOpeningHour.closeDayOfWeek === tomorrowDay
          ? currentOpeningHour.closeHour + 24
          : currentOpeningHour.closeHour,
      minute: currentOpeningHour.closeMinute
    };
  }, [currentOpeningHour, tomorrowDay]);

  const nextOpeningTime = useMemo(() => {
    const nextOpeningHour = utcOpeningHours.reduce<
      | {
          openHour: number;
          openMinute: number;
          openDayOfWeek: number;
          closeHour: number;
          closeMinute: number;
          closeDayOfWeek: number;
        }
      | undefined
    >((accumulator, currentValue) => {
      if (
        currentDay === currentValue.openDayOfWeek &&
        (currentHour < currentValue.openHour ||
          (currentHour === currentValue.openHour && currentMinute < currentValue.openMinute))
      ) {
        if (!accumulator) return currentValue;
        if (accumulator.openDayOfWeek === tomorrowDay) return currentValue;

        if (currentValue.openHour < accumulator.openHour) return currentValue;
      } else if (tomorrowDay === currentValue.openDayOfWeek) {
        if (!accumulator) return currentValue;

        if (accumulator.openDayOfWeek === tomorrowDay && currentValue.openHour < accumulator.openHour) {
          return currentValue;
        }
      }
      return accumulator;
    }, undefined);
    return nextOpeningHour
      ? {
          hour: nextOpeningHour.openHour,
          minute: nextOpeningHour.openMinute
        }
      : undefined;
  }, [currentDay, currentHour, currentMinute, tomorrowDay, utcOpeningHours]);

  const businessHourStatus = useMemo(() => {
    if (openingHours.length === 0) {
      return "unknown";
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentOpeningHour) {
      if (closingTime) {
        if (closingTime.hour === currentHour && closingTime.minute - currentMinute <= 30) {
          return "closing";
        }
        if (closingTime.hour - currentHour === 1 && closingTime.minute + 60 - currentMinute <= 30) {
          return "closing";
        }
      }
      return "open";
    } else {
      if (nextOpeningTime) {
        if (nextOpeningTime.hour === currentHour && nextOpeningTime.minute - currentMinute <= 30) {
          return "opening";
        }
        if (nextOpeningTime.hour - currentHour === 1 && nextOpeningTime.minute + 60 - currentMinute <= 30) {
          return "opening";
        }
      }
      return "closed";
    }
  }, [closingTime, currentOpeningHour, nextOpeningTime, openingHours.length]);

  return {
    businessHourStatus: businessHourStatus as BusinessHourStatus,
    closingTime: closingTime ? getJSTStringFromUTC(closingTime.hour, closingTime.minute) : undefined,
    nextOpeningTime: nextOpeningTime ? getJSTStringFromUTC(nextOpeningTime.hour, nextOpeningTime.minute) : undefined
  };
}

function getJSTStringFromUTC(hour: number, minute: number) {
  const jstHour = hour + 9;
  if (jstHour >= 24) {
    return `明日 ${jstHour - 24}:${minute.toString().padStart(2, "0")}`;
  }

  return `${jstHour}:${minute.toString().padStart(2, "0")}`;
}
