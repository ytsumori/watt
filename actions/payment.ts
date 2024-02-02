"use server";

import prisma from "@/lib/prisma/client";

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
