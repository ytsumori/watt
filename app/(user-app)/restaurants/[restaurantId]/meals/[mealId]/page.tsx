import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MealPage from "./_components/MealPage";
import { findPreorder } from "@/actions/order";
import { Metadata } from "next";
import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";

type Params = { params: { restaurantId: string; mealId: string } };

export default async function Meal({ params }: Params) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    select: { isOpen: true }
  });
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId, restaurantId: params.restaurantId },
    include: {
      restaurant: {
        include: {
          meals: { where: { NOT: { id: params.mealId }, isDiscarded: false } },
          googleMapPlaceInfo: { select: { url: true } },
          paymentOptions: true
        }
      }
    }
  });
  if (!restaurant || !meal) redirect("/");

  const session = await getServerSession(options);
  if (session) {
    // logged in
    const userId = session.user.id;
    const order = await findPreorder(userId);

    return (
      <MealPage
        meal={meal}
        preauthorizedOrder={order ?? undefined}
        userId={userId}
        isRestaurantActive={restaurant.isOpen}
      />
    );
  }

  return <MealPage meal={meal} isRestaurantActive={restaurant.isOpen} />;
}

export async function generateMetadata({ params }: Params): Promise<Metadata | undefined> {
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId, restaurantId: params.restaurantId },
    select: { title: true, description: true, imagePath: true }
  });

  if (meal) {
    const url = transformSupabaseImage("meals", meal.imagePath);
    return {
      title: `${meal.title} | Watt`,
      description: meal.description,
      openGraph: { images: [url] }
    };
  }
}
