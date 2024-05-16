"use server";

import prisma from "@/lib/prisma/client";
import { updateIsOpen } from "@/actions/restaurant";
import { sendMessage } from "@/lib/xoxzo";

export async function cancelOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { meal: { select: { restaurantId: true } }, user: true }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED", cancellation: { create: { reason: "FULL", cancelledBy: "STAFF" } } }
  });
  await updateIsOpen({ id: order.meal.restaurantId, isOpen: false });

  if (!order.user.phoneNumber) throw new Error("User has no phone number");

  try {
    await sendMessage(
      order.user.phoneNumber,
      `お店が満席のため、注文がキャンセルされました。詳しくはWattをご確認ください。`
    );
  } catch (e) {
    console.error("Error notifying user", e);
  }

  return await prisma.order.findUnique({
    where: { id: orderId }
  });
}
