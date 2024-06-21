"use server";

import prisma from "@/lib/prisma/client";

type CreateOrderArgs = {
  userId: string;
  restaurantId: string;
  firstMealId: string;
  firstOptionIds: (string | null)[];
  secondMealId?: string;
  secondOptionIds?: (string | null)[];
  peopleCount: 1 | 2;
};

export async function createOrder({
  userId,
  restaurantId,
  firstMealId,
  firstOptionIds,
  secondMealId,
  secondOptionIds,
  peopleCount
}: CreateOrderArgs) {
  const firstMeal = await prisma.meal.findUnique({
    where: { id: firstMealId, restaurantId },
    select: {
      id: true,
      price: true,
      isDiscarded: true,
      restaurant: { select: { phoneNumber: true } },
      items: { select: { options: { select: { id: true, extraPrice: true } } } }
    }
  });

  if (!firstMeal) {
    throw new Error("First meal not found");
  } else if (firstMeal.isDiscarded) {
    throw new Error("First meal is discarded");
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

  const firstOrderTotalPrice =
    firstMeal.price +
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
        isDiscarded: true,
        price: true,
        items: { select: { options: { select: { id: true, extraPrice: true } } } }
      }
    });
    if (!secondMeal) {
      throw new Error("Second meal not found");
    } else if (secondMeal.isDiscarded) {
      throw new Error("Second meal is discarded");
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

    if (
      secondMealId === firstMealId &&
      secondOptionIds.every((optionId, index) => optionId === firstOptionIds[index])
    ) {
      return await prisma.order.create({
        data: {
          userId,
          restaurantId,
          peopleCount,
          orderTotalPrice: firstOrderTotalPrice * 2,
          meals: {
            create: [
              {
                mealId: firstMealId,
                quantity: 2,
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
    } else {
      const secondOrderTotalPrice =
        secondMeal.price +
        secondMeal.items.reduce((acc, item, index) => {
          const optionId = secondOptionIds[index];

          return acc + (optionId ? item.options.find((option) => option.id === optionId)?.extraPrice ?? 0 : 0);
        }, 0);
      return await prisma.order.create({
        data: {
          userId,
          restaurantId,
          peopleCount,
          orderTotalPrice: firstOrderTotalPrice + secondOrderTotalPrice,
          meals: {
            create: [
              {
                mealId: firstMealId,
                quantity: 1,
                options: {
                  createMany: {
                    data: [...firstOptionIds.flatMap((optionId) => (optionId ? { mealItemOptionId: optionId } : []))]
                  }
                }
              },
              {
                mealId: secondMealId,
                quantity: 1,
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
    }
  } else {
    return await prisma.order.create({
      data: {
        userId,
        restaurantId,
        peopleCount,
        orderTotalPrice: firstOrderTotalPrice,
        meals: {
          create: [
            {
              mealId: firstMealId,
              quantity: 1,
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
