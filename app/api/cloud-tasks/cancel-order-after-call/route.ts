import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { notifyStaffNoActionCancellation } from "./_actions/notify-staff-no-action-cancellation";
import { logger } from "@/utils/logger";
import { notifySlackStaffNoAction } from "./_actions/notify-slack-staff-no-action";
import { notifyCancelSms } from "@/actions/sms-notification";
import { setRestaurantUnavailable } from "@/actions/mutations/restaurant";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { orderId: string } = await request.json();

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    select: {
      id: true,
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
  if (order.approvedByRestaurantAt) return NextResponse.json({ message: "already approved" });

  await prisma.order.update({
    where: { id: body.orderId },
    data: { canceledAt: new Date(), cancellation: { create: { reason: "CALL_NO_ANSWER", cancelledBy: "STAFF" } } }
  });
  await setRestaurantUnavailable(order.restaurantId);
  await notifyCancelSms({ phoneNumber: order.user.phoneNumber, orderNumber: order.orderNumber });

  await notifyStaffNoActionCancellation({ orderId: body.orderId }).catch((e) =>
    logger({ severity: "ERROR", message: "Error notifying staff of no action cancellation", payload: { e } })
  );
  await notifySlackStaffNoAction({ restaurantName: order.restaurant.name }).catch((e) =>
    logger({ severity: "ERROR", message: "Error notifying slack of no action cancellation", payload: { e } })
  );

  return NextResponse.json({ message: "success" });
}
