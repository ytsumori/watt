"use server";

import prisma from "@/lib/prisma/client";

export async function findOrder({ orderId, restaurantId }: { orderId: string; restaurantId: string }) {
  return await prisma.order.findUnique({
    where: { id: orderId, restaurantId },
    include: { meals: { include: { meal: true } } }
  });
}
