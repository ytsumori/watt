import { describe, expect, it } from "vitest";
import { ConvertedOrderInfo } from "../../_util/convertRequiredOrderInfo";
import { getTrailerRecord, getTransferBankRecords } from "./action";
import { createOrderMock } from "@/test/mock/createOrderMock";
import { createRestaurantMock } from "@/test/mock/createRestaurantMock";
import { createRestaurantBankAccountMock } from "@/test/mock/createRestaurantBankAccountMock";

describe("[OrdersCsvDownloadButton / action]", () => {
  const convertedOrderInfoMock = Array.from({ length: 3 }, () => {
    const restaurants = createRestaurantMock();
    const bankAccounts = createRestaurantBankAccountMock();
    const { id, ...order } = createOrderMock();
    return {
      id: restaurants.id,
      restaurantName: restaurants.name,
      bankAccount: bankAccounts,
      ...order,
    };
  });
  describe("getTransferBankRecords", () => {
    it("適切な配列に変換されている", () => {
      const expectedValue = convertedOrderInfoMock.map((order) => {
        const { bankAccount } = order;
        return [
          "2",
          bankAccount?.bankCode,
          "",
          bankAccount?.bankCode,
          "",
          "",
          bankAccount?.accountType,
          bankAccount?.accountNo,
          bankAccount?.holderName,
          order.price,
          1,
          bankAccount?.id,
          "",
          "",
          "",
        ];
      });
      expect(getTransferBankRecords(convertedOrderInfoMock)).toStrictEqual(expectedValue);
    });
  });

  describe("getTrailerRecord", () => {
    it("適切な配列に変換されている", () => {
      const sum = convertedOrderInfoMock.reduce((acc, cur) => acc + cur.price, 0);
      expect(getTrailerRecord(convertedOrderInfoMock)).toStrictEqual(["8", convertedOrderInfoMock.length, sum, ""]);
    });
  });
});
