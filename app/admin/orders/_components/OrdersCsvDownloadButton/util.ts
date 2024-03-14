import { BankAccountType } from "@prisma/client";
import { ConvertedOrderInfo } from "../../_util/convertRequiredOrderInfo";
import Papa from "papaparse";
import Encoding from "encoding-japanese";

type TransferBankRecord = [
  string,
  string,
  string,
  BankAccountType,
  string,
  string,
  number,
  string,
];

export const getTransferBankRecords = (
  orders: ConvertedOrderInfo[],
): TransferBankRecord[] => {
  return orders.map((order) => {
    const { bankAccount } = order;
    if (
      bankAccount?.bankCode === undefined ||
      bankAccount?.accountType === undefined ||
      bankAccount?.accountNo === undefined ||
      bankAccount?.holderName === undefined || order.price === undefined
    ) {
      throw new Error("bankAccount has not required fields");
    }
    return [
      "2",
      bankAccount.bankCode,
      bankAccount.bankCode,
      bankAccount.accountType,
      bankAccount.accountNo,
      bankAccount.holderName,
      order.price,
      "watt振込",
    ];
  });
};

export const getTrailerRecord = (orders: ConvertedOrderInfo[]) => {
  const ordersCount = orders.length;
  const totalPrice = orders.reduce((acc, order) => acc + order.price, 0);
  return ["8", ordersCount, totalPrice];
};

export const getCsvBankList = (
  orders: ConvertedOrderInfo[],
): (string | number)[][] => {
  const headerRecord = [
    "1",
    "21",
    "0",
    "01123467",
    "ｶﾌﾞｼｷｶﾞｲｼｬxxxx",
    "0930",
    "0036",
    "251",
    "1",
    "1243453",
  ];

  const transferBankRecords = getTransferBankRecords(orders);
  const trailerRecord = getTrailerRecord(orders);

  return [headerRecord, ...transferBankRecords, trailerRecord];
};

export const convertToBlob = (records: (string | number)[][]): Blob => {
  const config = { delimiter: ",", header: true, newline: "\r\n" };
  const delimiterString = Papa.unparse(records, config);
  const strArray = Encoding.stringToCode(delimiterString);
  const convertedArray = Encoding.convert(strArray, "UTF8", "UNICODE");
  const UintArray = new Uint8Array(convertedArray);
  return new Blob([UintArray], { type: "text/csv" });
};
