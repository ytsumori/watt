import prisma from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { RestaurantPage } from "./_components/RestaurantPage";
import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";
import { Metadata } from "next";

type Params = { params: { restaurantId: string } };

export default async function Restaurant({ params }: Params) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: { meals: { where: { isDiscarded: false } }, googleMapPlaceInfo: { select: { url: true } } }
  });
  if (!restaurant) redirect("/");

  return <RestaurantPage restaurant={restaurant} />;
}

export async function generateMetadata({ params }: Params): Promise<Metadata | undefined> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: { meals: { where: { isDiscarded: false } }, googleMapPlaceInfo: { select: { url: true } } }
  });

  if (restaurant && restaurant.meals.length > 0) {
    const url = transformSupabaseImage("meals", restaurant.meals[0].imagePath);
    return {
      title: restaurant.name,
      openGraph: { images: [url] }
    };
  }
}
