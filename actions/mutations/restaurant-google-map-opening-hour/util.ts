import { CurrentOpeningHoursResult } from "@/lib/places-api/actions";
import { convertOpeningHours } from "@/lib/places-api/util";
import { dayNumberToDayOfWeek, dayOfWeekToNumber } from "@/utils/day-of-week";
import { getJSTFromUTC } from "@/utils/timezone";
import { $Enums, RestaurantGoogleMapOpeningHour } from "@prisma/client";
import { addDays, addHours, format, getDay } from "date-fns";
import { ja } from "date-fns/locale";

export type RestaurantOpeningHour = Omit<
  RestaurantGoogleMapOpeningHour,
  "id" | "updatedAt" | "createdAt" | "isAutomaticallyApplied"
>;

export const createBusinessHoursGroupedByDayOfWeek = (hours: RestaurantOpeningHour[]) => {
  return Object.values($Enums.DayOfWeek).reduce((acc, dayOfWeek) => {
    const dayOfWeekHours = hours.filter((hour) => hour.openDayOfWeek === dayOfWeek);
    return { ...acc, [dayOfWeek]: dayOfWeekHours };
  }, {}) as { [K in keyof typeof $Enums.DayOfWeek]: RestaurantOpeningHour[] };
};

const checkHasSameBusinessHours = (
  currentBusinessHour: RestaurantOpeningHour,
  regularBusinessHour: RestaurantOpeningHour
) => {
  return (
    regularBusinessHour.openDayOfWeek === currentBusinessHour.openDayOfWeek &&
    regularBusinessHour.openHour === currentBusinessHour.openHour &&
    regularBusinessHour.openMinute === currentBusinessHour.openMinute &&
    regularBusinessHour.closeDayOfWeek === currentBusinessHour.closeDayOfWeek &&
    regularBusinessHour.closeHour === currentBusinessHour.closeHour &&
    regularBusinessHour.closeMinute === currentBusinessHour.closeMinute
  );
};

export const getDateOfNextSevenDays = (dayNumber: number) => {
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
  // 日本時間に直す
  const jst = addHours(utc, 9);
  // 今日の曜日を求める
  const { jstDayOfWeek: todayNumber } = getJSTFromUTC(now.getUTCDay(), now.getUTCHours());

  // 求めたい曜日までの日数を求める
  const moveDayNumber =
    todayNumber === dayNumber ? 0 : todayNumber > dayNumber ? 7 - todayNumber + dayNumber : dayNumber - todayNumber;

  const movedDate = addDays(jst, moveDayNumber);

  return Number(movedDate.toISOString().split("T")[0].replaceAll("-", ""));
};

export const convertCurrentOpeningHours = (
  restaurantId: string,
  currentOpeningHours: NonNullable<CurrentOpeningHoursResult["currentOpeningHours"]>
) => {
  return convertOpeningHours(currentOpeningHours).periods.map((period) => {
    return {
      restaurantId,
      openDayOfWeek: dayNumberToDayOfWeek(period.open.day),
      openHour: period.open.hour,
      openMinute: period.open.minute,
      closeDayOfWeek: dayNumberToDayOfWeek(period.close.day),
      closeHour: period.close.hour,
      closeMinute: period.close.minute
    };
  });
};

type CreateBusinessHourDiff = {
  restaurantId: string;
  currentOpeningHours: NonNullable<CurrentOpeningHoursResult["currentOpeningHours"]>;
  regularOpeningHours: RestaurantGoogleMapOpeningHour[];
};

export const createBusinessHourDiff = async ({
  restaurantId,
  currentOpeningHours,
  regularOpeningHours
}: CreateBusinessHourDiff) => {
  const convertedCurrentOpeningHours: RestaurantOpeningHour[] = convertCurrentOpeningHours(
    restaurantId,
    currentOpeningHours
  );

  const regularDayOfWeek = createBusinessHoursGroupedByDayOfWeek(regularOpeningHours);
  const currentDayOfWeek = createBusinessHoursGroupedByDayOfWeek(convertedCurrentOpeningHours);

  const diff = Object.values($Enums.DayOfWeek)
    .map((dayOfWeek) => {
      const regularBusinessHours = regularDayOfWeek[dayOfWeek];
      const regularBusinessHoursLength = regularBusinessHours.length;
      const currentBusinessHours = currentDayOfWeek[dayOfWeek];
      const currentBusinessHoursLength = currentBusinessHours.length;

      const date = getDateOfNextSevenDays(dayOfWeekToNumber(dayOfWeek));

      // 今週の営業時間の方が少ない場合
      if (currentBusinessHoursLength < regularBusinessHoursLength) {
        return { date, holidayOpeningHours: currentBusinessHours };
      }

      // 今週の営業時間の方が多い場合
      if (regularBusinessHoursLength < currentBusinessHoursLength) {
        return { date, holidayOpeningHours: currentBusinessHours };
      }

      // 二つの配列で違う部分があるかないかを探す
      if (currentBusinessHoursLength === regularBusinessHoursLength) {
        const sameBusinessHours = currentBusinessHours.filter((currentBusinessHour) =>
          regularBusinessHours.some((regularBusinessHour) =>
            checkHasSameBusinessHours(currentBusinessHour, regularBusinessHour)
          )
        );
        if (currentBusinessHours.length !== sameBusinessHours.length) {
          return { date, holidayOpeningHours: currentBusinessHours };
        }
      }
      return null;
    })
    .filter(Boolean) as { date: number; holidayOpeningHours: RestaurantOpeningHour[] }[];
  return diff;
};
