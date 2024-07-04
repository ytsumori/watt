import { Prisma } from "@prisma/client";
import { createRandomStr } from "../util/createRandomId";

type Restaurant = Prisma.RestaurantGetPayload<Prisma.RestaurantDeleteArgs>;

export const createRestaurantMock = (restaurant?: Partial<Restaurant>): Restaurant => {
  return {
    id: createRandomStr(),
    name: createRandomStr(5),
    isOpen: true,
    googleMapPlaceId: createRandomStr(5),
    password: createRandomStr(20),
    smokingOption: null,
    phoneNumber: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    interiorImagePath: null,
    ...restaurant
  };
};
