import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/client";
import { OrderPage } from "./_components/OrderPage";

type Params = {
  orderId: string;
};

export default async function Order({ params }: { params: Params }) {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    redirect("/");
  }
  const user = session.user;

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      restaurant: { include: { googleMapPlaceInfo: { select: { url: true } } } },
      meals: {
        include: {
          meal: { select: { title: true, price: true, listPrice: true } },
          options: {
            select: {
              id: true,
              mealItemOption: { select: { title: true, extraPrice: true, mealItem: { select: { title: true } } } }
            },
            orderBy: {
              mealItemOption: {
                mealItem: {
                  position: "asc"
                }
              }
            }
          }
        }
      }
    }
  });

  if (!order || order.userId !== user.id) {
    redirect("/");
  }

  return <OrderPage order={order}></OrderPage>;
}
