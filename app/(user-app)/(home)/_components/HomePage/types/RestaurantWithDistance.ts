import { Prisma } from "@prisma/client";

export type RestaurantListItem = Prisma.RestaurantGetPayload<{
  select: {
    id: true;
    name: true;
    isAvailable: true;
    interiorImagePath: true;
    meals: {
      select: {
        id: true;
        title: true;
        price: true;
        listPrice: true;
        imagePath: true;
      };
    };
    googleMapPlaceInfo: {
      select: { latitude: true; longitude: true };
    };
    openingHours: {
      select: {
        id: true;
        openHour: true;
        openMinute: true;
        openDayOfWeek: true;
        closeHour: true;
        closeMinute: true;
        closeDayOfWeek: true;
      };
    };
    holidays: {
      select: {
        date: true;
        openingHours: {
          select: {
            id: true;
            openHour: true;
            openMinute: true;
            openDayOfWeek: true;
            closeHour: true;
            closeMinute: true;
            closeDayOfWeek: true;
          };
        };
      };
    };
  };
}>;

export type RestaurantWithDistance = RestaurantListItem & { distance?: string };
