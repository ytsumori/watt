"use server";
import { BankAccountType } from "@prisma/client";
import { ConvertedOrderInfo } from "../../_util/convertRequiredOrderInfo";
import { format } from "date-fns";

// 各レコードの値については https://www.rakuten-bank.co.jp/business/howto/pdf/h07_06_10.pdf を参照

type TransferBankRecord = [
  string,
  string,
  string,
  string,
  string,
  string,
  BankAccountType,
  string,
  string,
  number,
  number,
  string,
  string,
  string,
  string,
];

export const getHeaderRecord = (): string[] => {
  const current = new Date();
  const now = format(current, "MMdd");
  if (
    process.env.CONSIGNOR_CODE === undefined ||
    process.env.CONSIGNOR_NAME === undefined ||
    process.env.CONSIGNOR_BRANCH_CODE === undefined ||
    process.env.ACCOUNT_NUMBER === undefined ||
    now === undefined
  ) {
    throw new Error("header Record has not required fields");
  }
  return [
    "1", // データ区分
    "21", // 種別コード
    "0", // 文字コード区分
    `${process.env.CONSIGNOR_CODE}`, // 委託者コード
    `${process.env.CONSIGNOR_NAME}`, // 委託者名
    `${now}`, // 実行日
    "0036", // 依頼人銀行番号
    "", // 依頼人銀行名
    `${process.env.CONSIGNOR_BRANCH_CODE}`, // 依頼人支店番号
    "", // 依頼人支店名
    "1", // 預金種目
    `${process.env.ACCOUNT_NUMBER}`, // 依頼人口座番号
    "", // ダミー
  ];
};

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
      throw new Error("bank record has not required fields");
    }
    return [
      "2", // データ区分
      bankAccount.bankCode, // 受取人銀行番号
      "", // 受取人銀行名
      bankAccount.bankCode, // 受取人支店番号
      "", // 受取人支店名
      "", // 手形交換所番号
      bankAccount.accountType, // 預金種目
      bankAccount.accountNo, // 受取人口座番号
      bankAccount.holderName, // 受取人口座名
      order.price, // 送金金額
      1, // 新規コード
      bankAccount.id, // 顧客番号
      "", // 振込指定区分
      "", // 識別表示
      "", // ダミー
    ];
  });
};

export const getTrailerRecord = (orders: ConvertedOrderInfo[]) => {
  const ordersCount = orders.length;
  const totalPrice = orders.reduce((acc, order) => acc + order.price, 0);
  return [
    "8", // データ区分
    ordersCount, // 依頼件数
    totalPrice, // 依頼合計金額
    "", // ダミー
  ];
};

export const getCsvBankRecords = async (
  orders: ConvertedOrderInfo[],
): Promise<(string | number)[][]> => {
  const headerRecord = getHeaderRecord();
  const transferBankRecords = getTransferBankRecords(orders);
  const trailerRecord = getTrailerRecord(orders);
  const endRecord = [
    "9", // データ区分
    "", // ダミー
  ];

  return [headerRecord, ...transferBankRecords, trailerRecord, endRecord];
};
