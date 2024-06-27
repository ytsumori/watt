"use server";

import { notifyStaffOrder } from "./notify-staff-order";
import prisma from "@/lib/prisma/client";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { findInProgressOrder } from "@/app/(user-app)/_actions/findInProgressOrder";
import { createOrder } from "@/actions/order";

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

  const order = await createOrder({
    userId,
    restaurantId,
    firstMealId,
    firstOptionIds,
    secondMealId,
    secondOptionIds,
    peopleCount
  });

  // 少し猶予を持たせるため、33分後にキャンセルタスクを作成
  const taskId = await createHttpTask({ name: "cancel-order", delaySeconds: 60 * 33, payload: { orderId: order.id } });

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
