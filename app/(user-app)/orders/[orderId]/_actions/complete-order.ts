"use server";

import prisma from "@/lib/prisma/client";

export async function completeOrder(orderId: string) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETE" }
  });
}
