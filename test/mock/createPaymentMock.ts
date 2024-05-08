import { Prisma } from "@prisma/client";
import { createRandomStr } from "../util/createRandomId";

type Payment = Prisma.PaymentGetPayload<Prisma.PaymentDefaultArgs>;

export const createPaymentMock = (payment?: Partial<Payment>): Payment => {
  return {
    id: createRandomStr(),
    orderId: createRandomStr(),
    stripePaymentId: createRandomStr(),
    additionalAmount: 1000,
    totalAmount: 1000,
    restaurantProfitPrice: 1200,
    isCsvDownloaded: false,
    completedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...payment
  };
};
