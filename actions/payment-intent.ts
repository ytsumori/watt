"use server";

import { getMyId } from "@/actions/me";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma/client";

export async function createPaymentIntent({
  orderId,
  paymentMethodId,
  amount
}: {
  orderId: string;
  paymentMethodId: string;
  amount: number;
}) {
  if (amount <= 0) throw new Error("Invalid amount");
  const myId = await getMyId();

  const order = await prisma.order.findUnique({
    include: { payment: true, meals: { select: { meal: { select: { price: true } }, quantity: true } } },
    where: { id: orderId, userId: myId }
  });

  if (!order) throw new Error("Order not found");
  if (!order.completedAt) throw new Error("Order not completed");

  const user = await prisma.user.findUnique({ where: { id: myId }, include: { stripeCustomer: true } });
  if (!user || !user.stripeCustomer) throw new Error("User not found");

  const paymentMethod = await stripe.customers.retrievePaymentMethod(
    user.stripeCustomer.stripeCustomerId,
    paymentMethodId
  );
  if (!paymentMethod) throw new Error("Payment method not found");

  if (order.payment) {
    if (order.payment.completedAt !== null) throw new Error("Payment already completed");

    const oldIntent = await stripe.paymentIntents.cancel(order.payment.stripePaymentId);
    if (oldIntent.status !== "canceled") throw new Error("Failed to cancel old payment intent");
    await prisma.payment.delete({ where: { id: order.payment.id } });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
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
      additionalAmount: amount - order.meals.reduce((acc, meal) => acc + meal.meal.price * meal.quantity, 0),
      totalAmount: amount,
      restaurantProfitPrice: amount
    }
  });
  return payment.id;
}

export async function capturePaymentIntent({ paymentId }: { paymentId: string }) {
  const myId = await getMyId();

  const payment = await prisma.payment.findUnique({ include: { order: true }, where: { id: paymentId } });
  if (!payment) throw new Error("Payment not found");

  if (payment.order.userId !== myId) throw new Error("Invalid User");
  if (!payment.order.completedAt) throw new Error("Order not completed");

  const paymentIntent = await stripe.paymentIntents.capture(payment.stripePaymentId);
  if (paymentIntent.status === "succeeded") {
    await prisma.payment.update({ where: { id: payment.id }, data: { completedAt: new Date() } });
  }

  return paymentIntent.status;
}
