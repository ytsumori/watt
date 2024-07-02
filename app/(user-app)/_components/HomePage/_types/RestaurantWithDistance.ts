import { Prisma } from "@prisma/client";

export type RestaurantWithDistance = Prisma.RestaurantGetPayload<{
  include: {
    meals: {
      select: {
        id: true;
        title: true;
        price: true;
        imagePath: true;
      };
    };
    googleMapPlaceInfo: {
      select: { latitude: true; longitude: true };
    };
    openingHours: {
      select: {
        openHour: true;
        openMinute: true;
        closeHour: true;
        closeMinute: true;
      };
    };
  };
}> & { distance?: string };
