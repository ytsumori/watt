"use server";

import { format } from "date-fns";
import { isValidHolderName } from "@/utils/zengin";

import { convertAccountTypeToNumber } from "./util";
import { RestaurantWithPayments } from "./type";

// 各レコードの値については https://gmo-aozora.com/support/guide/once-upload.pdf を参照

export type DataRecord = [
  "2",
  string,
  "",
  string,
  "",
  "",
  "1" | "2" | "4",
  string,
  string,
  number,
  "1",
  number,
  "",
  "",
  "",
  ""
];

export const getHeaderRecord = (transferDate: Date): string[] => {
  if (
    process.env.CONSIGNOR_NAME === undefined ||
    process.env.CONSIGNOR_BRANCH_CODE === undefined ||
    process.env.CONSIGNOR_BRANCH_NAME === undefined ||
    process.env.ACCOUNT_NUMBER === undefined
  ) {
    throw new Error("header Record has not required fields");
  }

  const formattedTranferDate = format(transferDate, "MMdd");

  return [
    "1", // データ区分
    "21", // 種別コード
    "0", // 文字コード区分
    "9999999999", // 委託者コード
    `${process.env.CONSIGNOR_NAME}`, // 委託者名
    `${formattedTranferDate}`, // 実行日
    "0310", // 依頼人銀行番号
    "ｼﾞ-ｴﾑｵ-ｱｵｿﾞﾗﾈﾂﾄ", // 依頼人銀行名
    `${process.env.CONSIGNOR_BRANCH_CODE}`, // 依頼人支店番号
    `${process.env.CONSIGNOR_BRANCH_NAME}`, // 依頼人支店名
    "1", // 預金種目
    `${process.env.ACCOUNT_NUMBER}`, // 依頼人口座番号
    "" // ダミー
  ];
};

export const getDataRecords = (restaurants: RestaurantWithPayments[]): DataRecord[] => {
  return restaurants.map((restaurant) => {
    const bankAccount = restaurant.bankAccount;
    if (!bankAccount) {
      throw new Error("bank record has not required fields");
    }
    if (!isValidHolderName(bankAccount.holderName)) {
      throw new Error("invalid holder name");
    }
    const totalProfitPrice = restaurant.payments.reduce((acc, payment) => acc + payment.restaurantProfitPrice, 0);
    return [
      "2", // データ区分
      bankAccount.bankCode, // 受取人銀行番号
      "", // 受取人銀行名
      bankAccount.branchCode, // 受取人支店番号
      "", // 受取人支店名
      "", // 手形交換所番号
      convertAccountTypeToNumber(bankAccount.accountType), // 預金種目
      bankAccount.accountNo.padStart(7, "0"), // 受取人口座番号
      bankAccount.holderName, // 受取人口座名
      totalProfitPrice, // 送金金額
      "1", // 新規コード
      bankAccount.clientCode, // 顧客コード1
      "", // 顧客コード2
      "", // 振込指定区分
      "", // 識別表示
      "" // ダミー
    ];
  });
};

export const getTrailerRecord = (dataRecords: DataRecord[]) => {
  const ordersCount = dataRecords.length;
  const totalPrice = dataRecords.reduce((acc, record) => acc + record[9], 0);
  return [
    "8", // データ区分
    ordersCount.toString().padStart(6, "0"), // 依頼件数
    totalPrice.toString().padStart(12, "0"), // 依頼合計金額
    "" // ダミー
  ];
};

export const getCsvBankRecords = async (
  transferDate: Date,
  restaurantsWithOrders: RestaurantWithPayments[]
): Promise<(string | number)[][]> => {
  const headerRecord = getHeaderRecord(transferDate);
  const dataRecords = getDataRecords(restaurantsWithOrders);
  const trailerRecord = getTrailerRecord(dataRecords);
  const endRecord = [
    "9", // データ区分
    "" // ダミー
  ];

  return [headerRecord, ...dataRecords, trailerRecord, endRecord];
};
