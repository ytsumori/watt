"use server";

import prisma from "@/lib/prisma/client";

export type CreateOrderArgs = {
  userId: string;
  restaurantId: string;
  mealOrders: {
    mealId: string;
    quantity: number;
  }[];
  peopleCount: 1 | 2;
};

export async function createOrder({ userId, restaurantId, mealOrders, peopleCount }: CreateOrderArgs) {
  const totalQuantity = mealOrders.reduce((acc, meal) => acc + meal.quantity, 0);
  if (totalQuantity > peopleCount) {
    throw new Error("Total quantity is greater than people count");
  }

  const orders = await Promise.all(
    mealOrders.map(async (mealOrder) => {
      const meal = await prisma.meal.findUnique({
        where: { id: mealOrder.mealId, restaurantId },
        select: { id: true, isInactive: true, price: true }
      });
      if (!meal) {
        throw new Error(`Meal with id ${mealOrder.mealId} not found`);
      } else if (meal.isInactive) {
        throw new Error(`Meal with id ${mealOrder.mealId} is inactive`);
      }
      return { quantity: mealOrder.quantity, ...meal };
    })
  );

  const totalPrice = orders.reduce((acc, order) => acc + order.price * order.quantity, 0);
  return await prisma.order.create({
    data: {
      userId,
      restaurantId,
      peopleCount,
      orderTotalPrice: totalPrice,
      meals: {
        create: orders.flatMap((order) => {
          return Array.from({ length: order.quantity }).map(() => {
            return { mealId: order.id };
          });
        })
      }
    }
  });
}
