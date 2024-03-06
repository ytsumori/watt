import prisma from "@/lib/prisma/client";
import { OrdersPageClient } from "./_components/page-client";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      meal: {
        include: { restaurant: true },
      },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return <OrdersPageClient orders={orders} />;
}
