import { getServerSession } from "next-auth";
import { PaymentPage } from "./_components/PaymentPage";
import { options } from "@/lib/next-auth/options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/client";

type Params = {
  paymentId: string;
};

export default async function Payment({ params }: { params: Params }) {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    redirect("/");
  }
  const user = session.user;

  const payment = await prisma.payment.findUnique({
    where: { id: params.paymentId },
    select: {
      id: true,
      completedAt: true,
      totalAmount: true,
      order: { select: { userId: true, restaurant: { select: { name: true } } } }
    }
  });

  if (!payment || payment.order.userId !== user.id) {
    redirect("/");
  }

  return <PaymentPage payment={payment}></PaymentPage>;
}
