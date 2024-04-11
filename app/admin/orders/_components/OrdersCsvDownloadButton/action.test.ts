import { describe, expect, it } from "vitest";
import { getDataRecords, getTrailerRecord } from "./action";
import { createOrderMock } from "@/test/mock/createOrderMock";
import { createRestaurantMock } from "@/test/mock/createRestaurantMock";
import { createRestaurantBankAccountMock } from "@/test/mock/createRestaurantBankAccountMock";
import { RestaurantWithOrders } from "./type";
import { convertAccountTypeToNumber } from "./util";

describe("[OrdersCsvDownloadButton / action]", () => {
  const restaurantWithOrders: RestaurantWithOrders[] = Array.from({ length: 3 }, () => {
    return {
      restaurantId: createRestaurantMock().id,
      bankAccount: createRestaurantBankAccountMock(),
      orders: [createOrderMock()]
    };
  });
  describe("getTransferBankRecords", () => {
    it("適切な配列に変換されている", () => {
      const expectedValue = restaurantWithOrders.map((restaurant) => {
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
          restaurant.orders.reduce((acc, order) => acc + order.restaurantProfitPrice, 0),
          "1",
          restaurant.restaurantId,
          "",
          "",
          ""
        ];
      });
      expect(getDataRecords(restaurantWithOrders)).toStrictEqual(expectedValue);
    });
  });

  describe("getTrailerRecord", () => {
    it("適切な配列に変換されている", () => {
      const sum = restaurantWithOrders.reduce(
        (acc, cur) => acc + cur.orders.reduce((orderAcc, orderCur) => orderAcc + orderCur.restaurantProfitPrice, 0),
        0
      );
      expect(getTrailerRecord(getDataRecords(restaurantWithOrders))).toStrictEqual([
        "8",
        restaurantWithOrders.length,
        sum,
        ""
      ]);
    });
  });
});
