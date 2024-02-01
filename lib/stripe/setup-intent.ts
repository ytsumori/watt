"use server";

import stripe from "./client";
import prisma from "@/lib/prisma";
import { getMe } from "@/actions/me";

export async function createSetupIntent() {
  const user = await getMe();
  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: { userId: user.id },
  });

  const customer = stripeCustomer
    ? await stripe.customers.retrieve(stripeCustomer.stripeCustomerId)
    : await createNewStripeCustomer({
        userId: user.id,
        name: user.name ?? undefined,
      });

  const response = await stripe.setupIntents.create({
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return response.client_secret;
}

async function createNewStripeCustomer({
  userId,
  name,
}: {
  userId: string;
  name?: string;
}) {
  const customer = await stripe.customers.create({ name });
  await prisma.stripeCustomer.create({
    data: {
      userId,
      stripeCustomerId: customer.id,
    },
  });
  return customer;
}
