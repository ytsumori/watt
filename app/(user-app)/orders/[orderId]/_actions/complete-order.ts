"use server";

import { deleteHttpTask } from "@/lib/googleTasks/deleteHttpTask";
import prisma from "@/lib/prisma/client";

export async function completeOrder(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETE" }
  });

  await deleteHttpTask(order.id);

  return order;
}
