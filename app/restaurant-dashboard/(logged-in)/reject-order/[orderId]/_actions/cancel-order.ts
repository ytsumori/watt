"use server";

import prisma from "@/lib/prisma/client";
import { notifyCancel } from "./notify-cancel";
import { updateIsOpen } from "@/actions/restaurant";

export async function cancelOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { meal: { select: { restaurantId: true } } }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED", cancellation: { create: { reason: "FULL", cancelledBy: "STAFF" } } }
  });
  await updateIsOpen({ id: order.meal.restaurantId, isOpen: false });

  try {
    await notifyCancel(order.userId);
  } catch (e) {
    console.error("Error notifying user", e);
  }

  return await prisma.order.findUnique({
    where: { id: orderId }
  });
}
