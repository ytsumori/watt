import prisma from "@/lib/prisma/client";
import { OrdersPageClient } from "./_components/page-client";
import { convertRequiredOrderInfo } from "./_util/convertRequiredOrderInfo";

export default async function OrdersPage() {
  const restaurants = await prisma.restaurant.findMany({
    include: { meals: { include: { orders: { orderBy: { createdAt: "desc" } } } }, bankAccount: true },
  });

  const orders = convertRequiredOrderInfo(restaurants);
  return <OrdersPageClient orders={orders} />;
}
