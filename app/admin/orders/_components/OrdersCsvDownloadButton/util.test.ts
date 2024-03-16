import { describe, expect, it } from "vitest";
import { convertToBlob, isValidHolderName } from "./util";

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
        it(
          input.testName,
          () => expect(isValidHolderName(input.value)).toBe(false),
        );
      });
    });
  });

  describe("convertToBlob", () => {
    describe("正常系", () => {
      it("Blobを返す", () => {
        const records = [["name", "age"], ["tanaka", 20]];
        const blob = convertToBlob(records);
        expect(blob).toBeInstanceOf(Blob);
        expect(blob.type).toBe("text/csv");
      });
    });
  });
});
