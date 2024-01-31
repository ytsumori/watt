"use server";

import prisma from "@/lib/prisma";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth/next";
import stripe from "@/lib/stripe/client";

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

  if (user?.paypayCustomer) {
    return true;
  }

  if (user?.stripeCustomer) {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomer.stripeCustomerId,
      type: "card",
    });
    return paymentMethods.data.length > 0;
  }

  return false;
}
