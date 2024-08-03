import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
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
      paymentOptions: true,
      fullStatuses: {
        where: { easedAt: null },
        select: { easedAt: true }
      },
      menuImages: { orderBy: { menuNumber: "asc" } }
    }
  });
  if (!restaurant) redirect("/");

  const session = await getServerSession(options);

  return <RestaurantModalPage restaurant={restaurant} userId={session?.user.id} />;
}
