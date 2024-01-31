"use server";

import prisma from "@/lib/prisma";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth/next";

export async function getMyId() {
  const session = await getServerSession(options);
  if (!session) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function isPaymentMethodRegistered() {
  const session = await getServerSession(options);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      stripeCustomer: true,
      paypayCustomer: true,
    },
  });

  return !!(user?.stripeCustomer || user?.paypayCustomer);
}
