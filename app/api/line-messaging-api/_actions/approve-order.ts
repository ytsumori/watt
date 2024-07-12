"use server";

import { createHttpTask } from "@/lib/googleTasks/createHttpTask";
import { pushMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";
import { logger } from "@/utils/logger";

export async function approveOrder({ orderId, lineId }: { orderId: string; lineId: string }) {
  const staff = await prisma.staff.findFirst({ where: { lineId } });
  if (!staff) throw new Error("staff not found");

  const order = await prisma.order.findUnique({
    where: { id: orderId, restaurantId: staff.restaurantId }
  });
  if (!order) throw new Error("order not found");

  const notifyStaff = async (message: string) => {
    try {
      await pushMessage({
        to: lineId,
        messages: [
          {
            type: "text",
            text: message
          }
        ]
      });
    } catch (e) {
      console.error("Error sending message", e);
    }
  };

  if (order.canceledAt) return await notifyStaff(`注文(注文番号:${order.orderNumber})はすでにキャンセルされています。`);
  if (order.completedAt) return await notifyStaff(`注文(注文番号:${order.orderNumber})はすでに完了しています。`);
  if (order.approvedByRestaurantAt)
    return await notifyStaff(`注文(注文番号:${order.orderNumber})はすでに承諾されています。`);

  await prisma.order.update({ where: { id: orderId }, data: { approvedByRestaurantAt: new Date() } });
  await notifyStaff(
    `注文(注文番号:${order.orderNumber})を承諾しました。30分以内にお客様が来店されない場合、自動的にキャンセルされます。`
  );

  const taskId = await createHttpTask({ name: "cancel-order", delaySeconds: 60 * 30, payload: { orderId: order.id } });
  if (taskId) {
    await prisma.orderAutomaticCancellation.create({ data: { orderId: order.id, googleCloudTaskId: taskId } });
  } else {
    logger({
      severity: "ERROR",
      message: "Error creating task",
      payload: { orderId: order.id }
    });
  }
}
