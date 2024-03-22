"use server";

import stripe from "@/lib/stripe";

export async function detachPaymentMethod({ paymentMethodId }: { paymentMethodId: string }) {
  return await stripe.paymentMethods.detach(paymentMethodId);
}
