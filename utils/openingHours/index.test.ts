import { OpeningHoursResult } from "@/lib/places-api";
import { describe, expect, it } from "vitest";
import { convertOpeningHours } from ".";

describe("[utils/openingHours]", () => {
  const mock: OpeningHoursResult["currentOpeningHours"] = {
    periods: [
      { open: { day: 0, hour: 0, minute: 0 }, close: { day: 0, hour: 23, minute: 59 } },
      { open: { day: 1, hour: 17, minute: 0 }, close: { day: 2, hour: 0, minute: 0 } },
      { open: { day: 2, hour: 17, minute: 0 }, close: { day: 2, hour: 19, minute: 10 } },
      { open: { day: 6, hour: 17, minute: 0 }, close: { day: 6, hour: 22, minute: 59 } },
      { open: { day: 6, hour: 17, minute: 0 }, close: { day: 6, hour: 23, minute: 59 } }
    ]
  };

  it("convertOpeningHours", () => {
    const converted = convertOpeningHours(mock);
    expect(converted).toEqual({
      periods: [
        { open: { day: 0, hour: 0, minute: 0 }, close: { day: 1, hour: 0, minute: 0 } },
        { open: { day: 1, hour: 17, minute: 0 }, close: { day: 2, hour: 0, minute: 0 } },
        { open: { day: 2, hour: 17, minute: 0 }, close: { day: 2, hour: 19, minute: 10 } },
        { open: { day: 6, hour: 17, minute: 0 }, close: { day: 6, hour: 23, minute: 0 } },
        { open: { day: 6, hour: 17, minute: 0 }, close: { day: 0, hour: 0, minute: 0 } }
      ]
    });
  });
});
