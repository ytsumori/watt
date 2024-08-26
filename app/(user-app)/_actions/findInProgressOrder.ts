"use server";

import prisma from "@/lib/prisma/client";

export async function findInProgressOrder(userId: string) {
  return await prisma.order.findFirst({
    where: {
      userId,
      canceledAt: null,
      approvedByRestaurantAt: null
    }
  });
}
