"use server";

import { getMyId } from "@/actions/me";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma/client";
import { createOrder, findOrder, updateOrderStatus } from "./order";
import { applyEarlyDiscount } from "@/utils/discount-price";
import { CancellationReason, CancellationUserType } from "@prisma/client";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { deleteHttpTask } from "@/lib/googleTasks/deleteHttpTask";

export async function createPaymentIntent({
  mealId,
  userId,
  paymentMethodId
}: {
  mealId: string;
  userId: string;
  paymentMethodId: string;
}) {
  const myId = await getMyId();
  if (myId !== userId) throw new Error("Invalid User");

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { id: true, isDiscarded: true, price: true }
  });
  if (!meal || meal.isDiscarded) throw new Error("Meal is discarded");

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { stripeCustomer: true } });
  if (!user || !user.stripeCustomer) throw new Error("User not found");

  const paymentMethod = await stripe.customers.retrievePaymentMethod(
    user.stripeCustomer.stripeCustomerId,
    paymentMethodId
  );
  if (!paymentMethod) throw new Error("Payment method not found");

  const discountedPrice = applyEarlyDiscount(meal.price);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: discountedPrice,
    currency: "jpy",
    customer: user.stripeCustomer.stripeCustomerId,
    payment_method: paymentMethod.id,
    off_session: true,
    capture_method: "manual",
    confirm: true
  });

  const order = await createOrder({
    mealId: meal.id,
    userId: user.id,
    providerPaymentId: paymentIntent.id,
    price: discountedPrice
  });

  const taskId = await createHttpTask({
    url: `${process.env.NEXT_PUBLIC_HOST_URL}/api/cron/update-order-status`,
    delaySeconds: 60 * 30,
    payload: { orderId: order.id }
  });

  if (!taskId) throw new Error("Failed to update order task id");

  await prisma.order.update({ where: { id: order.id }, data: { taskId } });

  return paymentIntent.status;
}

export async function capturePaymentIntent(orderId: string) {
  const order = await findOrder({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  if (order.status !== "PREAUTHORIZED") throw new Error("Invalid order status");

  const paymentIntent = await stripe.paymentIntents.capture(order.providerPaymentId);
  if (paymentIntent.status === "succeeded") {
    await updateOrderStatus({ id: orderId, status: "COMPLETE" });
    await deleteHttpTask(orderId);
  }

  return paymentIntent.status;
}

export async function cancelPaymentIntent({
  orderId,
  reason,
  cancelledBy
}: {
  orderId: string;
  reason: CancellationReason;
  cancelledBy: CancellationUserType;
}) {
  const order = await findOrder({ where: { id: orderId } });
  if (!order) {
    throw new Error("Order not found");
  }

  const paymentIntent = await stripe.paymentIntents.cancel(order.providerPaymentId);
  if (paymentIntent.status === "canceled") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    });
    await prisma.orderCancellation.create({
      data: {
        orderId,
        reason,
        cancelledBy
      }
    });
  }
  return paymentIntent.status;
}
