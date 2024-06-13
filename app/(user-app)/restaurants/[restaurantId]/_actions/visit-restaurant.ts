"use server";

import { notifyStaffOrder } from "./notify-staff-order";
import prisma from "@/lib/prisma/client";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { Order } from "@prisma/client";
import { findInProgressOrder } from "@/app/(user-app)/_actions/findInProgressOrder";

type Args = {
  userId: string;
  restaurantId: string;
  firstMealId: string;
  firstOptionIds: (string | null)[];
  secondMealId?: string;
  secondOptionIds?: (string | null)[];
  peopleCount: 1 | 2;
};

export async function visitRestaurant({
  userId,
  restaurantId,
  firstMealId,
  firstOptionIds,
  secondMealId,
  secondOptionIds,
  peopleCount
}: Args) {
  const inProgressOrder = await findInProgressOrder(userId);
  if (inProgressOrder) {
    throw new Error("Active order already exists");
  }

  const firstMeal = await prisma.meal.findUnique({
    where: { id: firstMealId, restaurantId },
    select: {
      id: true,
      price: true,
      isDiscarded: true,
      restaurant: { select: { phoneNumber: true } },
      items: { select: { options: { select: { id: true } } } }
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

  let order: Order;
  if (secondMealId) {
    if (!secondOptionIds) throw new Error("Second meal options are required");

    const secondMeal = await prisma.meal.findUnique({
      where: { id: secondMealId, restaurantId },
      select: { id: true, isDiscarded: true, items: { select: { options: { select: { id: true } } } } }
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
      order = await prisma.order.create({
        data: {
          userId,
          restaurantId,
          peopleCount,
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
      order = await prisma.order.create({
        data: {
          userId,
          restaurantId,
          peopleCount,
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
    order = await prisma.order.create({
      data: {
        userId,
        restaurantId,
        peopleCount,
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

  const taskId = await createHttpTask({ name: "cancel-order", delaySeconds: 60 * 30, payload: { orderId: order.id } });

  if (taskId) {
    await prisma.orderAutomaticCancellation.create({ data: { orderId: order.id, googleCloudTaskId: taskId } });
  } else {
    console.error("Error creating task");
  }

  try {
    await notifyStaffOrder({ orderId: order.id });
  } catch (e) {
    console.error("Error notifying staff", e);
  }

  await createHttpTask({ name: "call-restaurant", delaySeconds: 60 * 3, payload: { orderId: order.id } });

  return order;
}
