import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { findInProgressOrder } from "../../_actions/findInProgressOrder";
import { getMealImageUrl } from "@/utils/image/getMealImageUrl";
import { RestaurantPage } from "../../_components/RestaurantPage";

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
      paymentOptions: true,
      openingHours: true,
      exteriorImage: true,
      menuImages: { orderBy: { menuNumber: "asc" } }
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
      <RestaurantPage
        restaurant={restaurant}
        inProgressOrderId={order?.id ?? undefined}
        userId={userId}
        defaultMeal={defaultMeal}
      />
    );
  }

  return <RestaurantPage restaurant={restaurant} defaultMeal={defaultMeal} />;
}

export async function generateMetadata({ params }: Params): Promise<Metadata | undefined> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: { meals: { where: { isInactive: false } }, googleMapPlaceInfo: { select: { url: true } } }
  });

  if (restaurant && restaurant.meals.length > 0) {
    const url = getMealImageUrl(restaurant.meals[0].imagePath);
    return {
      title: `${restaurant.name} | Watt`,
      openGraph: { images: [url] }
    };
  }
}
