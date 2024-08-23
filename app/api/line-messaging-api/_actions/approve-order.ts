"use server";

import { pushMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";
import { sendMessage } from "@/lib/xoxzo";
import { logger } from "@/utils/logger";

export async function approveOrder({ orderId, lineId }: { orderId: string; lineId: string }) {
  const staff = await prisma.staff.findFirst({ where: { lineId } });
  if (!staff) throw new Error("staff not found");

  const order = await prisma.order.findUnique({
    where: { id: orderId, restaurantId: staff.restaurantId },
    include: {
      user: {
        select: {
          phoneNumber: true
        }
      }
    }
  });
  if (!order) throw new Error("order not found");
  if (!order.user.phoneNumber) throw new Error("user has no phone number");

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
      logger({ severity: "ERROR", message: "Error sending message", payload: { e } });
    }
  };

  if (order.canceledAt) return await notifyStaff(`注文(注文番号:${order.orderNumber})はすでにキャンセルされています。`);
  if (order.approvedByRestaurantAt)
    return await notifyStaff(`注文(注文番号:${order.orderNumber})はすでに承諾されています。`);

  await prisma.order.update({ where: { id: orderId }, data: { approvedByRestaurantAt: new Date() } });
  await notifyStaff(
    `注文(注文番号:${order.orderNumber})を承諾しました。30分以内にお客様が来店されない場合、自動的にキャンセルされます。`
  );
  await sendMessage(
    order.user.phoneNumber,
    `【注文番号:${order.orderNumber}】お店の空き状況が確認できました。30分以内にお店に向かってください。`
  ).catch((e) => {
    logger({ severity: "ERROR", message: "Error sending message", payload: { e } });
  });
}
