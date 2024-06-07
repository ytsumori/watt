import { BankAccountType, PaymentOption, SmokingOption } from "@prisma/client";

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

export const translateSmokingOption = (smokingOption: SmokingOption): string => {
  switch (smokingOption) {
    case SmokingOption.NON_SMOKING:
      return "禁煙";
    case SmokingOption.SMOKING:
      return "喫煙";
    case SmokingOption.SEPARATED:
      return "分煙";
    case SmokingOption.SEPARATED_ONLY_E_CIGARETTE:
      return "分煙（加熱式たばこ限定）";
    default:
      throw new Error("Invalid smoking option");
  }
};

export const translatePaymentOption = (paymentOption: PaymentOption): string => {
  switch (paymentOption) {
    case "CASH":
      return "現金";
    case "CREDIT_CARD":
      return "クレジットカード";
    case "E_MONEY":
      return "電子マネー";
    case "QR_CODE":
      return "QRコード決済";
    default:
      throw new Error("Invalid payment option");
  }
};
