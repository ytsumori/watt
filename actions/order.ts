"use server";

import { PaymentProvider } from "@prisma/client";
import prisma from "@/lib/prisma/client";
import { findPreauthorizedPayment } from "./payment";

export async function createOrder({
  mealId,
  userId,
  providerPaymentId,
  paymentProvider,
}: {
  mealId: string;
  userId: string;
  providerPaymentId: string;
  paymentProvider: PaymentProvider;
}) {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { id: true, price: true, isDiscarded: true },
  });
  if (!meal) {
    throw new Error("Meal not found");
  } else if (meal.isDiscarded) {
    throw new Error("Meal is discarded");
  }
  const existingPayment = await findPreauthorizedPayment(userId);
  if (existingPayment) {
    throw new Error("Active payment already exists");
  }

  return await prisma.order.create({
    data: {
      userId,
      mealId: meal.id,
      payments: {
        create: {
          paymentProvider,
          providerPaymentId,
          amount: meal.price,
        },
      },
    },
  });
}
