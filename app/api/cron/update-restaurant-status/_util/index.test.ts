import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isOpenNow } from ".";

describe("[update-restaurant-status / _util]", () => {
  describe("isOpenNow", () => {
    beforeEach(() => {
      // tell vitest we use mocked time
      vi.useFakeTimers();
    });

    afterEach(() => {
      // restoring date after each test run
      vi.useRealTimers();
    });

    it("returns true when the time is Monday 9am and open from 9am to 10pm on Monday", () => {
      const date = new Date(2024, 3, 1, 9, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 9,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 22,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(true);
    });

    it("returns false when the time is Monday 8:59am and open from 9am to 10pm on Monday", () => {
      const date = new Date(2024, 3, 1, 8, 59, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 9,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 22,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(false);
    });

    it("returns false when the time is Monday 10pm and open from 9am to 10pm on Monday", () => {
      const date = new Date(2024, 3, 1, 22, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 9,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 22,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(false);
    });

    it("returns true when the time is Monday 11pm and open from Monday 9am to Tuesday 3am", () => {
      const date = new Date(2024, 3, 1, 23, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 9,
          openMinute: 0,
          closeDayOfWeek: "TUESDAY" as const,
          closeHour: 3,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(true);
    });

    it("returns true when the time is Tuesday 2am and open from Monday 9am to Tuesday 3am", () => {
      const date = new Date(2024, 3, 2, 2, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 9,
          openMinute: 0,
          closeDayOfWeek: "TUESDAY" as const,
          closeHour: 3,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(true);
    });

    it("returns false when the time is Tuesday 3:01am and open from Monday 9am to Tuesday 3am", () => {
      const date = new Date(2024, 3, 2, 3, 1, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 9,
          openMinute: 0,
          closeDayOfWeek: "TUESDAY" as const,
          closeHour: 3,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(false);
    });

    it("returns false when the time is Monday 3pm and open from 10am to 2pm and 4pm to 8pm on Monday", () => {
      const date = new Date(2024, 3, 1, 15, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 10,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 14,
          closeMinute: 0,
        },
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 16,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 20,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(false);
    });

    it("returns true when the time is Monday 1:59pm and open from 10am to 2pm and 3pm to 8pm on Monday", () => {
      const date = new Date(2024, 3, 1, 13, 59, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 10,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 14,
          closeMinute: 0,
        },
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 15,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 20,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(true);
    });

    it("returns false when the time is Monday 2:00pm and open from 10am to 2pm and 3pm to 8pm on Monday", () => {
      const date = new Date(2024, 3, 1, 14, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 10,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 14,
          closeMinute: 0,
        },
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 15,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 20,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(false);
    });

    it("returns true when the time is Monday 3pm and open from 10am to 2pm and 3pm to 8pm on Monday", () => {
      const date = new Date(2024, 3, 1, 15, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 10,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 14,
          closeMinute: 0,
        },
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 15,
          openMinute: 0,
          closeDayOfWeek: "MONDAY" as const,
          closeHour: 20,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(true);
    });

    it("returns true when the time is Monday 7pm and open from 12pm to 12am on Monday", () => {
      const date = new Date(2024, 3, 1, 19, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "MONDAY" as const,
          openHour: 12,
          openMinute: 0,
          closeDayOfWeek: "TUESDAY" as const,
          closeHour: 0,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(true);
    });

    it("returns true when the time is Saturday 7pm and open from 12pm to 12am on Saturday", () => {
      const date = new Date(2024, 3, 6, 19, 0, 0);
      vi.setSystemTime(date);

      const openingHours = [
        {
          openDayOfWeek: "SATURDAY" as const,
          openHour: 12,
          openMinute: 0,
          closeDayOfWeek: "SUNDAY" as const,
          closeHour: 0,
          closeMinute: 0,
        },
      ];
      const result = isOpenNow(openingHours);
      expect(result).toBe(true);
    });
  });
});
