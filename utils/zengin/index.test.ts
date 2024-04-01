import { describe, expect, it } from "vitest";
import { isValidHolderName } from ".";

describe("[utils/zengin]", () => {
  describe("isValidHolderName", () => {
    describe("正常系", () => {
      it("半角カタカナ", () => {
        expect(isValidHolderName("ﾀﾅｶﾀﾛｳ")).toBe(true);
      });
      it("半角大文字英語", () => {
        expect(isValidHolderName("TANAKATARO")).toBe(true);
      });
      it("半角数字", () => {
        expect(isValidHolderName("1234")).toBe(true);
      });
      it("半角スペース", () => {
        expect(isValidHolderName("ﾀﾅｶ ﾀﾛｳ")).toBe(true);
      });
    });

    describe("異常系", () => {
      const inputs = [
        { testName: "全角ひらがな", value: "たなかたろう" },
        { testName: "全角漢字", value: "田中太郎" },
        { testName: "半角小文字英語", value: "tanakatarou" },
        { testName: "全角英語", value: "ＴＡＮＡＫＡＴＡＲＯＵ" },
        { testName: "全角カタカナ", value: "タナカタロウ" },
        { testName: "全角スペース", value: "ﾀﾅｶ　ﾀﾛｳ" },
      ];
      inputs.forEach((input) => {
        it(input.testName, () => {
          expect(isValidHolderName(input.value)).toBe(false);
        });
      });
    });
  });
});
