import { describe, expect, it } from "vitest";
import { calculateDistance } from ".";

describe("calculateDistance", () => {
  it("1km以上の場合", () => {
    const origin = { lat: 34.6945697, lng: 135.4944221 };
    const destination = { lat: 34.6793155, lng: 135.4935641 };
    const distance = calculateDistance({ origin, destination });
    expect(distance?.formatted).toBe("1.7km");
    expect(distance?.raw).toBe(1699);
  });

  it("1km未満の場合", () => {
    const origin = { lat: 34.6793155, lng: 135.4935641 };
    const destination = { lat: 34.6795609, lng: 135.4957888 };
    const distance = calculateDistance({ origin, destination });
    expect(distance?.formatted).toBe("205m");
    expect(distance?.raw).toBe(205);
  });
});
