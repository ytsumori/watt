import { getMe } from "@/actions/me";
import StripeForm from "@/components/stripe/stripe-form";
import { redirect } from "next/navigation";

export default async function NewPaymentMethodPage() {
  const me = await getMe();
  if (!me) redirect("/");
  return <StripeForm />;
}
