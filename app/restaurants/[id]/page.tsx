import stripe from "@/lib/stripe";
import RestaurantDetail from "@/components/restaurant-detail";
import { getStripeCustomer } from "@/actions/stripeCustomer";

type Params = {
  id: string;
};

export default async function RestaurantPage({ params }: { params: Params }) {
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
    <RestaurantDetail
      selectedRestaurantId={restaurantId}
      paymentMethods={paymentMethods.data}
    />
  );
}
