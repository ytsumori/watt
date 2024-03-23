import prisma from "@/lib/prisma/client";
import { OrdersPageClient } from "./_components/OrdersPageClient";
import { convertRequiredOrderInfo } from "./_util/convertRequiredOrderInfo";
import { calculateDateRange } from "./_components/DateRangeEditor/util";

export default async function OrdersPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const dateRange = calculateDateRange(searchParams);

  const restaurants = await prisma.restaurant.findMany({
    include: {
      meals: {
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            where: { createdAt: { gt: dateRange.start, lte: dateRange.end } },
          },
        },
      },
      bankAccount: true,
    },
  });

  const orders = convertRequiredOrderInfo(restaurants);

  return <OrdersPageClient orders={orders} dateRange={dateRange} />;
}
