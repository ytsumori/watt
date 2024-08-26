"use server";

import prisma from "@/lib/prisma/client";

export async function getOrders(restaurantId: string, month: string) {
  const beginningOfMonth = new Date(month);
  const endOfMonth = new Date(month);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  return await prisma.order.findMany({
    select: {
      id: true,
      orderTotalPrice: true,
      orderNumber: true,
      peopleCount: true,
      approvedByRestaurantAt: true,
      canceledAt: true,
      createdAt: true,
      meals: {
        select: {
          id: true,
          meal: { select: { title: true } },
          options: { select: { mealItemOption: { select: { title: true } } } }
        }
      }
    },
    where: {
      restaurantId,
      createdAt: {
        gte: beginningOfMonth,
        lt: endOfMonth
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getFirstOrder(restaurantId: string) {
  return await prisma.order.findFirst({
    select: {
      createdAt: true
    },
    where: {
      restaurantId
    },
    orderBy: {
      createdAt: "asc"
    }
  });
}

export async function cancelOrder(orderId: string) {
  return await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      canceledAt: new Date(),
      cancellation: {
        create: {
          reason: "LATE",
          cancelledBy: "USER"
        }
      }
    }
  });
}
