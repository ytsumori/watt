import { getMe } from "@/actions/me";
import { getStripeCustomer } from "@/actions/stripe-customer";
import stripe from "@/lib/stripe";
import { redirect } from "next/navigation";
import { PaymentMethodsPage } from "./_conponents/PaymentMethodsPage";

export default async function PaymentMethods() {
  const me = await getMe();
  if (!me) redirect("/");

  const stripeCustomer = await getStripeCustomer({ userId: me.id });
  if (!stripeCustomer) redirect("/payment-methods/new");

  const paymentMethods = await stripe.customers.listPaymentMethods(stripeCustomer.stripeCustomerId);
  return <PaymentMethodsPage paymentMethods={paymentMethods.data}></PaymentMethodsPage>;
}
