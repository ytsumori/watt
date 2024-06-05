"use server";

import prisma from "@/lib/prisma/client";

export async function getOrders(restaurantId: string) {
  return await prisma.order.findMany({
    include: {
      payment: {
        where: {
          completedAt: {
            not: null
          }
        }
      }
    },
    where: {
      restaurantId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
