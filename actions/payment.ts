"use server";

import prisma from "@/lib/prisma/client";
import { PaymentStatus } from "@prisma/client";

export async function findPayment(id: string) {
  return await prisma.payment.findUnique({
    where: {
      id,
    },
  });
}

export async function findPreauthorizedPayment(userId: string) {
  return await prisma.payment.findFirst({
    include: {
      order: true,
    },
    where: {
      order: {
        userId,
      },
      status: "PREAUTHORIZED",
    },
  });
}

export async function getPaymentsByRestaurantId(restaurantId: string) {
  return await prisma.payment.findMany({
    where: {
      order: {
        meal: {
          restaurantId,
        },
      },
    },
  });
}

export async function updatePaymentStatus({
  id,
  status,
}: {
  id: string;
  status: PaymentStatus;
}) {
  const response = await prisma.payment.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return response;
}
