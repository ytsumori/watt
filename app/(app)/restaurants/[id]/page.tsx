import stripe from "@/lib/stripe";
import RestaurantDetail from "@/components/restaurant-detail";
import { getStripeCustomer } from "@/actions/stripe-customer";
import prisma from "@/lib/prisma";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";

type Params = {
  id: string;
};

type SearchParams = {
  mealId?: string;
};

export default async function RestaurantPage({
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
  console.log(searchParams);
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
      <RestaurantDetail
        selectedRestaurant={selectedRestaurant}
        paymentMethods={paymentMethods?.data ?? []}
        meal={meal}
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
