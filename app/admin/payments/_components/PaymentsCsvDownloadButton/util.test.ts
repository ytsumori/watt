import { describe, expect, it } from "vitest";
import { convertToBlob, isValidPayment } from "./util";
import { createRestaurantMock } from "@/test/mock/createRestaurantMock";
import { createRestaurantBankAccountMock } from "@/test/mock/createRestaurantBankAccountMock";
import { createOrderMock } from "@/test/mock/createOrderMock";
import { DownloadablePayment } from "./type";
import { createPaymentMock } from "@/test/mock/createPaymentMock";

describe("[OrdersCsvDownloadButton / util]", () => {
  describe("convertToBlob", () => {
    describe("正常系", () => {
      it("Blobを返す", () => {
        const records = [
          ["name", "age"],
          ["tanaka", 20]
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
      const { id, ...payment } = createPaymentMock();
      const order = createOrderMock();
      const downloadableOrderMock: DownloadablePayment = {
        id: restaurant.id,
        order: { meal: { restaurant: { bankAccount: bankAccount, ...restaurant } }, ...order },
        ...payment
      };

      expect(isValidPayment(downloadableOrderMock)).toBe(true);
    });

    it("異常系: bankAccountがnull", () => {
      const restaurant = createRestaurantMock();
      const { id, ...payment } = createPaymentMock();
      const order = createOrderMock();
      const downloadableOrderMock: DownloadablePayment = {
        id: restaurant.id,
        order: { meal: { restaurant: { bankAccount: null, ...restaurant } }, ...order },
        ...payment
      };

      expect(isValidPayment(downloadableOrderMock)).toBe(false);
    });

    it("異常系: isDownloadedがtrue", () => {
      const restaurant = createRestaurantMock();
      const bankAccount = createRestaurantBankAccountMock();
      const { id, ...payment } = createPaymentMock();
      const order = createOrderMock();
      const downloadableOrderMock: DownloadablePayment = {
        id: restaurant.id,
        order: { meal: { restaurant: { bankAccount: bankAccount, ...restaurant } }, ...order },
        ...payment,
        isCsvDownloaded: true
      };

      expect(isValidPayment(downloadableOrderMock)).toBe(false);
    });

    it("異常系: holderNameが不正", () => {
      const restaurant = createRestaurantMock();
      const bankAccount = createRestaurantBankAccountMock();
      const { id, ...payment } = createPaymentMock();
      const order = createOrderMock();
      const downloadableOrderMock: DownloadablePayment = {
        id: restaurant.id,
        order: {
          meal: { restaurant: { bankAccount: { ...bankAccount, holderName: "invalid" }, ...restaurant } },
          ...order
        },
        ...payment
      };

      expect(isValidPayment(downloadableOrderMock)).toBe(false);
    });
  });
});
