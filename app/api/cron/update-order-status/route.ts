import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { cancelPaymentIntent } from "@/actions/payment-intent";
import { notifyStaffCancellation } from "@/app/(user-app)/orders/[orderId]/_actions/notify-staff-cancellation";
import { findOrder } from "@/actions/order";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { orderId: string } = await request.json();

  const order = await findOrder({ where: { id: body.orderId } });
  if (!order) return NextResponse.json({ message: "order not found" }, { status: 404 });
  if (order.status === "CANCELLED") return NextResponse.json({ message: "already canncelled" }, { status: 403 });

  const paymentStatus = await cancelPaymentIntent({ orderId: order.id, reason: "LATE", cancelledBy: "USER" });
  if (paymentStatus === "canceled") {
    try {
      await prisma.order.update({ where: { id: body.orderId }, data: { status: "CANCELLED" } });
      await notifyStaffCancellation({ orderId: body.orderId });
    } catch (e) {
      console.error("Error cancelling order", e);
      return NextResponse.json({ message: "Error cancelling order" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Failed to cancel payment intent" }, { status: 409 });
  }

  return NextResponse.json({ message: "success" });
}
