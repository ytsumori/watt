import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getMealImageUrl } from "@/utils/image/getMealImageUrl";
import { RestaurantPage } from "@/app/(user-app)/_components/RestaurantPage";
import { LogoHeader } from "../../_components/LogoHeader";

type Params = { params: { restaurantId: string } };

export default async function Restaurant({ params }: Params) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: {
      meals: {
        where: { isInactive: false, outdatedAt: null },
        orderBy: { price: "asc" },
        include: { items: { include: { options: { orderBy: { position: "asc" } } } } }
      },
      googleMapPlaceInfo: { select: { url: true } },
      paymentOptions: true,
      openingHours: true,
      exteriorImage: true,
      menuImages: { orderBy: { menuNumber: "asc" } }
    }
  });
  if (!restaurant) redirect("/");

  const session = await getServerSession(options);
  let user;
  if (session?.user) {
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
  }

  return (
    <>
      <LogoHeader />
      <RestaurantPage restaurant={restaurant} userId={session?.user.id} />
    </>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: { meals: { where: { isInactive: false } }, googleMapPlaceInfo: { select: { url: true } } }
  });

  if (!restaurant) return {};

  if (restaurant.meals.length > 0) {
    const url = getMealImageUrl(restaurant.meals[0].imagePath);
    return {
      title: restaurant.name,
      openGraph: { images: [url] }
    };
  }

  return {
    title: restaurant.name
  };
}
