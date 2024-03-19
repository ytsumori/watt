"use server";

import { cancelPaymentIntent } from "@/actions/payment-intent";
import prisma from "@/lib/prisma/client";

export async function cancelOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { meal: { select: { restaurantId: true } } },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  await cancelPaymentIntent(order.id);

  await prisma.restaurant.update({
    where: { id: order.meal.restaurantId },
    data: { isOpen: false, isOpenManuallyUpdated: true },
  });

  return await prisma.order.findUnique({
    where: { id: orderId },
  });
}
