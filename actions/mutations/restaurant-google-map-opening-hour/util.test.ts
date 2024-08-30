import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  convertCurrentOpeningHours,
  createBusinessHourDiff,
  createBusinessHoursGroupedByDayOfWeek,
  getDateOfNextSevenDays
} from "./util";
import { createRestaurantGoogleMapOpeningHourMock, mock } from "./mock";

beforeEach(() => {
  vi.useFakeTimers();
  // 日本時間で2024-09-01T21:15:00になる
  vi.setSystemTime(new Date("2024-09-01T12:15:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("【mutations/restaurant-google-map-opening-hour/util】", () => {
  describe("convertCurrentOpeningHours", () => {
    it("正常系", () => {
      expect(convertCurrentOpeningHours("1", mock.currentOpeningHours)).toStrictEqual(
        mock.restaurantGoogleMapOpeningHour.map((data) => {
          const { id, isAutomaticallyApplied, updatedAt, createdAt, ...rest } = data;
          return rest;
        })
      );
    });
  });

  describe("createBusinessHoursGroupedByDayOfWeek", () => {
    it("正常系", () => {
      expect(createBusinessHoursGroupedByDayOfWeek(mock.restaurantGoogleMapOpeningHour)).toStrictEqual({
        SUNDAY: [
          createRestaurantGoogleMapOpeningHourMock({ closeHour: 14 }),
          createRestaurantGoogleMapOpeningHourMock({ openHour: 18 })
        ],
        MONDAY: [createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "MONDAY", closeDayOfWeek: "MONDAY" })],
        TUESDAY: [createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "TUESDAY", closeDayOfWeek: "TUESDAY" })],
        WEDNESDAY: [
          createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "WEDNESDAY", closeDayOfWeek: "WEDNESDAY" })
        ],
        THURSDAY: [createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "THURSDAY", closeDayOfWeek: "THURSDAY" })],
        FRIDAY: [createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "FRIDAY", closeDayOfWeek: "FRIDAY" })],
        SATURDAY: [createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "SATURDAY", closeDayOfWeek: "SATURDAY" })]
      });
    });
  });

  describe("getDateOfNextSevenDays", () => {
    it("正常系", () => {
      expect(getDateOfNextSevenDays(0)).eq(20240901);
      expect(getDateOfNextSevenDays(1)).eq(20240902);
      expect(getDateOfNextSevenDays(2)).eq(20240903);
      expect(getDateOfNextSevenDays(3)).eq(20240904);
      expect(getDateOfNextSevenDays(4)).eq(20240905);
      expect(getDateOfNextSevenDays(5)).eq(20240906);
      expect(getDateOfNextSevenDays(6)).eq(20240907);
    });

    it("指定した曜日に行くために週を跨ぐ場合(1)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-09-03T12:15:00.000Z"));
      expect(getDateOfNextSevenDays(0)).eq(20240908);
      expect(getDateOfNextSevenDays(1)).eq(20240909);
      expect(getDateOfNextSevenDays(2)).eq(20240903);
      expect(getDateOfNextSevenDays(3)).eq(20240904);
      expect(getDateOfNextSevenDays(4)).eq(20240905);
      expect(getDateOfNextSevenDays(5)).eq(20240906);
      expect(getDateOfNextSevenDays(6)).eq(20240907);
    });

    it("指定した曜日に行くために週を跨ぐ場合(2)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-09-07T12:15:00.000Z"));
      expect(getDateOfNextSevenDays(0)).eq(20240908);
      expect(getDateOfNextSevenDays(1)).eq(20240909);
      expect(getDateOfNextSevenDays(2)).eq(20240910);
      expect(getDateOfNextSevenDays(3)).eq(20240911);
      expect(getDateOfNextSevenDays(4)).eq(20240912);
      expect(getDateOfNextSevenDays(5)).eq(20240913);
      expect(getDateOfNextSevenDays(6)).eq(20240907);
    });

    it("timezoneが違っても動く", () => {
      vi.stubEnv("TZ", "America/Los_Angeles");
      expect(getDateOfNextSevenDays(0)).eq(20240901);
      expect(getDateOfNextSevenDays(1)).eq(20240902);
      expect(getDateOfNextSevenDays(2)).eq(20240903);
      expect(getDateOfNextSevenDays(3)).eq(20240904);
      expect(getDateOfNextSevenDays(4)).eq(20240905);
      expect(getDateOfNextSevenDays(5)).eq(20240906);
      expect(getDateOfNextSevenDays(6)).eq(20240907);
    });
  });

  describe("createBusinessHourDiff", () => {
    describe("差分がない場合", () => {
      it("営業日・時間が普段と同じ場合", async () => {
        const result = await createBusinessHourDiff({
          restaurantId: "1",
          currentOpeningHours: mock.currentOpeningHours,
          regularOpeningHours: mock.restaurantGoogleMapOpeningHour
        });

        const expected: string[] = [];
        expect(result).toStrictEqual(expected);
      });
    });

    describe("営業日が普段より少なかった場合", () => {
      const regularOpeningHours = [
        createRestaurantGoogleMapOpeningHourMock({ closeHour: 14 }),
        createRestaurantGoogleMapOpeningHourMock({ openHour: 18 }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "MONDAY", closeDayOfWeek: "MONDAY" }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "TUESDAY", closeDayOfWeek: "TUESDAY" }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "WEDNESDAY", closeDayOfWeek: "WEDNESDAY" }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "THURSDAY", closeDayOfWeek: "THURSDAY" }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "FRIDAY", closeDayOfWeek: "FRIDAY" }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "SATURDAY", closeDayOfWeek: "SATURDAY" })
      ];

      it("月火水営業しない", async () => {
        const currentOpeningHours = {
          periods: [
            { open: { day: 0, hour: 9, minute: 0 }, close: { day: 0, hour: 14, minute: 0 } },
            { open: { day: 0, hour: 18, minute: 0 }, close: { day: 0, hour: 23, minute: 0 } },
            { open: { day: 4, hour: 9, minute: 0 }, close: { day: 4, hour: 23, minute: 0 } },
            { open: { day: 5, hour: 9, minute: 0 }, close: { day: 5, hour: 23, minute: 0 } },
            { open: { day: 6, hour: 9, minute: 0 }, close: { day: 6, hour: 23, minute: 0 } }
          ]
        };

        const result = await createBusinessHourDiff({
          restaurantId: "1",
          currentOpeningHours: currentOpeningHours,
          regularOpeningHours: regularOpeningHours
        });

        expect(result).toStrictEqual([
          { date: 20240902, holidayOpeningHours: [] },
          { date: 20240903, holidayOpeningHours: [] },
          { date: 20240904, holidayOpeningHours: [] }
        ]);
      });

      it("日曜日営業しない", async () => {
        const currentOpeningHours = {
          periods: [
            { open: { day: 1, hour: 9, minute: 0 }, close: { day: 1, hour: 23, minute: 0 } },
            { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 23, minute: 0 } },
            { open: { day: 3, hour: 9, minute: 0 }, close: { day: 3, hour: 23, minute: 0 } },
            { open: { day: 4, hour: 9, minute: 0 }, close: { day: 4, hour: 23, minute: 0 } },
            { open: { day: 5, hour: 9, minute: 0 }, close: { day: 5, hour: 23, minute: 0 } },
            { open: { day: 6, hour: 9, minute: 0 }, close: { day: 6, hour: 23, minute: 0 } }
          ]
        };

        const result = await createBusinessHourDiff({
          restaurantId: "1",
          currentOpeningHours: currentOpeningHours,
          regularOpeningHours: regularOpeningHours
        });

        expect(result).toStrictEqual([{ date: 20240901, holidayOpeningHours: [] }]);
      });
    });

    describe("営業日が普段より多かった場合", async () => {
      const regularOpeningHours = [
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "MONDAY", closeDayOfWeek: "MONDAY" }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "TUESDAY", closeDayOfWeek: "TUESDAY" }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "WEDNESDAY", closeDayOfWeek: "WEDNESDAY" }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "THURSDAY", closeDayOfWeek: "THURSDAY" })
      ];

      it("金曜日も営業する", async () => {
        const currentOpeningHours = {
          periods: [
            { open: { day: 1, hour: 9, minute: 0 }, close: { day: 1, hour: 23, minute: 0 } },
            { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 23, minute: 0 } },
            { open: { day: 3, hour: 9, minute: 0 }, close: { day: 3, hour: 23, minute: 0 } },
            { open: { day: 4, hour: 9, minute: 0 }, close: { day: 4, hour: 23, minute: 0 } },
            { open: { day: 5, hour: 9, minute: 0 }, close: { day: 5, hour: 23, minute: 0 } }
          ]
        };

        const result = await createBusinessHourDiff({
          restaurantId: "1",
          currentOpeningHours: currentOpeningHours,
          regularOpeningHours: regularOpeningHours
        });

        expect(result).toStrictEqual([
          {
            date: 20240906,
            holidayOpeningHours: [
              {
                closeDayOfWeek: "FRIDAY",
                closeHour: 23,
                closeMinute: 0,
                openDayOfWeek: "FRIDAY",
                openHour: 9,
                openMinute: 0,
                restaurantId: "1"
              }
            ]
          }
        ]);
      });

      it("金土日も複数時間に分けて営業する", async () => {
        const currentOpeningHours = {
          periods: [
            { open: { day: 0, hour: 9, minute: 0 }, close: { day: 0, hour: 14, minute: 0 } },
            { open: { day: 0, hour: 18, minute: 0 }, close: { day: 0, hour: 23, minute: 59 } },
            { open: { day: 1, hour: 9, minute: 0 }, close: { day: 1, hour: 23, minute: 0 } },
            { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 23, minute: 0 } },
            { open: { day: 3, hour: 9, minute: 0 }, close: { day: 3, hour: 23, minute: 0 } },
            { open: { day: 4, hour: 9, minute: 0 }, close: { day: 4, hour: 23, minute: 0 } },
            { open: { day: 5, hour: 9, minute: 0 }, close: { day: 5, hour: 23, minute: 0 } },
            { open: { day: 6, hour: 9, minute: 0 }, close: { day: 6, hour: 23, minute: 0 } }
          ]
        };

        const result = await createBusinessHourDiff({
          restaurantId: "1",
          currentOpeningHours: currentOpeningHours,
          regularOpeningHours: regularOpeningHours
        });

        expect(result).toStrictEqual([
          {
            date: 20240906,
            holidayOpeningHours: [
              {
                closeDayOfWeek: "FRIDAY",
                closeHour: 23,
                closeMinute: 0,
                openDayOfWeek: "FRIDAY",
                openHour: 9,
                openMinute: 0,
                restaurantId: "1"
              }
            ]
          },
          {
            date: 20240907,
            holidayOpeningHours: [
              {
                closeDayOfWeek: "SATURDAY",
                closeHour: 23,
                closeMinute: 0,
                openDayOfWeek: "SATURDAY",
                openHour: 9,
                openMinute: 0,
                restaurantId: "1"
              }
            ]
          },
          {
            date: 20240901,
            holidayOpeningHours: [
              {
                closeDayOfWeek: "SUNDAY",
                closeHour: 14,
                closeMinute: 0,
                openDayOfWeek: "SUNDAY",
                openHour: 9,
                openMinute: 0,
                restaurantId: "1"
              },
              {
                closeDayOfWeek: "MONDAY",
                closeHour: 0,
                closeMinute: 0,
                openDayOfWeek: "SUNDAY",
                openHour: 18,
                openMinute: 0,
                restaurantId: "1"
              }
            ]
          }
        ]);
      });
    });

    describe("営業日が同じで営業時間のみ変更の場合", () => {
      const regularOpeningHours = [
        createRestaurantGoogleMapOpeningHourMock({ closeHour: 14 }),
        createRestaurantGoogleMapOpeningHourMock({ openHour: 18 }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "MONDAY", closeDayOfWeek: "MONDAY", openHour: 12 }),
        createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "TUESDAY", closeDayOfWeek: "TUESDAY", closeHour: 14 })
      ];

      it("営業時間が変更されている", async () => {
        const currentOpeningHours = {
          periods: [
            { open: { day: 0, hour: 9, minute: 0 }, close: { day: 0, hour: 15, minute: 0 } },
            { open: { day: 0, hour: 18, minute: 0 }, close: { day: 0, hour: 23, minute: 0 } },
            { open: { day: 1, hour: 12, minute: 0 }, close: { day: 1, hour: 23, minute: 0 } },
            { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 14, minute: 0 } }
          ]
        };

        const result = await createBusinessHourDiff({
          restaurantId: "1",
          currentOpeningHours: currentOpeningHours,
          regularOpeningHours: regularOpeningHours
        });

        expect(result).toStrictEqual([
          {
            date: 20240901,
            holidayOpeningHours: [
              {
                closeDayOfWeek: "SUNDAY",
                closeHour: 15,
                closeMinute: 0,
                openDayOfWeek: "SUNDAY",
                openHour: 9,
                openMinute: 0,
                restaurantId: "1"
              },
              {
                closeDayOfWeek: "SUNDAY",
                closeHour: 23,
                closeMinute: 0,
                openDayOfWeek: "SUNDAY",
                openHour: 18,
                openMinute: 0,
                restaurantId: "1"
              }
            ]
          }
        ]);
      });
      it("午後の営業日がなくなる", async () => {
        const currentOpeningHours = {
          periods: [
            { open: { day: 0, hour: 9, minute: 0 }, close: { day: 0, hour: 14, minute: 0 } },
            { open: { day: 1, hour: 12, minute: 0 }, close: { day: 1, hour: 23, minute: 0 } },
            { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 14, minute: 0 } }
          ]
        };

        const result = await createBusinessHourDiff({
          restaurantId: "1",
          currentOpeningHours: currentOpeningHours,
          regularOpeningHours: regularOpeningHours
        });

        expect(result).toStrictEqual([
          {
            date: 20240901,
            holidayOpeningHours: [
              {
                closeDayOfWeek: "SUNDAY",
                closeHour: 14,
                closeMinute: 0,
                openDayOfWeek: "SUNDAY",
                openHour: 9,
                openMinute: 0,
                restaurantId: "1"
              }
            ]
          }
        ]);
      });
      it("午後の営業日が増える", async () => {
        const currentOpeningHours = {
          periods: [
            { open: { day: 0, hour: 9, minute: 0 }, close: { day: 0, hour: 14, minute: 0 } },
            { open: { day: 0, hour: 18, minute: 0 }, close: { day: 0, hour: 23, minute: 0 } },
            { open: { day: 1, hour: 12, minute: 0 }, close: { day: 1, hour: 23, minute: 0 } },
            { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 14, minute: 0 } },
            { open: { day: 2, hour: 15, minute: 0 }, close: { day: 2, hour: 23, minute: 0 } }
          ]
        };

        const result = await createBusinessHourDiff({
          restaurantId: "1",
          currentOpeningHours: currentOpeningHours,
          regularOpeningHours: regularOpeningHours
        });

        expect(result).toStrictEqual([
          {
            date: 20240903,
            holidayOpeningHours: [
              {
                closeDayOfWeek: "TUESDAY",
                closeHour: 14,
                closeMinute: 0,
                openDayOfWeek: "TUESDAY",
                openHour: 9,
                openMinute: 0,
                restaurantId: "1"
              },
              {
                closeDayOfWeek: "TUESDAY",
                closeHour: 23,
                closeMinute: 0,
                openDayOfWeek: "TUESDAY",
                openHour: 15,
                openMinute: 0,
                restaurantId: "1"
              }
            ]
          }
        ]);
      });
    });
  });
});
