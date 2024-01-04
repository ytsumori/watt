import stripe from "@/lib/stripe";
import RestaurantModal from "./_components/client-component";
import { getStripeCustomer } from "@/actions/stripeCustomer";
import prisma from "@/lib/prisma";

type Params = {
  id: string;
};

export default async function RestaurantModalPage({
  params,
}: {
  params: Params;
}) {
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
    <RestaurantModal
      selectedRestaurant={selectedRestaurant}
      paymentMethods={paymentMethods.data}
    />
  );
}
