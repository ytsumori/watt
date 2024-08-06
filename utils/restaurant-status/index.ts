import { Prisma } from "@prisma/client";
import { isCurrentlyWorkingHour } from "../opening-hours";

export type RestaurantStatus = "open" | "packed" | "full" | "close";

export function getRestaurantStatus(
  restaurant: Prisma.RestaurantGetPayload<{
    select: {
      isOpen: true;
      openingHours: {
        select: {
          openHour: true;
          openMinute: true;
          openDayOfWeek: true;
          closeHour: true;
          closeMinute: true;
          closeDayOfWeek: true;
        };
      };
      fullStatuses: {
        where: {
          easedAt: null;
        };
        select: {
          easedAt: true;
        };
      };
    };
  }>
): RestaurantStatus {
  if (restaurant.isOpen) {
    return restaurant.fullStatuses.some((status) => status.easedAt === null) ? "packed" : "open";
  } else {
    return isCurrentlyWorkingHour(restaurant.openingHours) ? "full" : "close";
  }
}
