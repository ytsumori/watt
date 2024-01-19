import stripe from "@/lib/stripe";
import RestaurantModal from "./_components/page-client";
import { getStripeCustomer } from "@/actions/stripe-customer";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/lib/next-auth/options";

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

  const session = await getServerSession(options);

  if (session) {
    // logged in
    const stripeCustomer = await getStripeCustomer();
    const paymentMethods = stripeCustomer
      ? await stripe.customers.listPaymentMethods(
          stripeCustomer.stripeCustomerId
        )
      : undefined;

    return (
      <RestaurantModal
        selectedRestaurant={selectedRestaurant}
        paymentMethods={paymentMethods?.data ?? []}
      />
    );
  }

  return (
    <RestaurantModal
      selectedRestaurant={selectedRestaurant}
      paymentMethods={[]}
    />
  );
}
