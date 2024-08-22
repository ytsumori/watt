"use server";

import prisma from "@/lib/prisma/client";

export async function findInProgressOrder(userId: string) {
  return await prisma.order.findFirst({
    where: {
      userId,
      canceledAt: null,
      OR: [
        {
          approvedByRestaurantAt: null
        },
        {
          approvedByRestaurantAt: {
            gt: new Date(Date.now() - 30 * 60 * 1000) // less than 30 minutes ago
          }
        }
      ]
    }
  });
}
