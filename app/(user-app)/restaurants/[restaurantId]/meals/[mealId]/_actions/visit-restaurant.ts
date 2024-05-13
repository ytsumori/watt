"use server";

import { notifyStaffOrder } from "./notify-staff-order";
import prisma from "@/lib/prisma/client";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { findPreorder } from "@/actions/order";
import { sendVoiceCall } from "@/lib/xoxzo";

export async function visitRestaurant({ mealId, userId }: { mealId: string; userId: string }) {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { id: true, price: true, isDiscarded: true, restaurant: { select: { phoneNumber: true } } }
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

  const order = await prisma.order.create({ data: { userId, mealId } });

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

  if (meal.restaurant.phoneNumber) {
    try {
      const { callid } = await sendVoiceCall(
        meal.restaurant.phoneNumber,
        "http://tognimzvzoyiykenqufx.supabase.co/storage/v1/object/public/notification-audio/visiting-notificaion.mp3"
      );
      await prisma.orderNotificationCall.create({ data: { orderId: order.id, callId: callid, status: "IN_PROGRESS" } });
      await createHttpTask({ name: "check-call-status", delaySeconds: 60, payload: { orderId: order.id } });
    } catch (e) {
      console.error("Error sending voice call", e);
    }
  }

  return order;
}
