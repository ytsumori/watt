"use server";

import prisma from "@/lib/prisma/client";

export async function getStripeCustomer({ userId }: { userId: string }) {
  return await prisma.stripeCustomer.findUnique({ where: { userId } });
}

export async function createStripeCustomer({
  stripeCustomerId,
  userId,
}: {
  stripeCustomerId: string;
  userId: string;
}) {
  return await prisma.stripeCustomer.create({
    data: { userId, stripeCustomerId },
  });
}
