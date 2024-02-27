import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/client";
import { OrderPage } from "./_components/page-client";

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
      meal: { include: { restaurant: true } },
    },
  });

  if (!order || order.userId !== user.id) {
    redirect("/");
  }

  return <OrderPage order={order}></OrderPage>;
}
