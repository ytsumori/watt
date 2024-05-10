import { PaymentOption } from "@prisma/client";

export function orderPaymentOptions(options: PaymentOption[]) {
  return options.sort((a, b) => {
    if (a === "CASH") return -1;
    if (b === "CASH") return 1;
    if (a === "CREDIT_CARD") return -1;
    if (b === "CREDIT_CARD") return 1;
    if (a === "E_MONEY") return -1;
    if (b === "E_MONEY") return 1;
    if (a === "QR_CODE") return -1;
    if (b === "QR_CODE") return 1;
    return 0;
  });
}
