import { OpeningHoursResult } from "../actions";

type RequiredOpeningHours = Required<OpeningHoursResult>["currentOpeningHours"];

export const convertOpeningHours = (currentOpeningHours: RequiredOpeningHours) => {
  return {
    periods: currentOpeningHours?.periods.map((period) => {
      const shouldChangeMinute = period.close.minute === 59;
      const shouldChangeHour = period.close.hour === 23;
      return {
        ...period,
        close: {
          ...period.close,
          day:
            shouldChangeMinute && shouldChangeHour
              ? period.close.day === 6
                ? 0
                : period.close.day + 1
              : period.close.day,
          hour: shouldChangeMinute ? (shouldChangeHour ? 0 : period.close.hour + 1) : period.close.hour,
          minute: shouldChangeMinute ? 0 : period.close.minute
        }
      };
    })
  };
};
