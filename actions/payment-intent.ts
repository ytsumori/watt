"use server";

import { getMyId } from "@/actions/me";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma/client";
import { applyEarlyDiscount } from "@/utils/discount-price";
import { deleteHttpTask } from "@/lib/googleTasks/deleteHttpTask";

export async function createPaymentIntent({
  orderId,
  paymentMethodId,
  additionalAmount
}: {
  orderId: string;
  paymentMethodId: string;
  additionalAmount: number;
}) {
  const myId = await getMyId();

  const order = await prisma.order.findUnique({
    include: { meal: true },
    where: { id: orderId, userId: myId }
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== "COMPLETE") throw new Error("Invalid order status");

  const user = await prisma.user.findUnique({ where: { id: myId }, include: { stripeCustomer: true } });
  if (!user || !user.stripeCustomer) throw new Error("User not found");

  const paymentMethod = await stripe.customers.retrievePaymentMethod(
    user.stripeCustomer.stripeCustomerId,
    paymentMethodId
  );
  if (!paymentMethod) throw new Error("Payment method not found");

  const discountedPrice = applyEarlyDiscount(order.meal.price);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: discountedPrice,
    currency: "jpy",
    customer: user.stripeCustomer.stripeCustomerId,
    payment_method: paymentMethod.id,
    off_session: true,
    capture_method: "manual",
    confirm: true
  });

  const payment = await prisma.payment.create({
    data: {
      orderId,
      stripePaymentId: paymentIntent.id,
      additionalAmount: additionalAmount,
      totalAmount: discountedPrice + additionalAmount,
      restaurantProfitPrice: order.meal.price
    }
  });

  return payment.id;
}

export async function capturePaymentIntent({ paymentId }: { paymentId: string }) {
  const myId = await getMyId();

  const payment = await prisma.payment.findUnique({ include: { order: true }, where: { id: paymentId } });
  if (!payment) throw new Error("Payment not found");

  if (payment.order.userId !== myId) throw new Error("Invalid User");
  if (payment.order.status !== "COMPLETE") throw new Error("Invalid order status");

  const paymentIntent = await stripe.paymentIntents.capture(payment.stripePaymentId);
  if (paymentIntent.status === "succeeded") {
    await prisma.payment.update({ where: { id: payment.id }, data: { completedAt: new Date() } });
    await deleteHttpTask(payment.orderId);
  }

  return paymentIntent.status;
}
