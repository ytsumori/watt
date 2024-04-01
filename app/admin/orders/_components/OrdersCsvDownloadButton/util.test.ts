import { describe, expect, it } from "vitest";
import { convertToBlob, isValidHolderName, isValidOrders } from "./util";
import { createRestaurantMock } from "@/test/mock/createRestaurantMock";
import { createRestaurantBankAccountMock } from "@/test/mock/createRestaurantBankAccountMock";
import { createOrderMock } from "@/test/mock/createOrderMock";
import { Prisma } from "@prisma/client";

describe("[OrdersCsvDownloadButton / util]", () => {
  describe("isValidHolderName", () => {
    describe("正常系", () => {
      it("半角カタカナ", () => expect(isValidHolderName("ﾀﾅｶﾀﾛｳ")).toBe(true));
    });

    describe("異常系", () => {
      const inputs = [
        { testName: "半角英字", value: "tanakatarou" },
        { testName: "全角カタカナ", value: "タナカタロウ" },
        { testName: "半角スペース", value: "ﾀﾅｶ ﾀﾛｳ" },
        { testName: "全角スペース", value: "ﾀﾅｶ　ﾀﾛｳ" },
      ];
      inputs.forEach((input) => {
        it(input.testName, () => expect(isValidHolderName(input.value)).toBe(false));
      });
    });
  });

  describe("convertToBlob", () => {
    describe("正常系", () => {
      it("Blobを返す", () => {
        const records = [
          ["name", "age"],
          ["tanaka", 20],
        ];
        const blob = convertToBlob(records);
        expect(blob).toBeInstanceOf(Blob);
        expect(blob.type).toBe("text/csv");
      });
    });
  });

  describe("isValidOrders", () => {
    it("正常系", () => {
      const restaurant = createRestaurantMock();
      const bankAccount = createRestaurantBankAccountMock();
      const { id, ...order } = createOrderMock();
      const convertedOrderInfoMock = {
        id: restaurant.id,
        restaurantName: restaurant.name,
        bankAccount: bankAccount,
        ...order,
      };

      expect(isValidOrders(convertedOrderInfoMock)).toBe(true);
    });

    describe("異常系", () => {
      const createConvertedOrderInfoMock = (
        bankAccount: Prisma.RestaurantBankAccountGetPayload<Prisma.RestaurantBankAccountDefaultArgs>
      ) => {
        const restaurant = createRestaurantMock();
        const { id, ...order } = createOrderMock();
        return {
          id: restaurant.id,
          restaurantName: restaurant.name,
          bankAccount: bankAccount,
          ...order,
        };
      };

      it("bankCodeがundefined", () => {
        const bankAccount = createRestaurantBankAccountMock({ bankCode: undefined });
        const convertedOrderInfoMock = createConvertedOrderInfoMock(bankAccount);
        expect(isValidOrders(convertedOrderInfoMock)).toBe(false);
      });

      it("accountTypeがundefined", () => {
        const bankAccount = createRestaurantBankAccountMock({ accountType: undefined });
        const convertedOrderInfoMock = createConvertedOrderInfoMock(bankAccount);
        expect(isValidOrders(convertedOrderInfoMock)).toBe(false);
      });

      it("accountNoがundefined", () => {
        const bankAccount = createRestaurantBankAccountMock({ accountNo: undefined });
        const convertedOrderInfoMock = createConvertedOrderInfoMock(bankAccount);
        expect(isValidOrders(convertedOrderInfoMock)).toBe(false);
      });

      it("holderNameがundefined", () => {
        const bankAccount = createRestaurantBankAccountMock({ holderName: undefined });
        const convertedOrderInfoMock = createConvertedOrderInfoMock(bankAccount);
        expect(isValidOrders(convertedOrderInfoMock)).toBe(false);
      });

      it("holderNameが適切な形でない", () => {
        const bankAccount = createRestaurantBankAccountMock({ holderName: "tanaka taro" });
        const convertedOrderInfoMock = createConvertedOrderInfoMock(bankAccount);
        expect(isValidOrders(convertedOrderInfoMock)).toBe(false);
      });

      it("priceがundefined", () => {
        const restaurant = createRestaurantMock();
        const bankAccount = createRestaurantBankAccountMock();
        const { id, ...order } = createOrderMock({ price: undefined });

        const convertedOrderInfoMock = {
          id: restaurant.id,
          restaurantName: restaurant.name,
          bankAccount: bankAccount,
          ...order,
        };
        expect(isValidOrders(convertedOrderInfoMock)).toBe(false);
      });

      it("isDownloadedがtrue", () => {
        const restaurant = createRestaurantMock();
        const bankAccount = createRestaurantBankAccountMock();
        const { id, ...order } = createOrderMock({ isDownloaded: true });

        const convertedOrderInfoMock = {
          id: restaurant.id,
          restaurantName: restaurant.name,
          bankAccount: bankAccount,
          ...order,
        };

        expect(isValidOrders(convertedOrderInfoMock)).toBe(false);
      });
    });
  });
});
