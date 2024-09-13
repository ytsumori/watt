import { translateDayOfWeek } from "@/lib/prisma/translate-enum";
import { dayOfWeekToNumber } from "@/utils/day-of-week";
import { DayOfWeek, RestaurantGoogleMapOpeningHour } from "@prisma/client";

export const groupedByDayOfWeeks = (
  openingHours: Omit<
    RestaurantGoogleMapOpeningHour,
    "id" | "restaurantId" | "isAutomaticallyApplied" | "createdAt" | "updatedAt"
  >[]
) => {
  return Object.entries(Object.groupBy(openingHours, (openingHour) => openingHour.openDayOfWeek))
    .sort(
      (a, b) => dayOfWeekToNumber(a[0] as keyof typeof DayOfWeek) - dayOfWeekToNumber(b[0] as keyof typeof DayOfWeek)
    )
    .map(([dayOfWeek, openingHours]) => {
      return `${translateDayOfWeek(dayOfWeek as keyof typeof DayOfWeek)} ${openingHours.map((openingHour) => `${String(openingHour.openHour).padStart(2, "0")}:${String(openingHour.openMinute).padStart(2, "0")} ~ ${String(openingHour.closeHour).padStart(2, "0")}:${String(openingHour.closeMinute).padStart(2, "0")}`).join(" / ")}`;
    });
};
