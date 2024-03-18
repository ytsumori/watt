import { describe, expect, it } from "vitest";
import { ConvertedOrderInfo } from "../../_util/convertRequiredOrderInfo";
import { getTrailerRecord, getTransferBankRecords } from "./action";

describe("[OrdersCsvDownloadButton / action]", () => {
  const mockOrders: ConvertedOrderInfo[] = [
    {
      id: "1",
      restaurantName: "testRestaurant",
      bankAccount: {
        id: "1",
        bankCode: "0001",
        branchCode: "001",
        accountType: "SAVINGS",
        accountNo: "1234567",
        holderName: "ﾀﾅｶﾀﾛｳ",
        isAdminConfirmed: true,
        restaurantId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      userId: "",
      mealId: "",
      providerPaymentId: "",
      status: "COMPLETE",
      price: 1000,
      restaurantProfitPrice: 1100,
      createdAt: new Date(),
      updatedAt: new Date(),
      orderNumber: 1,
    },
    {
      id: "2",
      restaurantName: "testRestaurant2",
      bankAccount: {
        id: "1",
        bankCode: "0001",
        branchCode: "001",
        accountType: "SAVINGS",
        accountNo: "1234567",
        holderName: "ﾀﾅｶﾀﾛｳ",
        isAdminConfirmed: true,
        restaurantId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      userId: "",
      mealId: "",
      providerPaymentId: "",
      status: "COMPLETE",
      price: 2000,
      restaurantProfitPrice: 2100,
      createdAt: new Date(),
      updatedAt: new Date(),
      orderNumber: 2,
    },
  ];

  describe("getTransferBankRecords", () => {
    it("適切な配列に変換されている", () => {
      const expectedValue = mockOrders.map((order) => {
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
      expect(getTransferBankRecords(mockOrders)).toStrictEqual(expectedValue);
    });
  });

  describe("getTrailerRecord", () => {
    it("適切な配列に変換されている", () => {
      const sum = mockOrders.reduce((acc, cur) => acc + cur.price, 0);
      expect(getTrailerRecord(mockOrders)).toStrictEqual(["8", mockOrders.length, sum, ""]);
    });
  });
});
