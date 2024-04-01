import Encoding from "encoding-japanese";
import Papa from "papaparse";
import { ConvertedOrderInfo } from "../../_util/convertRequiredOrderInfo";

export const isValidHolderName = (holderName: string): boolean => {
  const isValid = /^[ｦ-ﾟ 0-9A-Z]*$/.test(holderName);
  return isValid;
};

export const isValidOrders = (order: ConvertedOrderInfo): boolean => {
  return order.bankAccount?.bankCode === undefined ||
    order.bankAccount?.accountType === undefined ||
    order.bankAccount?.accountNo === undefined ||
    order.bankAccount?.holderName === undefined ||
    order.price === undefined ||
    order.isDownloaded ||
    !isValidHolderName(order.bankAccount.holderName)
    ? false
    : true;
};

export const convertToBlob = (records: (string | number)[][]): Blob => {
  const config = { delimiter: ",", header: true, newline: "\r\n" };
  const delimiterString = Papa.unparse(records, config);
  const strArray = Encoding.stringToCode(delimiterString);
  const convertedArray = Encoding.convert(strArray, "UTF8", "UNICODE");
  const UintArray = new Uint8Array(convertedArray);
  return new Blob([UintArray], { type: "text/csv" });
};
