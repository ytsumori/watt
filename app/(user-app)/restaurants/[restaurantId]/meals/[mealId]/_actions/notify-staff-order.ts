"use server";

import { pushMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";

export async function notifyStaffOrder({ restaurantId, orderId }: { restaurantId: string; orderId: string }) {
  const staffs = await prisma.staff.findMany({
    where: {
      restaurantId,
    },
  });
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      meal: true,
    },
  });
  if (!order) throw new Error("Order not found");
  staffs.forEach((staff) => {
    pushMessage({
      to: staff.lineId,
      messages: [
        {
          type: "flex",
          altText: "メンバーがお店に向かっています",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "来店予定通知",
                  weight: "bold",
                  color: "#1DB446",
                  size: "sm",
                },
                {
                  type: "text",
                  text: "お店に向かってるメンバーがいます",
                  weight: "bold",
                  size: "lg",
                  margin: "md",
                  wrap: true,
                },
                {
                  type: "separator",
                  margin: "xxl",
                },
                {
                  type: "box",
                  layout: "vertical",
                  margin: "xxl",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      contents: [
                        {
                          type: "span",
                          text: "注文番号：",
                        },
                        {
                          type: "span",
                          text: order.orderNumber.toString(),
                          size: "xxl",
                          weight: "bold",
                        },
                      ],
                    },
                    {
                      type: "text",
                      text: "注文予定の推しメシ",
                      weight: "bold",
                    },
                    {
                      type: "image",
                      url: order.meal.imageUrl,
                      size: "xl",
                      aspectRatio: "1:1",
                      aspectMode: "cover",
                      align: "start",
                    },
                  ],
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "uri",
                    label: "店内が満席であることを知らせる",
                    uri: `${process.env.NEXT_PUBLIC_LIFF_URL}/reject-order/${order.id}`,
                  },
                  style: "primary",
                  color: "#dc3444",
                },
              ],
            },
            styles: {
              footer: {
                separator: true,
              },
            },
          },
        },
      ],
    });
  });
}
