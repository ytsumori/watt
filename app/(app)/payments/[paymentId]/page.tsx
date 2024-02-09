import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/client";
import { PaymentPage } from "./_components/page-client";

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
    include: {
      order: {
        include: {
          meal: { include: { restaurant: true } },
        },
      },
    },
  });

  if (!payment || payment.order.userId !== user.id) {
    redirect("/");
  }

  return <PaymentPage payment={payment}></PaymentPage>;
}
