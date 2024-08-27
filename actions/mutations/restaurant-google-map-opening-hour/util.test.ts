import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  convertCurrentOpeningHours,
  createBusinessHourDiff,
  createBusinessHoursGroupedByDayOfWeek,
  getDateOfDayThisWeek
} from "./util";
import { createRestaurantGoogleMapOpeningHourMock, mock } from "./mock";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-08-24"));
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

  describe("getDateOfDayThisWeek", () => {
    it("正常系", () => {
      expect(getDateOfDayThisWeek(0)).toStrictEqual(new Date("2024-08-18T00:00:00.000Z"));
      expect(getDateOfDayThisWeek(1)).toStrictEqual(new Date("2024-08-19T00:00:00.000Z"));
      expect(getDateOfDayThisWeek(2)).toStrictEqual(new Date("2024-08-20T00:00:00.000Z"));
      expect(getDateOfDayThisWeek(3)).toStrictEqual(new Date("2024-08-21T00:00:00.000Z"));
      expect(getDateOfDayThisWeek(4)).toStrictEqual(new Date("2024-08-22T00:00:00.000Z"));
      expect(getDateOfDayThisWeek(5)).toStrictEqual(new Date("2024-08-23T00:00:00.000Z"));
      expect(getDateOfDayThisWeek(6)).toStrictEqual(new Date("2024-08-24T00:00:00.000Z"));
      vi.useRealTimers();
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
          { date: new Date("2024-08-19"), holidayOpeningHours: [] },
          { date: new Date("2024-08-20"), holidayOpeningHours: [] },
          { date: new Date("2024-08-21"), holidayOpeningHours: [] }
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

        expect(result).toStrictEqual([{ date: new Date("2024-08-18"), holidayOpeningHours: [] }]);
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
            date: new Date("2024-08-23"),
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
            date: new Date("2024-08-23"),
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
            date: new Date("2024-08-24"),
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
            date: new Date("2024-08-18"),
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
            date: new Date("2024-08-18"),
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
            date: new Date("2024-08-18"),
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
            date: new Date("2024-08-20"),
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
