import prisma from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getMealImageUrl } from "@/utils/image/getMealImageUrl";

type Params = { params: { mealId: string } };

export default async function MealDetail({ params }: Params) {
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId, isInactive: false, outdatedAt: null },
    include: {
      restaurant: true,
      items: { include: { options: true } }
    }
  });

  if (!meal) redirect("/");

  redirect("/restaurants/" + meal.restaurantId);
}

export async function generateMetadata({ params }: Params): Promise<Metadata | undefined> {
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId },
    select: { imagePath: true, restaurant: { select: { name: true } } }
  });
  return meal?.imagePath
    ? { title: `${meal.restaurant.name} | Watt`, openGraph: { images: [getMealImageUrl(meal.imagePath)] } }
    : undefined;
}
