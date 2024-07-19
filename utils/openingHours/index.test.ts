import { OpeningHoursResult } from "@/lib/places-api";
import { describe, expect, it } from "vitest";
import { convertOpeningHours } from ".";

describe("[utils/openingHours]", () => {
  const mock: OpeningHoursResult["currentOpeningHours"] = {
    periods: [
      { open: { day: 0, hour: 0, minute: 0 }, close: { day: 0, hour: 23, minute: 59 } },
      { open: { day: 0, hour: 0, minute: 0 }, close: { day: 0, hour: 0, minute: 0 } },
      { open: { day: 0, hour: 0, minute: 0 }, close: { day: 0, hour: 19, minute: 10 } }
    ]
  };

  it("convertOpeningHours", () => {
    const converted = convertOpeningHours(mock);
    expect(converted).toEqual({
      periods: [
        { open: { day: 0, hour: 0, minute: 0 }, close: { day: 0, hour: 0, minute: 0 } },
        { open: { day: 0, hour: 0, minute: 0 }, close: { day: 0, hour: 0, minute: 0 } },
        { open: { day: 0, hour: 0, minute: 0 }, close: { day: 0, hour: 19, minute: 10 } }
      ]
    });
  });
});
