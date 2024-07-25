"use server";

import prisma from "@/lib/prisma/client";

export async function createFullStatus({ restaurantId }: { restaurantId: string }) {
  const currentStatus = await prisma.restaurantFullStatus.findFirst({
    where: {
      restaurantId,
      easedAt: null
    }
  });
  if (currentStatus) {
    throw new Error("Full status already exists");
  }

  return await prisma.restaurantFullStatus.create({
    data: {
      restaurantId
    }
  });
}
