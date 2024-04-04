import Papa from "papaparse";
import { isValidHolderName } from "@/utils/zengin";
import { DownloadableOrder } from "./type";
import { BankAccountType } from "@prisma/client";

export const isValidOrder = (order: DownloadableOrder): boolean => {
  return (
    order.meal.restaurant.bankAccount !== null &&
    !order.isDownloaded &&
    isValidHolderName(order.meal.restaurant.bankAccount.holderName)
  );
};

export const convertToBlob = (records: (string | number)[][]): Blob => {
  const config = { delimiter: ",", header: true, newline: "\r\n" };
  const csv = Papa.unparse(records, config);
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  return new Blob([bom, csv], { type: "text/csv" });
};

export const convertAccountTypeToNumber = (accountType: BankAccountType): "1" | "2" | "4" => {
  switch (accountType) {
    case "SAVINGS":
      return "1";
    case "CHECKING":
      return "2";
    case "DEPOSIT":
      return "4";
  }
};
