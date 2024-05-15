import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { notifyStaffAutomaticCancellation } from "./_actions/notify-staff-automatic-cancellation";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { orderId: string } = await request.json();

  const order = await prisma.order.findUnique({ where: { id: body.orderId } });
  if (!order) return NextResponse.json({ message: "order not found" }, { status: 404 });

  if (order.status === "CANCELLED") return NextResponse.json({ message: "already canncelled" });
  if (order.status === "COMPLETE") return NextResponse.json({ message: "already completed" });

  await prisma.order.update({
    where: { id: body.orderId },
    data: { status: "CANCELLED", cancellation: { create: { reason: "LATE", cancelledBy: "USER" } } }
  });

  try {
    await notifyStaffAutomaticCancellation({ orderId: body.orderId });
  } catch (e) {
    console.error("Error cancelling order", e);
    return NextResponse.json({ message: "Error cancelling order" }, { status: 500 });
  }

  return NextResponse.json({ message: "success" });
}
