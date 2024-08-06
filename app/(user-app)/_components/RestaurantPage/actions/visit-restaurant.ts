"use server";

import { findInProgressOrder } from "@/app/(user-app)/_actions/findInProgressOrder";
import { notifyStaffOrder } from "./notify-staff-order";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { logger } from "@/utils/logger";
import { createOrder, CreateOrderArgs } from "@/actions/mutations/order";
import { Order } from "@prisma/client";
import prisma from "@/lib/prisma/client";
import { Result } from "@/types/error";

export async function visitRestaurant({
  userId,
  restaurantId,
  firstMealId,
  firstOptionIds,
  secondMealId,
  secondOptionIds,
  peopleCount,
  isDiscounted
}: CreateOrderArgs): Promise<Result<Order>> {
  const inProgressOrder = await findInProgressOrder(userId);
  if (inProgressOrder) {
    throw new Error("Active order already exists");
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId }, select: { status: true } });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  const isPacked = restaurant.status === "PACKED";
  if (isDiscounted && isPacked) {
    return { data: null, error: { message: "Status outdated" } };
  }

  const order = await createOrder({
    userId,
    restaurantId,
    firstMealId,
    firstOptionIds,
    secondMealId,
    secondOptionIds,
    peopleCount,
    isDiscounted
  });

  try {
    await notifyStaffOrder({ orderId: order.id });
  } catch (e) {
    logger({ severity: "ERROR", message: "Error notifying staff", payload: { e } });
  }

  await createHttpTask({ name: "call-restaurant", delaySeconds: 60, payload: { orderId: order.id } }).catch((e) =>
    logger({ severity: "ERROR", message: "Error creating task", payload: { e } })
  );

  return { data: order, error: null };
}
