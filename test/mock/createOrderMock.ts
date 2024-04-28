import { Prisma } from "@prisma/client";
import { createRandomStr } from "../util/createRandomId";

type Order = Prisma.OrderGetPayload<Prisma.OrderDefaultArgs>;

export const createOrderMock = (order?: Partial<Order>): Order => {
  return {
    id: createRandomStr(),
    orderNumber: 1,
    mealId: createRandomStr(),
    userId: createRandomStr(),
    taskId: null,
    providerPaymentId: createRandomStr(),
    status: "COMPLETE",
    price: 1000,
    restaurantProfitPrice: 1200,
    isDownloaded: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...order
  };
};
