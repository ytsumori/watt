import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findInProgressOrder } from "@/app/(user-app)/_actions/findInProgressOrder";
import { RestaurantModalPage } from "@/app/(user-app)/@modal/(.)restaurants/[restaurantId]/_components/RestaurantModalPage";

type Params = { params: { restaurantId: string }; searchParams: { mealId?: string } };

export default async function Restaurant({ params, searchParams }: Params) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: {
      meals: {
        where: { isInactive: false, outdatedAt: null },
        orderBy: { price: "asc" },
        include: { items: { include: { options: true } } }
      },
      googleMapPlaceInfo: { select: { url: true } },
      paymentOptions: true
    }
  });
  if (!restaurant) redirect("/");

  const defaultMeal = restaurant.meals.find((meal) => meal.id === searchParams.mealId);

  const session = await getServerSession(options);
  if (session) {
    // logged in
    const userId = session.user.id;
    const order = await findInProgressOrder(userId);

    return (
      <RestaurantModalPage
        restaurant={restaurant}
        inProgressOrderId={order?.id ?? undefined}
        userId={userId}
        defaultMeal={defaultMeal}
      />
    );
  }

  return <RestaurantModalPage restaurant={restaurant} defaultMeal={defaultMeal} />;
}
