"use server";

import { multicastMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";
import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";

export async function notifyStaffOrder({ orderId }: { orderId: string }) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId
    },
    select: {
      orderNumber: true,
      meal: {
        select: {
          imagePath: true,
          description: true,
          restaurant: {
            select: {
              id: true,
              staffs: {
                select: {
                  lineId: true
                }
              }
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  if (!order) throw new Error("Order not found");
  const count = await prisma.order.count({
    where: {
      userId: order.user.id,
      meal: {
        restaurantId: order.meal.restaurant.id
      },
      status: "COMPLETE"
    }
  });
  await multicastMessage({
    to: order.meal.restaurant.staffs.map((staff) => staff.lineId),
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
              { type: "text", text: "来店予定通知", weight: "bold", color: "#1DB446", size: "sm" },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "メンバーが向かっています",
                    weight: "bold",
                    size: "lg",
                    margin: "md",
                    wrap: true
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        // @ts-ignore: contents attribute exists
                        contents: [
                          { type: "span", text: "ニックネーム：" },
                          { type: "span", text: order.user.name ?? "", weight: "bold" }
                        ],
                        text: "ニックネーム：ハロー"
                      },
                      {
                        type: "text",
                        // @ts-ignore: contents attribute exists
                        contents: [
                          { type: "span", text: "過去来店回数：" },
                          { type: "span", text: count.toString(), weight: "bold" }
                        ],
                        text: "ニックネーム：ハロー"
                      }
                    ],
                    margin: "sm"
                  }
                ]
              },
              {
                type: "separator",
                margin: "lg"
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
                      { type: "span", text: "注文番号：" },
                      { type: "span", text: order.orderNumber.toString(), size: "xxl", weight: "bold" }
                    ]
                  },
                  { type: "text", text: "注文予定の推しメシ", weight: "bold" },
                  {
                    type: "image",
                    url: transformSupabaseImage("meals", order.meal.imagePath),
                    size: "xl",
                    aspectRatio: "1:1",
                    aspectMode: "cover",
                    align: "start"
                  },
                  { type: "text", text: order.meal.description ?? "", wrap: true, size: "xxs" }
                ]
              }
            ]
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "注文を承諾する",
                  data: "action=approve-order&orderId=" + orderId,
                  displayText: "注文を承諾する"
                },
                style: "primary"
              },
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "店内が満席であることを知らせる",
                  uri: `${process.env.NEXT_PUBLIC_LIFF_URL}/reject-order/${orderId}`
                },
                style: "primary",
                color: "#dc3444"
              }
            ]
          },
          styles: { footer: { separator: true } }
        }
      }
    ]
  });
}
