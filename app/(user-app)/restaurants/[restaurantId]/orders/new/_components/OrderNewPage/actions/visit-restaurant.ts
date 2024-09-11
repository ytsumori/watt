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
  mealOrders,
  peopleCount
}: CreateOrderArgs): Promise<Result<Order>> {
  const inProgressOrder = await findInProgressOrder(userId);
  if (inProgressOrder) {
    throw new Error("Active order already exists");
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId }, select: { isAvailable: true } });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  if (!restaurant.isAvailable) {
    return { data: null, error: { message: "Restaurant not available" } };
  }

  const order = await createOrder({
    userId,
    restaurantId,
    mealOrders,
    peopleCount
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
