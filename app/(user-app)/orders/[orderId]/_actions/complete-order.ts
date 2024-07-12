"use server";

import { deleteHttpTask } from "@/lib/googleTasks/deleteHttpTask";
import prisma from "@/lib/prisma/client";
import { logger } from "@/utils/logger";

export async function completeOrder(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { completedAt: new Date() }
  });
  const automaticCancellation = await prisma.orderAutomaticCancellation.findUnique({
    where: { orderId: order.id }
  });

  if (automaticCancellation) {
    await deleteHttpTask(automaticCancellation.googleCloudTaskId).catch((e) =>
      logger({ severity: "ERROR", message: "Error deleting task", payload: { e } })
    );
  } else {
    logger({
      severity: "ERROR",
      message: "Automatic cancellation not found",
      payload: { orderId: order.id }
    });
  }

  return order;
}
