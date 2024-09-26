import { translateDayOfWeek } from "@/lib/prisma/translate-enum";
import { openingHourCompareFn } from "@/utils/opening-hours";
import { DayOfWeek, RestaurantGoogleMapOpeningHour } from "@prisma/client";

export const groupedByDayOfWeeks = (
  openingHours: Omit<
    RestaurantGoogleMapOpeningHour,
    "id" | "restaurantId" | "isAutomaticallyApplied" | "createdAt" | "updatedAt"
  >[]
) => {
  const groupedByDayOfWeeks = Object.groupBy(openingHours, (openingHour) => openingHour.openDayOfWeek);
  return Object.keys(DayOfWeek).map((dayOfWeek) => {
    const dayofWeekOpeningHour = groupedByDayOfWeeks[dayOfWeek as keyof typeof DayOfWeek];
    return dayofWeekOpeningHour
      ? `${translateDayOfWeek(dayOfWeek as keyof typeof DayOfWeek)} ${dayofWeekOpeningHour
          .sort(openingHourCompareFn)
          ?.map(
            (openingHour) =>
              `${String(openingHour.openHour).padStart(2, "0")}:${String(openingHour.openMinute).padStart(2, "0")} ~ ${String(openingHour.closeHour).padStart(2, "0")}:${String(openingHour.closeMinute).padStart(2, "0")}`
          )
          .join(" / ")}`
      : `${translateDayOfWeek(dayOfWeek as keyof typeof DayOfWeek)} 営業時間外`;
  });
};
