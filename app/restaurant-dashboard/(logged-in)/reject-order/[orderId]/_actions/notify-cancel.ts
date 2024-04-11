"use server";

import prisma from "@/lib/prisma/client";
import { sendMessage } from "@/lib/xoxzo";

export async function notifyCancel(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phoneNumber: true }
  });

  if (!user) {
    console.error("User not found");
    return;
  }
  if (!user.phoneNumber) {
    console.error("User has no phone number");
    return;
  }
  await sendMessage(user.phoneNumber, "お店が満席のため、注文がキャンセルされました。詳しくはWattをご確認ください。");
}
