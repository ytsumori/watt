import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentOpeningHour, getNextOpeningHour } from ".";
import { DayOfWeek } from "@prisma/client";

describe("[opening-hours]", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getCurrentOpeningHour", () => {
    it("returns current opening hour", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 15,
          closeMinute: 0
        },
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 17,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 22,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 9, 0, 0)); // JST: 2024-04-01 18:00:00 Monday
      expect(getCurrentOpeningHour(jstOpeningHours)).toStrictEqual({
        openDayOfWeek: DayOfWeek.MONDAY,
        openHour: 17,
        openMinute: 0,
        closeDayOfWeek: DayOfWeek.MONDAY,
        closeHour: 22,
        closeMinute: 0
      });
    });

    it("returns undefined if currently not opened", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.SUNDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.SUNDAY,
          closeHour: 15,
          closeMinute: 0
        },
        {
          openDayOfWeek: DayOfWeek.SUNDAY,
          openHour: 17,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.SUNDAY,
          closeHour: 22,
          closeMinute: 0
        },
        {
          openDayOfWeek: DayOfWeek.TUESDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.TUESDAY,
          closeHour: 15,
          closeMinute: 0
        },
        {
          openDayOfWeek: DayOfWeek.TUESDAY,
          openHour: 17,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.TUESDAY,
          closeHour: 22,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 9, 0, 0)); // JST: 2024-04-01 18:00:00 Monday
      expect(getCurrentOpeningHour(jstOpeningHours)).toBe(undefined);
    });

    it("returns undefined if currently not opened, closed 1 minute before", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 15,
          closeMinute: 0
        },
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 17,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 23,
          closeMinute: 30
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 14, 31, 0)); // JST: 2024-04-01 23:31:00 Monday
      expect(getCurrentOpeningHour(jstOpeningHours)).toBe(undefined);
    });

    it("returns undefined if currently not opened, closed 1 minute before", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 15,
          closeMinute: 0
        },
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 17,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 23,
          closeMinute: 30
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 14, 29, 0)); // JST: 2024-04-01 23:29:00 Monday
      expect(getCurrentOpeningHour(jstOpeningHours)).toStrictEqual({
        openDayOfWeek: DayOfWeek.MONDAY,
        openHour: 17,
        openMinute: 0,
        closeDayOfWeek: DayOfWeek.MONDAY,
        closeHour: 23,
        closeMinute: 30
      });
    });

    it("returns current opening hour when the closing time is the next day", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.TUESDAY,
          closeHour: 3,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 14, 0, 0)); // JST: 2024-04-01 23:00:00 Monday
      expect(getCurrentOpeningHour(jstOpeningHours)).toStrictEqual({
        openDayOfWeek: DayOfWeek.MONDAY,
        openHour: 11,
        openMinute: 0,
        closeDayOfWeek: DayOfWeek.TUESDAY,
        closeHour: 3,
        closeMinute: 0
      });
    });

    it("returns current opening hour when the opening time is the previous day", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.SUNDAY,
          openHour: 18,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 3,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 2, 31, 16, 0, 0)); // JST: 2024-04-01 1:00:00 Monday
      expect(getCurrentOpeningHour(jstOpeningHours)).toStrictEqual({
        openDayOfWeek: DayOfWeek.SUNDAY,
        openHour: 18,
        openMinute: 0,
        closeDayOfWeek: DayOfWeek.MONDAY,
        closeHour: 3,
        closeMinute: 0
      });
    });

    it("returns current opening hour when the closing time is the next day", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.TUESDAY,
          closeHour: 3,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 14, 0, 0)); // JST: 2024-04-01 23:00:00 Monday
      expect(getCurrentOpeningHour(jstOpeningHours)).toStrictEqual({
        openDayOfWeek: DayOfWeek.MONDAY,
        openHour: 11,
        openMinute: 0,
        closeDayOfWeek: DayOfWeek.TUESDAY,
        closeHour: 3,
        closeMinute: 0
      });
    });

    it("returns current opening hour when the opening time is the previous day through weekend", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.SATURDAY,
          openHour: 18,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.SUNDAY,
          closeHour: 3,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 2, 30, 16, 0, 0)); // JST: 2024-03-31 1:00:00 Sunday
      expect(getCurrentOpeningHour(jstOpeningHours)).toStrictEqual({
        openDayOfWeek: DayOfWeek.SATURDAY,
        openHour: 18,
        openMinute: 0,
        closeDayOfWeek: DayOfWeek.SUNDAY,
        closeHour: 3,
        closeMinute: 0
      });
    });

    it("returns current opening hour when the closing time is the next day through weekend", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.SATURDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.SUNDAY,
          closeHour: 3,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 2, 30, 14, 0, 0)); // JST: 2024-03-30 23:00:00 Saturday
      expect(getCurrentOpeningHour(jstOpeningHours)).toStrictEqual({
        openDayOfWeek: DayOfWeek.SATURDAY,
        openHour: 11,
        openMinute: 0,
        closeDayOfWeek: DayOfWeek.SUNDAY,
        closeHour: 3,
        closeMinute: 0
      });
    });
  });

  describe("getNextOpeningHour", () => {
    it("returns next opening hour", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 15,
          closeMinute: 0
        },
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 17,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 22,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 7, 0, 0)); // JST: 2024-04-01 16:00:00 Monday
      expect(getNextOpeningHour(jstOpeningHours)).toStrictEqual({ hour: 17, minute: 0 });
    });

    it("returns undefined if next opening hour is tomorrow", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.TUESDAY,
          openHour: 11,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.TUESDAY,
          closeHour: 15,
          closeMinute: 0
        },
        {
          openDayOfWeek: DayOfWeek.TUESDAY,
          openHour: 17,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.TUESDAY,
          closeHour: 22,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 14, 0, 0)); // JST: 2024-04-01 23:00:00 Monday
      expect(getNextOpeningHour(jstOpeningHours)).toBe(undefined);
    });

    it("returns undefined if currently opened and no next opening hour", () => {
      const jstOpeningHours = [
        {
          openDayOfWeek: DayOfWeek.MONDAY,
          openHour: 18,
          openMinute: 0,
          closeDayOfWeek: DayOfWeek.MONDAY,
          closeHour: 23,
          closeMinute: 0
        }
      ];
      vi.setSystemTime(Date.UTC(2024, 3, 1, 11, 0, 0)); // JST: 2024-04-01 20:00:00 Monday
      expect(getNextOpeningHour(jstOpeningHours)).toBe(undefined);
    });
  });
});
