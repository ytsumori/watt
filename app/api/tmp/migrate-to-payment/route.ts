import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { Order } from "@prisma/client";
import stripe from "@/lib/stripe";

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  const isAuthUser = !(error || !data?.user);
  const isMailAddressValid = data?.user?.email && data.user.email.endsWith("@kiizan-kiizan.co.jp");

  if (!isAuthUser || !isMailAddressValid) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const orders = await prisma.order.findMany({
    where: {
      payment: null,
      providerPaymentId: {
        not: null
      },
      status: "COMPLETE"
    },
    include: {
      payment: true
    }
  });

  const createPayment = async (order: Order) => {
    if (order.providerPaymentId === null || order.price === null || order.restaurantProfitPrice === null) return;

    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentId: order.providerPaymentId,
        additionalAmount: 0,
        totalAmount: order.price,
        restaurantProfitPrice: order.restaurantProfitPrice,
        isCsvDownloaded: order.isDownloaded,
        completedAt: order.createdAt
      }
    });
  };
  await Promise.all(orders.map(createPayment));

  return NextResponse.json({ success: true });
}
