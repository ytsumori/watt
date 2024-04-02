import Encoding from "encoding-japanese";
import Papa from "papaparse";
import { isValidHolderName } from "@/utils/zengin";
import { DownloadableOrder } from "./type";

export const isValidOrder = (order: DownloadableOrder): boolean => {
  return (
    order.meal.restaurant.bankAccount !== null &&
    !order.isDownloaded &&
    isValidHolderName(order.meal.restaurant.bankAccount.holderName)
  );
};

export const convertToBlob = (records: (string | number)[][]): Blob => {
  const config = { delimiter: ",", header: true, newline: "\r\n" };
  const delimiterString = Papa.unparse(records, config);
  const strArray = Encoding.stringToCode(delimiterString);
  const convertedArray = Encoding.convert(strArray, "UTF8", "UNICODE");
  const UintArray = new Uint8Array(convertedArray);
  return new Blob([UintArray], { type: "text/csv" });
};
