import stripe from "@/lib/stripe";
import RestaurantDetail from "@/components/restaurant-detail";
import { getStripeCustomer } from "@/actions/stripeCustomer";
import prisma from "@/lib/prisma";

type Params = {
  id: string;
};

export default async function RestaurantPage({ params }: { params: Params }) {
  const restaurantId = params.id;
  const selectedRestaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });
  if (!selectedRestaurant) {
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
      selectedRestaurant={selectedRestaurant}
      paymentMethods={paymentMethods.data}
    />
  );
}
