"use server";

import { updateRestaurantAvailability } from "@/actions/mutations/restaurant";
import { notifyStaffCancellation, notifyStaffFullCancellation } from "./notify-staff-cancellation";
import prisma from "@/lib/prisma/client";

type Args = { orderId: string; restaurantId: string; isFull: boolean };

export const cancelOrder = async ({ orderId, restaurantId, isFull }: Args) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { canceledAt: true }
  });
  if (!order) throw new Error("Order not found");
  if (order.canceledAt) throw new Error("Order already cancelled");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      canceledAt: new Date(),
      cancellation: { create: { reason: isFull ? "FULL" : "USER_DEMAND", cancelledBy: "USER" } }
    }
  });

  if (isFull) {
    await updateRestaurantAvailability({ id: restaurantId, isAvailable: false });
    try {
      await notifyStaffFullCancellation({ orderId: orderId });
    } catch (e) {
      console.error("Error notifying staff", e);
    }
  } else {
    try {
      await notifyStaffCancellation({ orderId: orderId });
    } catch (e) {
      console.error("Error notifying staff", e);
    }
  }
};
