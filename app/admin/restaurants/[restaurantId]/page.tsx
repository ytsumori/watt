import prisma from "@/lib/prisma/client";
import { RestaurantDetailPage } from "./_components/page-client";

type PageProps = { params: { restaurantId: string } };

export default async function RestaurantPage({ params }: PageProps) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    select: {
      id: true,
      name: true,
      bankAccount: true,
      meals: {
        orderBy: { price: "asc" },
        include: {
          items: {
            orderBy: { position: "asc" }
          },
          orders: {
            select: {
              id: true
            }
          }
        }
      },
      smokingOption: true,
      paymentOptions: true,
      phoneNumber: true
    }
  });

  if (!restaurant) return <>データが見つかりません</>;
  return <RestaurantDetailPage restaurant={restaurant} />;
}
