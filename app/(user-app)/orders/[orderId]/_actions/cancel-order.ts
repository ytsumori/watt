"use server";

import { updateIsOpen } from "@/actions/restaurant";
import { notifyStaffCancellation, notifyStaffFullCancellation } from "./notify-staff-cancellation";
import { deleteHttpTask } from "@/lib/googleTasks/deleteHttpTask";
import prisma from "@/lib/prisma/client";

type Args = { orderId: string; restaurantId: string; isFull: boolean };

export const cancelOrder = async ({ orderId, restaurantId, isFull }: Args) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, meal: { select: { restaurant: { select: { name: true } } } } }
  });
  if (!order) throw new Error("Order not found");
  if (order.status === "CANCELLED") throw new Error("Order already cancelled");
  if (order.status === "COMPLETE") throw new Error("Order already completed");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
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
