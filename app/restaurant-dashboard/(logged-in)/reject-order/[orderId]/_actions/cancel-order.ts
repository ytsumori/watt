"use server";

import { updateIsOpen } from "@/actions/restaurant";
import prisma from "@/lib/prisma/client";
import { sendMessage } from "@/lib/xoxzo";
import { logger } from "@/utils/logger";
import { notifySlackOrderRejection } from "./notify-slack-order-rejection";

export async function cancelOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      restaurant: {
        select: {
          name: true
        }
      }
    }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { canceledAt: new Date(), cancellation: { create: { reason: "FULL", cancelledBy: "STAFF" } } }
  });
  await updateIsOpen({ id: order.restaurantId, isOpen: false });

  if (!order.user.phoneNumber) throw new Error("User has no phone number");

  await sendMessage(
    order.user.phoneNumber,
    `お店が満席のため、注文(#${order.orderNumber})がキャンセルされました。詳しくはWattをご確認ください。`
  ).catch((e) => logger({ severity: "ERROR", message: "Error sending message", payload: { e } }));

  await notifySlackOrderRejection({ restaurantName: order.restaurant.name }).catch((e) =>
    logger({ severity: "ERROR", message: "Error notifying slack of order rejection", payload: { e } })
  );

  return await prisma.order.findUnique({
    where: { id: orderId },
    include: { meals: { include: { meal: true } } }
  });
}
