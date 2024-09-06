import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RestaurantModalPage } from "./_components/RestaurantModalPage";

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
      googleMapPlaceInfo: { select: { url: true, latitude: true, longitude: true } },
      paymentOptions: true,
      openingHours: true,
      exteriorImage: true,
      menuImages: { orderBy: { menuNumber: "asc" } }
    }
  });
  if (!restaurant) redirect("/");

  const session = await getServerSession(options);

  return <RestaurantModalPage restaurant={restaurant} userId={session?.user.id} />;
}
