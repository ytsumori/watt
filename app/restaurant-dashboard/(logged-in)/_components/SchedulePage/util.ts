import { isCurrentOpeningHour, mergeOpeningHours } from "@/utils/opening-hours";
import { getJSTFromUTC } from "@/utils/timezone";

export const getCurrentOpeningHourWithId = (openingHours: ReturnType<typeof mergeOpeningHours>) => {
  const now = new Date();
  const currentUtcDay = now.getUTCDay();
  const currentUtcHour = now.getUTCHours();
  const currentUtcMinute = now.getUTCMinutes();
  const { jstDayOfWeek: currentJstDay, jstHour: currentJstHour } = getJSTFromUTC(currentUtcDay, currentUtcHour);
  return openingHours.find((openingHour) =>
    isCurrentOpeningHour({ openingHour, currentJstDay, currentJstHour, currentUtcMinute })
  );
};
