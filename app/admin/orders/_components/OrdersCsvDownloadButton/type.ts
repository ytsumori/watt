import { BankAccountType, Order, OrderStatus, Prisma, RestaurantBankAccount } from "@prisma/client";

export type DownloadableOrder = Prisma.OrderGetPayload<{
  select: {
    id: true;
    providerPaymentId: true;
    price: true;
    restaurantProfitPrice: true;
    status: true;
    isDownloaded: true;
    createdAt: true;
    meal: {
      select: {
        restaurant: {
          select: {
            id: true;
            name: true;
            bankAccount: {
              select: {
                bankCode: true;
                branchCode: true;
                accountType: true;
                accountNo: true;
                holderName: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type RestaurantWithOrders = {
  restaurantId: string;
  bankAccount: {
    bankCode: string;
    branchCode: string;
    accountType: BankAccountType;
    accountNo: string;
    holderName: string;
  };
  orders: {
    id: string;
    providerPaymentId: string;
    price: number;
    restaurantProfitPrice: number;
    status: OrderStatus;
    isDownloaded: boolean;
    createdAt: Date;
  }[];
};
