import { describe, expect, it } from "vitest";
import { getDataRecords, getTrailerRecord } from "./action";
import { createRestaurantMock } from "@/test/mock/createRestaurantMock";
import { createRestaurantBankAccountMock } from "@/test/mock/createRestaurantBankAccountMock";
import { convertAccountTypeToNumber } from "./util";
import { RestaurantWithPayments } from "./type";
import { createPaymentMock } from "@/test/mock/createPaymentMock";

describe("[OrdersCsvDownloadButton / action]", () => {
  const restaurantWithPayments: RestaurantWithPayments[] = Array.from({ length: 3 }, () => {
    return {
      restaurantId: createRestaurantMock().id,
      bankAccount: createRestaurantBankAccountMock(),
      payments: [{ ...createPaymentMock(), completedAt: new Date() }]
    };
  });
  describe("getTransferBankRecords", () => {
    it("適切な配列に変換されている", () => {
      const expectedValue = restaurantWithPayments.map((restaurant) => {
        const bankAccount = restaurant.bankAccount;
        return [
          "2",
          bankAccount.bankCode,
          "",
          bankAccount.branchCode,
          "",
          "",
          convertAccountTypeToNumber(bankAccount.accountType),
          bankAccount.accountNo,
          bankAccount.holderName,
          restaurant.payments.reduce((acc, order) => acc + order.restaurantProfitPrice, 0),
          "1",
          restaurant.restaurantId,
          "",
          "",
          ""
        ];
      });
      expect(getDataRecords(restaurantWithPayments)).toStrictEqual(expectedValue);
    });
  });

  describe("getTrailerRecord", () => {
    it("適切な配列に変換されている", () => {
      const sum = restaurantWithPayments.reduce(
        (acc, cur) =>
          acc + cur.payments.reduce((paymentAcc, paymentCur) => paymentAcc + paymentCur.restaurantProfitPrice, 0),
        0
      );
      expect(getTrailerRecord(getDataRecords(restaurantWithPayments))).toStrictEqual([
        "8",
        restaurantWithPayments.length,
        sum,
        ""
      ]);
    });
  });
});
