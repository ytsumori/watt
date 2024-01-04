import stripe from "@/lib/stripe";
import RestaurantModal from "./_components/client-component";
import { getStripeCustomer } from "@/actions/stripeCustomer";

type Params = {
  id: string;
};

export default async function RestaurantModalPage({
  params,
}: {
  params: Params;
}) {
  const restaurantId = Number(params.id);
  if (isNaN(restaurantId)) {
    throw new Error("Invalid restaurant id");
  }

  const stripeCustomer = await getStripeCustomer();
  if (!stripeCustomer) {
    throw new Error("Invalid stripe customer");
  }
  const paymentMethods = await stripe.customers.listPaymentMethods(
    stripeCustomer.stripeCustomerId
  );

  return (
    <RestaurantModal
      restaurantId={restaurantId}
      paymentMethods={paymentMethods.data}
    />
  );
}
