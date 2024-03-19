"use server";

import { pushMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";

export async function notifyStaffCancellation({ orderId, isFull }: { orderId: string; isFull: boolean }) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      orderNumber: true,
      meal: {
        select: {
          restaurant: {
            select: {
              staffs: {
                select: {
                  lineId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!order) throw new Error("Order not found");
  order.meal.restaurant.staffs.forEach((staff) => {
    pushMessage({
      to: staff.lineId,
      messages: [
        {
          type: "flex",
          altText: "来店がキャンセルされました",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "来店キャンセル通知",
                  weight: "bold",
                  color: "#DC3444",
                  size: "sm",
                },
                {
                  type: "text",
                  text: "来店がキャンセルされました",
                  weight: "bold",
                  size: "lg",
                  wrap: true,
                  margin: "md",
                },
                {
                  type: "box",
                  layout: "vertical",
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
                  ],
                },
                ...(isFull
                  ? [
                      {
                        type: "separator" as const,
                      },
                      {
                        type: "text" as const,
                        text: "満席の報告があったため、営業ステータスが「入店不可」に切り替わりました。",
                        wrap: true,
                        margin: "lg",
                        color: "#DC3444",
                        weight: "regular" as const,
                      },
                    ]
                  : []),
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
