"use server";

import prisma from "@/lib/prisma/client";

export async function getRecentOrderId({ userId }: { userId: string }) {
  const recentOrder = await prisma.order.findFirst({
    where: {
      userId: userId,
      approvedByRestaurantAt: {
        gte: new Date(Date.now() - 30 * 60 * 1000) // less than 30 minutes ago
      },
      canceledAt: null
    }
  });
  return recentOrder?.id;
}
