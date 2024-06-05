import { Prisma } from "@prisma/client";
import { createRandomStr } from "../util/createRandomId";

type Order = Prisma.OrderGetPayload<Prisma.OrderDefaultArgs>;

export const createOrderMock = (order?: Partial<Order>): Order => {
  return {
    id: createRandomStr(),
    orderNumber: 1,
    restaurantId: createRandomStr(),
    userId: createRandomStr(),
    peopleCount: 1,
    approvedByRestaurantAt: new Date(),
    completedAt: new Date(),
    canceledAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...order
  };
};
