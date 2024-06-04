import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RestaurantPage } from "./_components/RestaurantPage";
import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";
import { Metadata } from "next";
import { findPreorder } from "@/actions/order";

type Params = { params: { restaurantId: string } };

export default async function Restaurant({ params }: Params) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: {
      meals: { where: { isDiscarded: false }, orderBy: { price: "asc" }, include: { items: true } },
      googleMapPlaceInfo: { select: { url: true } },
      paymentOptions: true
    }
  });
  if (!restaurant) redirect("/");

  const session = await getServerSession(options);
  if (session) {
    // logged in
    const userId = session.user.id;
    const order = await findPreorder(userId);

    return <RestaurantPage restaurant={restaurant} preorderId={order?.id ?? undefined} userId={userId} />;
  }

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
      title: `${restaurant.name} | Watt`,
      openGraph: { images: [url] }
    };
  }
}
