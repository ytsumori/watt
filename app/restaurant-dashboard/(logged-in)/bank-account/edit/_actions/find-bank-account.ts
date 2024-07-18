"use server";

import prisma from "@/lib/prisma/client";

export async function findBankAccount(restaurantId: string) {
  return await prisma.restaurantBankAccount.findFirst({
    where: {
      restaurantId
    },
    include: {
      restaurant: true
    }
  });
}
