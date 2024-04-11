import prisma from "@/lib/prisma/client";
import { OrdersPageClient } from "./_components/OrdersPageClient";
import { calculateDateRange } from "./_components/DateRangeEditor/util";

export default async function OrdersPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const dateRange = calculateDateRange(searchParams);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gt: dateRange.start, lte: dateRange.end },
      status: { in: ["COMPLETE", "PREAUTHORIZED"] }
    },
    orderBy: { createdAt: "desc" },
    include: {
      meal: {
        include: {
          restaurant: {
            include: {
              bankAccount: true
            }
          }
        }
      }
    }
  });

  return <OrdersPageClient orders={orders} dateRange={dateRange} />;
}
