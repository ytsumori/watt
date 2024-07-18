"use server";

import { sendMessage } from "@/lib/xoxzo";

export async function notifyCancelSms({ phoneNumber, orderNumber }: { phoneNumber: string; orderNumber: number }) {
  const message = `【注文番号:${orderNumber}】お店が満席のため注文がキャンセルされました。詳しくはWattをご確認ください。`;
  await sendMessage(phoneNumber, message);
}
