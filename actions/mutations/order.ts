"use server";

import prisma from "@/lib/prisma/client";

export type CreateOrderArgs = {
  userId: string;
  restaurantId: string;
  firstMealId: string;
  firstOptionIds: (string | null)[];
  secondMealId?: string;
  secondOptionIds?: (string | null)[];
  peopleCount: 1 | 2;
  isDiscounted: boolean;
};

export async function createOrder({
  userId,
  restaurantId,
  firstMealId,
  firstOptionIds,
  secondMealId,
  secondOptionIds,
  peopleCount,
  isDiscounted
}: CreateOrderArgs) {
  const firstMeal = await prisma.meal.findUnique({
    where: { id: firstMealId, restaurantId },
    select: {
      id: true,
      price: true,
      listPrice: true,
      isInactive: true,
      restaurant: {
        select: { phoneNumber: true, fullStatuses: { where: { easedAt: null }, select: { id: true } } }
      },
      items: { select: { options: { select: { id: true, extraPrice: true } } } }
    }
  });

  if (!firstMeal) {
    throw new Error("First meal not found");
  } else if (firstMeal.isInactive) {
    throw new Error("First meal is inactive");
  } else if (
    firstMeal.items.some((item, index) => {
      const optionId = firstOptionIds[index];
      const isNoOptionSelected = item.options.length === 0 && optionId !== null;
      const isInvalidOptionSelected =
        item.options.length > 0 && (optionId === null || !item.options.map((option) => option.id).includes(optionId));
      return isNoOptionSelected || isInvalidOptionSelected;
    })
  ) {
    throw new Error("First meal options do not match");
  }
  const isFull = firstMeal.restaurant.fullStatuses.length > 0;
  if (isDiscounted === isFull) {
    throw new Error("Status outdated");
  }

  const firstMealPrice = isDiscounted ? firstMeal.price : firstMeal.listPrice!;
  const firstOrderTotalPrice =
    firstMealPrice +
    firstMeal.items.reduce((acc, item, index) => {
      const optionId = firstOptionIds[index];

      return acc + (optionId ? item.options.find((option) => option.id === optionId)?.extraPrice ?? 0 : 0);
    }, 0);

  if (secondMealId) {
    if (!secondOptionIds) throw new Error("Second meal options are required");

    const secondMeal = await prisma.meal.findUnique({
      where: { id: secondMealId, restaurantId },
      select: {
        id: true,
        isInactive: true,
        price: true,
        listPrice: true,
        items: { select: { options: { select: { id: true, extraPrice: true } } } }
      }
    });
    if (!secondMeal) {
      throw new Error("Second meal not found");
    } else if (secondMeal.isInactive) {
      throw new Error("Second meal is inactive");
    } else if (
      secondMeal.items.some((item, index) => {
        const optionId = secondOptionIds[index];
        const isNoOptionSelected = item.options.length === 0 && optionId !== null;
        const isInvalidOptionSelected =
          item.options.length > 0 && (optionId === null || !item.options.map((option) => option.id).includes(optionId));
        return isNoOptionSelected || isInvalidOptionSelected;
      })
    ) {
      throw new Error("Second meal options do not match");
    }

    const secondMealPrice = isDiscounted ? secondMeal.price : secondMeal.listPrice!;
    const secondOrderTotalPrice =
      secondMealPrice +
      secondMeal.items.reduce((acc, item, index) => {
        const optionId = secondOptionIds[index];

        return acc + (optionId ? item.options.find((option) => option.id === optionId)?.extraPrice ?? 0 : 0);
      }, 0);
    return await prisma.order.create({
      data: {
        userId,
        restaurantId,
        peopleCount,
        isDiscounted,
        orderTotalPrice: firstOrderTotalPrice + secondOrderTotalPrice,
        meals: {
          create: [
            {
              mealId: firstMealId,
              options: {
                createMany: {
                  data: [...firstOptionIds.flatMap((optionId) => (optionId ? { mealItemOptionId: optionId } : []))]
                }
              }
            },
            {
              mealId: secondMealId,
              options: {
                createMany: {
                  data: [...secondOptionIds.flatMap((optionId) => (optionId ? { mealItemOptionId: optionId } : []))]
                }
              }
            }
          ]
        }
      }
    });
  } else {
    return await prisma.order.create({
      data: {
        userId,
        restaurantId,
        peopleCount,
        isDiscounted,
        orderTotalPrice: firstOrderTotalPrice,
        meals: {
          create: [
            {
              mealId: firstMealId,
              options: {
                createMany: {
                  data: [...firstOptionIds.flatMap((optionId) => (optionId ? { mealItemOptionId: optionId } : []))]
                }
              }
            }
          ]
        }
      }
    });
  }
}
