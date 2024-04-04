import prisma from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { RestaurantPage } from "./_components/RestaurantPage";

type Props = {
  params: {
    restaurantId: string;
  };
};

export default async function Restaurant({ params }: Props) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: {
      meals: {
        where: {
          isDiscarded: false,
        },
      },
      googleMapPlaceInfo: {
        select: {
          url: true,
        },
      },
    },
  });
  if (!restaurant) {
    redirect("/");
  }
  return <RestaurantPage restaurant={restaurant} />;
}
