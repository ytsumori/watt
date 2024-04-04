import stripe from "@/lib/stripe";
import { getStripeCustomer } from "@/actions/stripe-customer";
import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MealPage from "./_components/MealPage";
import { findPreauthorizedOrder } from "@/actions/order";

type Params = {
  restaurantId: string;
  mealId: string;
};

export default async function Meal({ params }: { params: Params }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    select: { isOpen: true },
  });
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId, restaurantId: params.restaurantId },
    include: {
      restaurant: {
        include: {
          meals: {
            where: {
              NOT: {
                id: params.mealId,
              },
              isDiscarded: false,
            },
          },
          googleMapPlaceInfo: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  });
  if (!restaurant || !meal) {
    redirect("/");
  }

  const session = await getServerSession(options);
  if (session) {
    // logged in
    const userId = session.user.id;
    const order = await findPreauthorizedOrder(userId);

    const stripeCustomer = await getStripeCustomer({ userId });
    const paymentMethods = stripeCustomer
      ? await stripe.customers.listPaymentMethods(stripeCustomer.stripeCustomerId)
      : undefined;

    return (
      <MealPage
        paymentMethods={paymentMethods?.data ?? []}
        meal={meal}
        preauthorizedOrder={order ?? undefined}
        userId={userId}
        isRestaurantActive={restaurant.isOpen}
      />
    );
  }

  return <MealPage meal={meal} isRestaurantActive={restaurant.isOpen} paymentMethods={[]} />;
}
