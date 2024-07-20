import prisma from "@/lib/prisma/client";
import { OrdersPage } from "./_components/OrdersPage";

type Props = {
  searchParams: {
    page: string;
  };
};

const PAGE_SIZE = 20;
export default async function Orders({ searchParams }: Props) {
  const page = parseInt(searchParams.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      peopleCount: true,
      completedAt: true,
      orderTotalPrice: true,
      meals: {
        select: {
          id: true,
          meal: { select: { title: true, price: true } },
          options: { select: { mealItemOption: { select: { title: true, extraPrice: true } } } }
        }
      },
      payment: { select: { totalAmount: true } },
      restaurant: { select: { id: true, name: true } }
    },
    where: {
      completedAt: {
        not: null
      }
    },
    orderBy: {
      completedAt: "desc"
    },
    take: PAGE_SIZE,
    skip
  });
  const count = await prisma.order.count();
  const maxPage = Math.ceil(count / PAGE_SIZE);
  return <OrdersPage orders={orders} page={page} maxPage={maxPage} />;
}
