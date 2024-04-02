import { DayOfWeek } from "@prisma/client";

export function dayOfWeekToNumber(dayOfWeek: DayOfWeek) {
  switch (dayOfWeek) {
    case "SUNDAY":
      return 0;
    case "MONDAY":
      return 1;
    case "TUESDAY":
      return 2;
    case "WEDNESDAY":
      return 3;
    case "THURSDAY":
      return 4;
    case "FRIDAY":
      return 5;
    case "SATURDAY":
      return 6;
  }
}

export function dayNumberToDayOfWeek(dayNumber: number): DayOfWeek {
  switch (dayNumber) {
    case 0:
      return "SUNDAY";
    case 1:
      return "MONDAY";
    case 2:
      return "TUESDAY";
    case 3:
      return "WEDNESDAY";
    case 4:
      return "THURSDAY";
    case 5:
      return "FRIDAY";
    case 6:
      return "SATURDAY";
    default:
      throw new Error(`Invalid day of week: ${dayNumber}`);
  }
}
