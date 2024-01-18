import stripe from "@/lib/stripe";
import RestaurantDetail from "@/components/restaurant-detail";
import { getStripeCustomer } from "@/actions/StripeCustomer";
import prisma from "@/lib/prisma";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";

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
      <RestaurantDetail
        selectedRestaurant={selectedRestaurant}
        paymentMethods={paymentMethods?.data ?? []}
      />
    );
  }

  return (
    <RestaurantDetail
      selectedRestaurant={selectedRestaurant}
      paymentMethods={[]}
    />
  );
}
