"use server";

import { multicastMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";

export async function notifyStaffNoActionCancellation({ orderId }: { orderId: string }) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId
    },
    select: {
      orderNumber: true,
      meal: {
        select: {
          restaurant: {
            select: {
              staffs: {
                select: {
                  lineId: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!order) throw new Error("Order not found");

  await multicastMessage({
    to: order.meal.restaurant.staffs.map((staff) => staff.lineId),
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
                size: "sm"
              },
              {
                type: "text",
                text: "来店がキャンセルされました",
                weight: "bold",
                size: "lg",
                wrap: true,
                margin: "md"
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
                        text: "注文番号："
                      },
                      {
                        type: "span",
                        text: order.orderNumber.toString(),
                        size: "xxl",
                        weight: "bold"
                      }
                    ]
                  }
                ]
              },
              {
                type: "text",
                text: "電話通知から3分以内に対応がなかったため、自動的にキャンセルされました。",
                wrap: true,
                margin: "lg",
                color: "#DC3444",
                weight: "regular"
              }
            ]
          },
          styles: {
            footer: {
              separator: true
            }
          }
        }
      }
    ]
  });
}
