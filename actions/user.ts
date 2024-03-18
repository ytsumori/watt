"use server";

import prisma from "@/lib/prisma/client";
import stripe from "@/lib/stripe";

export async function isPaymentMethodRegistered(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      stripeCustomer: true,
    },
  });

  if (!user) throw new Error("User not found");

  if (user.stripeCustomer) {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomer.stripeCustomerId,
    });
    return paymentMethods.data.length > 0;
  }

  return false;
}
