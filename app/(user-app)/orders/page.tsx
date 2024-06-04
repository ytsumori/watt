import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { OrdersPage } from "./_components/OrdersPage";

export default async function Orders() {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    redirect("/");
  }
  const user = session.user;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      restaurant: { select: { name: true } },
      payment: { select: { totalAmount: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return <OrdersPage orders={orders}></OrdersPage>;
}
