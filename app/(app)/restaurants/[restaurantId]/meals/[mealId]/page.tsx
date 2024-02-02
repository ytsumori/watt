import stripe from "@/lib/stripe";
import RestaurantDetail from "@/app/(app)/restaurants/[restaurantId]/meals/[mealId]/_components/page-client";
import { getStripeCustomer } from "@/actions/stripe-customer";
import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findPreauthorizedPayment } from "@/actions/payment";

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
    const user = session.user;
    const payment = await findPreauthorizedPayment(user.id);
    const orderedMeal = await prisma.meal.findUnique({
      where: { id: payment?.order.mealId },
    });
    const stripeCustomer = await getStripeCustomer({ userId: user.id });
    const paymentMethods = stripeCustomer
      ? await stripe.customers.listPaymentMethods(
          stripeCustomer.stripeCustomerId
        )
      : undefined;

    return (
      <RestaurantDetail
        paymentMethods={paymentMethods?.data ?? []}
        meal={meal}
        defaultPreauthorizedPayment={
          payment && orderedMeal
            ? { ...payment, order: { ...payment.order, meal: orderedMeal } }
            : undefined
        }
        user={user}
      />
    );
  }

  return <RestaurantDetail meal={meal} paymentMethods={[]} />;
}
