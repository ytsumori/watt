import { CurrentOpeningHoursResult } from "@/lib/places-api/actions";
import { convertOpeningHours } from "@/lib/places-api/util";
import { dayNumberToDayOfWeek, dayOfWeekToNumber } from "@/utils/day-of-week";
import { $Enums, RestaurantGoogleMapOpeningHour } from "@prisma/client";
import { startOfWeek, addDays, formatDate, toDate, parseISO, addHours } from "date-fns";

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

export const getDateOfDayThisWeek = (dayNumber: number) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  // startOfWeekStartで前日の15:00で帰ってきてしまうため、9時間足している
  const fixedWeekStart = addHours(weekStart, 9);
  return addDays(fixedWeekStart, dayNumber);
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

      const date = getDateOfDayThisWeek(dayOfWeekToNumber(dayOfWeek));

      console.log(`-------- ${dayOfWeek} -------- ${formatDate(date, "yyyy-MM-dd(E)")}`);

      // 今週の営業時間の方が少ない場合
      if (currentBusinessHoursLength < regularBusinessHoursLength) {
        console.log("今週の方が少ない");
        return { date, holidayOpeningHours: currentBusinessHours };
      }

      // 今週の営業時間の方が多い場合
      if (regularBusinessHoursLength < currentBusinessHoursLength) {
        console.log("今週の方が多い");
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
          console.log("一緒の数だけど差分あり");
          return { date, holidayOpeningHours: currentBusinessHours };
        }
      }
      return null;
    })
    .filter(Boolean) as { date: Date; holidayOpeningHours: RestaurantOpeningHour[] }[];
  return diff;
};
