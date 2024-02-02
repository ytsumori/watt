import stripe from "@/lib/stripe";
import RestaurantDetail from "@/app/(app)/restaurants/[restaurantId]/meals/[mealId]/_components/page-client";
import { getStripeCustomer } from "@/actions/stripe-customer";
import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Params = {
  restaurantId: string;
  mealId: string;
};

export default async function RestaurantPage({ params }: { params: Params }) {
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId, restaurantId: params.restaurantId },
    include: { restaurant: true },
  });
  if (!meal) {
    redirect("/");
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
        paymentMethods={paymentMethods?.data ?? []}
        meal={meal}
      />
    );
  }

  return <RestaurantDetail meal={meal} paymentMethods={[]} />;
}
