import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getMealImageUrl } from "@/utils/image/getMealImageUrl";
import { OrderNewPage } from "./_components/OrderNewPage";
import { findInProgressOrder } from "@/app/(user-app)/_actions/findInProgressOrder";
import { Box } from "@chakra-ui/react";

type Params = { params: { restaurantId: string } };

export default async function OrderNew({ params }: Params) {
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
      menuImages: { orderBy: { menuNumber: "asc" } }
    }
  });

  if (!restaurant) redirect("/");

  const session = await getServerSession(options);
  const userId = session?.user.id;

  if (!userId) redirect("/");

  const order = await findInProgressOrder(userId);

  return (
    <Box h="100dvh">
      <OrderNewPage restaurant={restaurant} inProgressOrderId={order?.id ?? undefined} userId={userId} />
    </Box>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata | undefined> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    include: { meals: { where: { isInactive: false } }, googleMapPlaceInfo: { select: { url: true } } }
  });

  if (restaurant && restaurant.meals.length > 0) {
    const url = getMealImageUrl(restaurant.meals[0].imagePath);
    return { title: restaurant.name, openGraph: { images: [url] } };
  }
}
