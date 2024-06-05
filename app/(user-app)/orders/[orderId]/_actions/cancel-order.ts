"use server";

import { updateIsOpen } from "@/actions/restaurant";
import { notifyStaffCancellation, notifyStaffFullCancellation } from "./notify-staff-cancellation";
import { deleteHttpTask } from "@/lib/googleTasks/deleteHttpTask";
import prisma from "@/lib/prisma/client";

type Args = { orderId: string; restaurantId: string; isFull: boolean };

export const cancelOrder = async ({ orderId, restaurantId, isFull }: Args) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { completedAt: true, canceledAt: true }
  });
  if (!order) throw new Error("Order not found");
  if (order.completedAt) throw new Error("Order already completed");
  if (order.canceledAt) throw new Error("Order already cancelled");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      canceledAt: new Date(),
      cancellation: { create: { reason: isFull ? "FULL" : "USER_DEMAND", cancelledBy: "USER" } }
    }
  });

  await deleteHttpTask(orderId);
  if (isFull) {
    await updateIsOpen({ id: restaurantId, isOpen: false });
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
