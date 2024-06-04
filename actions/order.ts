"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/client";

export async function findOrder(args: Prisma.OrderFindUniqueArgs) {
  return await prisma.order.findUnique(args);
}

export async function findPreorder(userId: string) {
  return await prisma.order.findFirst({
    where: {
      userId,
      completedAt: null,
      canceledAt: null
    }
  });
}
