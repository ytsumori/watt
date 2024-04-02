import { getGoogleMapUrl } from "@/lib/places-api";
import { RestaurantLayout } from "./_components/RestaurantLayout";
import prisma from "@/lib/prisma/client";
import { redirect } from "next/navigation";

type Props = {
  params: {
    restaurantId: string;
  };
  children: React.ReactNode;
};

export default async function Restaurant({ children, params }: Props) {
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
  const { googleMapsUri } = await getGoogleMapUrl({ placeId: restaurant.googleMapPlaceId });
  return (
    <RestaurantLayout restaurant={restaurant} googleMapsUri={googleMapsUri}>
      {children}
    </RestaurantLayout>
  );
}
