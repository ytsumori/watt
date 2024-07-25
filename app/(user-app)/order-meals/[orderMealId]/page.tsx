import prisma from "@/lib/prisma/client";
import { redirect } from "next/navigation";

type Props = {
  params: {
    orderMealId: string;
  };
};

export default async function OrderMeal({ params }: Props) {
  const orderMeal = await prisma.orderMeal.findUnique({
    where: {
      id: params.orderMealId
    },
    select: {
      orderId: true
    }
  });
  if (!orderMeal) {
    redirect("/");
  }
  redirect(`/orders/${orderMeal.orderId}`);
}
