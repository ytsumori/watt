import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { checkCallStatus, sendMessage } from "@/lib/xoxzo";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { updateIsOpen } from "@/actions/restaurant";
import { notifyStaffUnansweredCancellation } from "./_actions/notify-staff-unanswered-cancellation";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { orderId: string } = await request.json();

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    include: {
      meal: { select: { restaurantId: true } },
      notificationCall: true,
      user: { select: { phoneNumber: true } }
    }
  });
  if (!order || !order.notificationCall) return NextResponse.json({ message: "order not found" }, { status: 404 });
  if (!order.user.phoneNumber) return NextResponse.json({ message: "user has no phone number" }, { status: 500 });

  if (order.notificationCall.status !== "IN_PROGRESS")
    return NextResponse.json({ message: "call not in progress" }, { status: 200 });
  if (order.approvedByRestaurantAt) return NextResponse.json({ message: "order already approved" }, { status: 200 });
  if (order.status === "CANCELLED") return NextResponse.json({ message: "order already cancelled" }, { status: 200 });
  if (order.status === "COMPLETE") return NextResponse.json({ message: "order already completed" }, { status: 200 });

  try {
    const { status: callStatus } = await checkCallStatus(order.notificationCall.callId);
    switch (callStatus) {
      case "ANSWERED":
        await prisma.orderNotificationCall.update({
          where: { orderId: order.id },
          data: { status: "ANSWERED" }
        });
        break;
      case "FAILED":
      case "NO ANSWER":
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "CANCELLED",
            notificationCall: { update: { status: "NO_ANSWER" } },
            cancellation: { create: { reason: "CALL_NO_ANSWER", cancelledBy: "STAFF" } }
          }
        });
        await updateIsOpen({ id: order.meal.restaurantId, isOpen: false });
        await sendMessage(
          order.user.phoneNumber,
          "お店が満席のため、注文がキャンセルされました。詳しくはWattをご確認ください。"
        );
        await notifyStaffUnansweredCancellation({ orderId: order.id });
        break;
      case "IN PROGRESS":
        await createHttpTask({ name: "check-call-status", delaySeconds: 30, payload: { orderId: order.id } });
        return NextResponse.json({ message: "call still in progress" });
      default:
        return NextResponse.json({ message: "call status not found" }, { status: 500 });
    }
  } catch (e) {
    console.error("Error checking call status", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success" });
}
