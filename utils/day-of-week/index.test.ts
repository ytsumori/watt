import { describe, expect, it } from "vitest";
import { dayOfWeekToNumber } from ".";

describe("[day-of-week]", () => {
  describe("dayOfWeekToNumber", () => {
    it("正常系", () => {
      expect(dayOfWeekToNumber("MONDAY")).toBe(1);
      expect(dayOfWeekToNumber("TUESDAY")).toBe(2);
      expect(dayOfWeekToNumber("WEDNESDAY")).toBe(3);
      expect(dayOfWeekToNumber("THURSDAY")).toBe(4);
      expect(dayOfWeekToNumber("FRIDAY")).toBe(5);
      expect(dayOfWeekToNumber("SATURDAY")).toBe(6);
      expect(dayOfWeekToNumber("SUNDAY")).toBe(0);
    });
  });
});
