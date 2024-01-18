"use server";

import prisma from "@/lib/prisma";
import { getMyId } from "./Me";

export async function getStripeCustomer() {
  const userId = await getMyId();
  return await prisma.stripeCustomer.findUnique({ where: { userId } });
}

export async function createStripeCustomer(stripeCustomerId: string) {
  const userId = await getMyId();

  return await prisma.stripeCustomer.create({
    data: { userId, stripeCustomerId },
  });
}
