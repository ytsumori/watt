import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { checkCallStatus } from "@/lib/xoxzo";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { notifyStaffUnansweredCancellation } from "./_actions/notify-staff-unanswered-cancellation";
import { notifySlackUnansweredCall } from "./_actions/notify-slack-unanswered-call";
import { logger } from "@/utils/logger";
import { updateRestaurantAvailability } from "@/actions/mutations/restaurant";
import { notifyCancelSms } from "@/actions/sms-notification";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { orderId: string } = await request.json();

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    include: {
      notificationCall: true,
      user: { select: { phoneNumber: true } },
      restaurant: { select: { name: true } }
    }
  });
  if (!order || !order.notificationCall) return NextResponse.json({ message: "order not found" }, { status: 404 });
  if (!order.user.phoneNumber) return NextResponse.json({ message: "user has no phone number" }, { status: 500 });

  if (order.notificationCall.status !== "IN_PROGRESS")
    return NextResponse.json({ message: "call not in progress" }, { status: 200 });
  if (order.approvedByRestaurantAt) return NextResponse.json({ message: "order already approved" }, { status: 200 });
  if (order.canceledAt) return NextResponse.json({ message: "order already cancelled" }, { status: 200 });

  const { status: callStatus } = await checkCallStatus(order.notificationCall.callId);
  switch (callStatus) {
    case "ANSWERED":
      await prisma.orderNotificationCall.update({
        where: { orderId: order.id },
        data: { status: "ANSWERED" }
      });
      await createHttpTask({ name: "cancel-order-after-call", delaySeconds: 60, payload: { orderId: order.id } });
      break;
    case "FAILED":
    case "NO ANSWER":
      await prisma.order.update({
        where: { id: order.id },
        data: {
          canceledAt: new Date(),
          notificationCall: { update: { status: "NO_ANSWER" } },
          cancellation: { create: { reason: "CALL_NO_ANSWER", cancelledBy: "STAFF" } }
        }
      });
      await updateRestaurantAvailability({ id: order.restaurantId, isAvailable: false });
      await notifyCancelSms({ phoneNumber: order.user.phoneNumber, orderNumber: order.orderNumber });
      await notifyStaffUnansweredCancellation({ orderId: order.id }).catch((e) =>
        logger({ severity: "ERROR", message: "Error notifying staff of unanswered cancellation", payload: { e } })
      );
      await notifySlackUnansweredCall({ restaurantName: order.restaurant.name }).catch((e) =>
        logger({ severity: "ERROR", message: "Error notifying slack of unanswered cancellation", payload: { e } })
      );
      break;
    case "IN PROGRESS":
      await createHttpTask({ name: "check-call-status", delaySeconds: 15, payload: { orderId: order.id } });
      return NextResponse.json({ message: "call still in progress" });
    default:
      return NextResponse.json({ message: "call status not found" }, { status: 500 });
  }

  return NextResponse.json({ message: "success" });
}
