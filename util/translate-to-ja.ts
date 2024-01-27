import { BankAccountType } from "@prisma/client";

export const translateBankAccountType = (
  accountType: BankAccountType
): string => {
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
