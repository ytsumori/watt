import { Prisma } from "@prisma/client";
import { createRandomStr } from "../util/createRandomId";

type Order = Prisma.OrderGetPayload<Prisma.OrderDefaultArgs>;

export const createOrderMock = (order?: Partial<Order>): Order => {
  return {
    id: createRandomStr(),
    orderNumber: 1,
    mealId: createRandomStr(),
    userId: createRandomStr(),
    status: "COMPLETE",
    approvedByRestaurantAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...order
  };
};
