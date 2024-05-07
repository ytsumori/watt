import { BankAccountType, OrderStatus } from "@prisma/client";

export const translateBankAccountType = (accountType: BankAccountType): string => {
  switch (accountType) {
    case BankAccountType.SAVINGS:
      return "普通";
    case BankAccountType.CHECKING:
      return "当座";
    case BankAccountType.DEPOSIT:
      return "貯蓄";
    default:
      throw new Error("Invalid bank account type");
  }
};

export const translateOrderStatus = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PREORDERED:
      return "仮注文";
    case OrderStatus.CANCELLED:
      return "キャンセル済み";
    case OrderStatus.COMPLETE:
      return "注文完了";
    default:
      throw new Error("Invalid order status");
  }
};
