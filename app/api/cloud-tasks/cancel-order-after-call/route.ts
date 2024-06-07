import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { notifyStaffNoActionCancellation } from "./_actions/notify-staff-no-action-cancellation";
import { sendMessage } from "@/lib/xoxzo";
import { notifySlack } from "./_actions/notify-slack";
import { updateIsOpen } from "@/actions/restaurant";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { orderId: string } = await request.json();

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    select: {
      id: true,
      completedAt: true,
      canceledAt: true,
      approvedByRestaurantAt: true,
      orderNumber: true,
      restaurantId: true,
      restaurant: { select: { name: true } },
      user: { select: { phoneNumber: true } }
    }
  });
  if (!order) return NextResponse.json({ message: "order not found" }, { status: 404 });
  if (!order.user.phoneNumber) return NextResponse.json({ message: "user has no phone number" }, { status: 500 });

  if (order.canceledAt) return NextResponse.json({ message: "already canncelled" });
  if (order.completedAt) return NextResponse.json({ message: "already completed" });
  if (order.approvedByRestaurantAt) return NextResponse.json({ message: "already approved" });

  await prisma.order.update({
    where: { id: body.orderId },
    data: { canceledAt: new Date(), cancellation: { create: { reason: "CALL_NO_ANSWER", cancelledBy: "STAFF" } } }
  });
  await updateIsOpen({ id: order.restaurantId, isOpen: false });
  await sendMessage(
    order.user.phoneNumber,
    `お店が満席のため、注文(#${order.orderNumber})がキャンセルされました。詳しくはWattをご確認ください。`
  );

  try {
    await notifyStaffNoActionCancellation({ orderId: body.orderId });
  } catch (e) {
    console.error("Error cancelling order", e);
    return NextResponse.json({ message: "Error cancelling order" }, { status: 500 });
  }
  try {
    await notifySlack({ restaurantName: order.restaurant.name });
  } catch (e) {
    console.error("Error notifying slack", e);
    return NextResponse.json({ message: "Error notifying slack" }, { status: 500 });
  }

  return NextResponse.json({ message: "success" });
}
