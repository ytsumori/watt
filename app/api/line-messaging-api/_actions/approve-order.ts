"use server";

import { pushMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";

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
  await notifyStaff(`注文(注文番号:${order.orderNumber})を承諾しました。`);
}
