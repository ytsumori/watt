"use server";

import prisma from "@/lib/prisma/client";
import { updateIsOpenDelegate } from "@/actions/restaurant";
import { sendMessage } from "@/lib/xoxzo";

export async function findOrder({ orderId, restaurantId }: { orderId: string; restaurantId: string }) {
  return await prisma.order.findUnique({
    where: { id: orderId, restaurantId },
    include: { meals: { include: { meal: true } } }
  });
}

export async function cancelOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { canceledAt: new Date(), cancellation: { create: { reason: "FULL", cancelledBy: "STAFF" } } }
    }),
    updateIsOpenDelegate({ id: order.restaurantId, isOpen: false })
  ]);

  if (!order.user.phoneNumber) throw new Error("User has no phone number");

  try {
    await sendMessage(
      order.user.phoneNumber,
      `お店が満席のため、注文(#${order.orderNumber})がキャンセルされました。詳しくはWattをご確認ください。`
    );
  } catch (e) {
    console.error("Error notifying user", e);
  }

  return await prisma.order.findUnique({
    where: { id: orderId },
    include: { meals: { include: { meal: true } } }
  });
}
