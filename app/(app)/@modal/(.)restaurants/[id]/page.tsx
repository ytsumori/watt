import stripe from "@/lib/stripe/client";
import RestaurantModal from "./_components/page-client";
import { getStripeCustomer } from "@/actions/stripe-customer";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/lib/next-auth/options";

type Params = {
  id: string;
};

type SearchParams = {
  mealId?: string;
};

export default async function RestaurantModalPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const restaurantId = params.id;
  const selectedRestaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });
  if (!selectedRestaurant) {
    throw new Error("Invalid restaurant id");
  }
  const mealId = searchParams.mealId;
  let meal;
  if (mealId) {
    meal =
      (await prisma.meal.findUnique({
        where: { id: mealId, restaurantId: restaurantId, isDiscarded: false },
      })) ?? undefined;
  }
  if (meal === undefined) {
    meal =
      (await prisma.meal.findFirst({
        where: { restaurantId: restaurantId, isDiscarded: false },
      })) ?? undefined;
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
        meal={meal}
      />
    );
  }

  return (
    <RestaurantModal
      selectedRestaurant={selectedRestaurant}
      paymentMethods={[]}
      meal={meal}
    />
  );
}
