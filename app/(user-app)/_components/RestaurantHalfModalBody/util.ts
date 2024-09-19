import { translateDayOfWeek } from "@/lib/prisma/translate-enum";
import { DayOfWeek, RestaurantGoogleMapOpeningHour } from "@prisma/client";

export const groupedByDayOfWeeks = (
  openingHours: Omit<
    RestaurantGoogleMapOpeningHour,
    "id" | "restaurantId" | "isAutomaticallyApplied" | "createdAt" | "updatedAt"
  >[]
) => {
  const groupedByDayOfWeeks = Object.groupBy(openingHours, (openingHour) => openingHour.openDayOfWeek);
  return Object.keys(DayOfWeek).map((dayOfWeek) => {
    return groupedByDayOfWeeks[dayOfWeek as keyof typeof DayOfWeek]
      ? `${translateDayOfWeek(dayOfWeek as keyof typeof DayOfWeek)} ${groupedByDayOfWeeks[dayOfWeek as keyof typeof DayOfWeek]?.map((openingHour) => `${String(openingHour.openHour).padStart(2, "0")}:${String(openingHour.openMinute).padStart(2, "0")} ~ ${String(openingHour.closeHour).padStart(2, "0")}:${String(openingHour.closeMinute).padStart(2, "0")}`).join(" / ")}`
      : `${translateDayOfWeek(dayOfWeek as keyof typeof DayOfWeek)} 営業時間外`;
  });
};
