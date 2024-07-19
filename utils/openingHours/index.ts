import { OpeningHoursResult } from "@/lib/places-api";

export const convertOpeningHours = (
  currentOpeningHours: OpeningHoursResult["currentOpeningHours"]
): OpeningHoursResult["currentOpeningHours"] => {
  return currentOpeningHours
    ? {
        periods: currentOpeningHours.periods.map((period) => ({
          ...period,
          close: {
            ...period.close,
            hour:
              period.close.minute === 59 ? (period.close.hour === 23 ? 0 : period.close.hour + 1) : period.close.hour,
            minute: period.close.minute === 59 ? 0 : period.close.minute
          }
        }))
      }
    : currentOpeningHours;
};
