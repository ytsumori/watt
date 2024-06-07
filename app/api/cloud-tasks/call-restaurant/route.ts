import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { sendVoiceCall } from "@/lib/xoxzo";
import { createHttpTask } from "@/lib/googleTasks/createHttpTask";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { orderId: string } = await request.json();

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    include: {
      user: { select: { phoneNumber: true } },
      restaurant: { select: { phoneNumber: true } }
    }
  });

  if (!order) return NextResponse.json({ message: "order not found" }, { status: 404 });

  if (order.canceledAt) return NextResponse.json({ message: "order already cancelled" }, { status: 200 });
  if (order.completedAt) return NextResponse.json({ message: "order already completed" }, { status: 200 });
  if (order.approvedByRestaurantAt !== null)
    return NextResponse.json({ message: "order already approved" }, { status: 200 });
  if (!order.restaurant.phoneNumber)
    return NextResponse.json({ message: "restaurant phone number not found" }, { status: 404 });

  try {
    const { callid } = await sendVoiceCall(
      order.restaurant.phoneNumber,
      "http://tognimzvzoyiykenqufx.supabase.co/storage/v1/object/public/notification-audio/visiting-call-notification.mp3"
    );
    await prisma.orderNotificationCall.create({ data: { orderId: order.id, callId: callid, status: "IN_PROGRESS" } });
    await createHttpTask({ name: "check-call-status", delaySeconds: 60, payload: { orderId: order.id } });
  } catch (e) {
    console.error("Error checking call status", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }

  return NextResponse.json({ message: "success" });
}
