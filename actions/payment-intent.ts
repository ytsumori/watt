"use server";

import { getMyId } from "@/actions/me";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma/client";
import { createOrder } from "./order";

export async function createPaymentIntent({
  mealId,
  userId,
  paymentMethodId,
}: {
  mealId: string;
  userId: string;
  paymentMethodId: string;
}) {
  const myId = await getMyId();
  if (myId !== userId) {
    throw new Error("Invalid User");
  }
  const meal = await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
    select: {
      id: true,
      isDiscarded: true,
      price: true,
    },
  });
  if (!meal || meal.isDiscarded) {
    throw new Error("Meal is discarded");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { stripeCustomer: true },
  });
  if (!user || !user.stripeCustomer) {
    throw new Error("User not found");
  }
  const paymentMethod = await stripe.customers.retrievePaymentMethod(
    user.stripeCustomer.stripeCustomerId,
    paymentMethodId
  );
  if (!paymentMethod) {
    throw new Error("Payment method not found");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: meal.price,
    currency: "jpy",
    customer: user.stripeCustomer.stripeCustomerId,
    payment_method: paymentMethod.id,
    off_session: true,
    capture_method: "manual",
    confirm: true,
  });

  await createOrder({
    mealId: meal.id,
    userId: user.id,
    providerPaymentId: paymentIntent.id,
    paymentProvider: "STRIPE",
  });

  return paymentIntent.status;
}
