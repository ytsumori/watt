import { CurrentOpeningHoursResult } from "@/lib/places-api/actions";
import { RestaurantGoogleMapOpeningHour } from "@prisma/client";

export const createRestaurantGoogleMapOpeningHourMock = (
  data: Partial<RestaurantGoogleMapOpeningHour>
): RestaurantGoogleMapOpeningHour => {
  return {
    id: "1",
    restaurantId: "1",
    openHour: 9,
    openMinute: 0,
    closeHour: 23,
    closeMinute: 0,
    openDayOfWeek: "SUNDAY",
    closeDayOfWeek: "SUNDAY",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01"),
    isAutomaticallyApplied: false,
    ...data
  };
};

export const mock: {
  currentOpeningHours: NonNullable<CurrentOpeningHoursResult["currentOpeningHours"]>;
  restaurantGoogleMapOpeningHour: RestaurantGoogleMapOpeningHour[];
} = {
  currentOpeningHours: {
    periods: [
      { open: { day: 0, hour: 9, minute: 0 }, close: { day: 0, hour: 14, minute: 0 } },
      { open: { day: 0, hour: 18, minute: 0 }, close: { day: 0, hour: 23, minute: 0 } },
      { open: { day: 1, hour: 9, minute: 0 }, close: { day: 1, hour: 23, minute: 0 } },
      { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 23, minute: 0 } },
      { open: { day: 3, hour: 9, minute: 0 }, close: { day: 3, hour: 23, minute: 0 } },
      { open: { day: 4, hour: 9, minute: 0 }, close: { day: 4, hour: 23, minute: 0 } },
      { open: { day: 5, hour: 9, minute: 0 }, close: { day: 5, hour: 23, minute: 0 } },
      { open: { day: 6, hour: 9, minute: 0 }, close: { day: 6, hour: 23, minute: 0 } }
    ]
  },
  restaurantGoogleMapOpeningHour: [
    createRestaurantGoogleMapOpeningHourMock({ closeHour: 14 }),
    createRestaurantGoogleMapOpeningHourMock({ openHour: 18 }),
    createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "MONDAY", closeDayOfWeek: "MONDAY" }),
    createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "TUESDAY", closeDayOfWeek: "TUESDAY" }),
    createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "WEDNESDAY", closeDayOfWeek: "WEDNESDAY" }),
    createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "THURSDAY", closeDayOfWeek: "THURSDAY" }),
    createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "FRIDAY", closeDayOfWeek: "FRIDAY" }),
    createRestaurantGoogleMapOpeningHourMock({ openDayOfWeek: "SATURDAY", closeDayOfWeek: "SATURDAY" })
  ]
};
