"use server";

import { findInProgressOrder } from "@/app/(user-app)/_actions/findInProgressOrder";
import { notifyStaffOrder } from "./notify-staff-order";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { logger } from "@/utils/logger";
import { createOrder } from "@/actions/mutations/order";

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

  try {
    await notifyStaffOrder({ orderId: order.id });
  } catch (e) {
    logger({ severity: "ERROR", message: "Error notifying staff", payload: { e } });
  }

  await createHttpTask({ name: "call-restaurant", delaySeconds: 60, payload: { orderId: order.id } }).catch((e) =>
    logger({ severity: "ERROR", message: "Error creating task", payload: { e } })
  );

  return order;
}
