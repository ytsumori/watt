"use server";

import { notifyStaffOrder } from "./notify-staff-order";
import prisma from "@/lib/prisma/client";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { findPreorder } from "@/actions/order";

export async function visitRestaurant({ mealId, userId }: { mealId: string; userId: string }) {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { id: true, price: true, isDiscarded: true }
  });
  if (!meal) {
    throw new Error("Meal not found");
  } else if (meal.isDiscarded) {
    throw new Error("Meal is discarded");
  }
  const existingPayment = await findPreorder(userId);
  if (existingPayment) {
    throw new Error("Active payment already exists");
  }

  const order = await prisma.order.create({
    data: {
      userId,
      mealId
    }
  });

  const taskId = await createHttpTask({
    url: `${process.env.NEXT_PUBLIC_HOST_URL}/api/cloud-tasks/cancel-order`,
    delaySeconds: 60 * 30,
    payload: { orderId: order.id }
  });

  if (taskId) {
    await prisma.orderAutomaticCancellation.create({
      data: {
        orderId: order.id,
        googleCloudTaskId: taskId
      }
    });
  } else {
    console.error("Error creating task");
  }

  try {
    await notifyStaffOrder({ orderId: order.id });
  } catch (e) {
    console.error("Error notifying staff", e);
  }

  return order;
}
