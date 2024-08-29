"use server";

import prisma from "@/lib/prisma/client";
import { logger } from "@/utils/logger";
import { notifySlackOrderRejection } from "./notify-slack-order-rejection";
import { updateRestaurantAvailability } from "@/actions/mutations/restaurant";
import { notifyCancelSms } from "@/actions/sms-notification";

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
  await updateRestaurantAvailability({ id: order.restaurantId, isAvailable: false });

  if (!order.user.phoneNumber) throw new Error("User has no phone number");

  await notifyCancelSms({ phoneNumber: order.user.phoneNumber, orderNumber: order.orderNumber });

  await notifySlackOrderRejection({ restaurantName: order.restaurant.name }).catch((e) =>
    logger({ severity: "ERROR", message: "Error notifying slack of order rejection", payload: { e } })
  );

  return await prisma.order.findUnique({
    where: { id: orderId },
    include: { meals: { include: { meal: true } } }
  });
}
