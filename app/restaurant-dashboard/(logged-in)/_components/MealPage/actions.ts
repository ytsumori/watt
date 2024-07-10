"use server";

import prisma from "@/lib/prisma/client";

export async function getMeals(restaurantId: string) {
  return await prisma.meal.findMany({
    include: {
      items: {
        orderBy: { position: "asc" },
        include: {
          options: { orderBy: { position: "asc" } }
        }
      },
      orders: {
        select: {
          id: true
        }
      }
    },
    where: {
      restaurantId,
      outdatedAt: null
    },
    orderBy: {
      price: "asc"
    }
  });
}
