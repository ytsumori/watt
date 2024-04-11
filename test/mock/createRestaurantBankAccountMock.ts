import { Prisma } from "@prisma/client";
import { createRandomStr } from "../util/createRandomId";

type BankAccount = Prisma.RestaurantBankAccountGetPayload<Prisma.RestaurantBankAccountDefaultArgs>;

export const createRestaurantBankAccountMock = (order?: Partial<BankAccount>): BankAccount => {
  return {
    id: createRandomStr(),
    restaurantId: createRandomStr(),
    bankCode: createRandomStr(4),
    branchCode: createRandomStr(4),
    accountType: "SAVINGS",
    accountNo: createRandomStr(10),
    holderName: "ﾜｯﾄﾀﾛｳ",
    isAdminConfirmed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    clientCode: 1,
    ...order
  };
};
