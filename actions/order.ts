"use server";

import { OrderStatus, PaymentProvider, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/client";

export async function findOrder(args: Prisma.OrderFindUniqueArgs) {
  return await prisma.order.findUnique(args);
}

export async function findPreauthorizedOrder(userId: string) {
  return await prisma.order.findFirst({
    where: {
      userId,
      status: "PREAUTHORIZED",
    },
  });
}

export async function getOrders(args: Prisma.OrderFindManyArgs) {
  return await prisma.order.findMany(args);
}

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
  const existingPayment = await findPreauthorizedOrder(userId);
  if (existingPayment) {
    throw new Error("Active payment already exists");
  }

  return await prisma.order.create({
    data: {
      userId,
      mealId: meal.id,
      paymentProvider,
      providerPaymentId,
      price: meal.price,
    },
  });
}

export async function updateOrderStatus({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
}
