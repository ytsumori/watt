import { BankAccountType, Prisma } from "@prisma/client";

export type DownloadablePayment = Prisma.PaymentGetPayload<{
  select: {
    id: true;
    stripePaymentId: true;
    totalAmount: true;
    restaurantProfitPrice: true;
    isCsvDownloaded: true;
    completedAt: true;
    order: {
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
                clientCode: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type RestaurantWithPayments = {
  restaurantId: string;
  bankAccount: {
    bankCode: string;
    branchCode: string;
    accountType: BankAccountType;
    accountNo: string;
    holderName: string;
    clientCode: number;
  };
  payments: {
    id: string;
    stripePaymentId: string;
    totalAmount: number;
    restaurantProfitPrice: number;
    completedAt: Date;
  }[];
};
