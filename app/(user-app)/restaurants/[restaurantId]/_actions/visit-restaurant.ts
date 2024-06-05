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
  secondMealId?: string;
  peopleCount: 1 | 2;
};

export async function visitRestaurant({ userId, restaurantId, firstMealId, secondMealId, peopleCount }: Args) {
  const inProgressOrder = await findInProgressOrder(userId);
  if (inProgressOrder) {
    throw new Error("Active order already exists");
  }

  const firstMeal = await prisma.meal.findUnique({
    where: { id: firstMealId, restaurantId },
    select: { id: true, price: true, isDiscarded: true, restaurant: { select: { phoneNumber: true } } }
  });
  if (!firstMeal) {
    throw new Error("First meal not found");
  } else if (firstMeal.isDiscarded) {
    throw new Error("First meal is discarded");
  }

  let order: Order;
  if (secondMealId) {
    if (secondMealId === firstMealId) {
      order = await prisma.order.create({
        data: { userId, restaurantId, peopleCount, meals: { create: [{ mealId: firstMealId, quantity: 2 }] } }
      });
    } else {
      order = await prisma.order.create({
        data: {
          userId,
          restaurantId,
          peopleCount,
          meals: {
            createMany: {
              data: [
                { mealId: firstMealId, quantity: 1 },
                { mealId: secondMealId, quantity: 1 }
              ]
            }
          }
        }
      });
    }
  } else {
    order = await prisma.order.create({
      data: { userId, restaurantId, peopleCount, meals: { create: [{ mealId: firstMealId, quantity: 1 }] } }
    });
  }

  // const taskId = await createHttpTask({ name: "cancel-order", delaySeconds: 60 * 30, payload: { orderId: order.id } });

  // if (taskId) {
  //   await prisma.orderAutomaticCancellation.create({ data: { orderId: order.id, googleCloudTaskId: taskId } });
  // } else {
  //   console.error("Error creating task");
  // }

  // try {
  //   await notifyStaffOrder({ orderId: order.id });
  // } catch (e) {
  //   console.error("Error notifying staff", e);
  // }

  // await createHttpTask({ name: "call-restaurant", delaySeconds: 60 * 3, payload: { orderId: order.id } });

  return order;
}
