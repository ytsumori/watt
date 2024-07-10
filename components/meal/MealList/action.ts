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
      restaurantId
    },
    orderBy: {
      price: "asc"
    }
  });
}

export async function inactivateMeal({ id }: { id: string }) {
  return await prisma.meal.update({
    where: {
      id
    },
    data: {
      isInactive: true
    }
  });
}

export async function activateMeal({ id }: { id: string }) {
  return await prisma.meal.update({
    where: {
      id
    },
    data: {
      isInactive: false
    }
  });
}
