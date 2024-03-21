import { describe, expect, it, vi } from "vitest";
import { calculateDateRange } from "./util";
import { format } from "date-fns";

describe("[DateRangeEditor / util]", () => {
  vi.useFakeTimers();
  describe("calculateDateRange", () => {
    vi.setSystemTime(new Date("2024/08/21 21:30:00:123"));

    describe("searchParamsがない時", () => {
      it("Date型で返ってくる", () => {
        const dateRange = calculateDateRange({});
        expect(dateRange.start).toBeInstanceOf(Date);
        expect(dateRange.end).toBeInstanceOf(Date);
      });

      it("日本時間に戻した時に意図した時間になっている", () => {
        const dateRange = calculateDateRange({});
        expect(format(dateRange.start, "yyyy-MM-dd HH:mm:ss")).toBe("2024-07-21 00:00:00");
        expect(format(dateRange.end, "yyyy-MM-dd HH:mm:ss")).toBe("2024-08-21 23:59:59");
      });
    });

    describe("searchParamsがある時", () => {
      const searchParams = { start: "2024-03-05", end: "2024-04-25" };
      it("Date型で返ってくる", () => {
        const dateRange = calculateDateRange(searchParams);
        expect(dateRange.start).toBeInstanceOf(Date);
        expect(dateRange.end).toBeInstanceOf(Date);
      });

      it("日本時間に戻した時に意図した時間になっている", () => {
        const dateRange = calculateDateRange(searchParams);
        expect(format(dateRange.start, "yyyy-MM-dd HH:mm:ss")).toBe("2024-03-05 00:00:00");
        expect(format(dateRange.end, "yyyy-MM-dd HH:mm:ss")).toBe("2024-04-25 23:59:59");
      });
    });
  });
  vi.useRealTimers();
});
