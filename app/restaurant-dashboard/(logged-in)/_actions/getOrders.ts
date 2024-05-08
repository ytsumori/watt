"use server";

import prisma from "@/lib/prisma/client";

export async function getOrders(restaurantId: string) {
  return await prisma.order.findMany({
    include: {
      meal: true,
      payment: {
        where: {
          completedAt: {
            not: null
          }
        }
      }
    },
    where: {
      meal: {
        restaurantId
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
