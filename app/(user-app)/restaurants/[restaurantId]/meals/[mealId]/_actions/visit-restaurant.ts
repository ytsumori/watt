"use server";

import { findPreauthorizedOrder } from "@/actions/order";
import { createPaymentIntent } from "@/actions/payment-intent";
import { notifyStaffOrder } from "./notify-staff-order";

export async function visitRestaurant({
  mealId,
  userId,
  paymentMethodId
}: {
  mealId: string;
  userId: string;
  paymentMethodId: string;
}) {
  const status = await createPaymentIntent({ mealId, userId, paymentMethodId });

  if (status !== "requires_capture") {
    throw new Error(`Failed to create payment intent with status: ${status}`);
  }

  const order = await findPreauthorizedOrder(userId);
  if (!order) throw new Error("Preauthorized order not found");

  try {
    await notifyStaffOrder({ orderId: order.id });
  } catch (e) {
    console.error("Error notifying staff", e);
  }

  return order;
}
