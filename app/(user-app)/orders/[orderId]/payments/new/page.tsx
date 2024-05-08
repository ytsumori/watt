import { NewPaymentPage } from "./_components/NewPaymentPage";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/client";
import stripe from "@/lib/stripe";
import { getStripeCustomer } from "@/actions/stripe-customer";

type Params = {
  orderId: string;
};

export default async function NewPayment({ params }: { params: Params }) {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    redirect("/");
  }
  const user = session.user;

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      meal: {
        include: {
          restaurant: {
            include: { googleMapPlaceInfo: { select: { url: true } } }
          }
        }
      },
      payment: { select: { completedAt: true } }
    }
  });

  if (!order || order.userId !== user.id) {
    redirect("/");
  }

  if (order.payment && order.payment.completedAt !== null) {
    redirect(`/orders/${order.id}`);
  }

  const stripeCustomer = await getStripeCustomer({ userId: user.id });

  const paymentMethods = stripeCustomer
    ? await stripe.customers.listPaymentMethods(stripeCustomer.stripeCustomerId)
    : undefined;

  return <NewPaymentPage order={order} paymentMethods={paymentMethods?.data ?? []} />;
}
