import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { checkCallStatus } from "@/lib/xoxzo";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { orderId: string } = await request.json();

  const order = await prisma.order.findUnique({ where: { id: body.orderId }, include: { notificationCall: true } });
  if (!order || !order.notificationCall) return NextResponse.json({ message: "order not found" }, { status: 404 });
  if (order.notificationCall.status !== "IN_PROGRESS")
    return NextResponse.json({ message: "call not in progress" }, { status: 200 });

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
        await prisma.orderNotificationCall.update({
          where: { orderId: order.id },
          data: { status: "NO_ANSWER" }
        });
        break;
      case "IN PROGRESS":
        await createHttpTask({ name: "check-call-status", delaySeconds: 30, payload: { orderId: order.id } });
        return NextResponse.json({ message: "call still in progress" });
      case "NO ANSWER":
        await prisma.orderNotificationCall.update({
          where: { orderId: order.id },
          data: { status: "NO_ANSWER" }
        });
        break;
      default:
        return NextResponse.json({ message: "call status not found" }, { status: 500 });
    }
  } catch (e) {
    console.error("Error checking call status", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success" });
}
