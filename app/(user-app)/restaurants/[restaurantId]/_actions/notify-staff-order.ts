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
      meals: {
        select: {
          meal: {
            select: {
              title: true,
              price: true
            }
          },
          quantity: true
        }
      },
      restaurant: {
        select: {
          id: true,
          staffs: {
            select: {
              lineId: true
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
      restaurantId: order.restaurant.id,
      status: "COMPLETE"
    }
  });
  await multicastMessage({
    to: order.restaurant.staffs.map((staff) => staff.lineId),
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
                        contents: [
                          { type: "span", text: "ニックネーム：" },
                          { type: "span", text: order.user.name ?? "", weight: "bold" }
                        ] as { type: "span"; text: string; weight: "bold" }[]
                      },
                      {
                        type: "text",
                        contents: [
                          { type: "span", text: "過去来店回数：" },
                          { type: "span", text: count.toString(), weight: "bold" }
                        ] as { type: "span"; text: string; weight: "bold" }[]
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
                  ...order.meals.map((orderMeal) => {
                    return {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        {
                          type: "text",
                          text: orderMeal.meal.title,
                          size: "sm",
                          color: "#555555",
                          flex: 0
                        },
                        {
                          type: "text",
                          text: `¥${orderMeal.meal.price.toLocaleString("ja-JP")} × ${orderMeal.quantity}`,
                          size: "sm",
                          color: "#111111",
                          align: "end"
                        }
                      ]
                    } as {
                      type: "box";
                      layout: "horizontal";
                      contents: {
                        type: "text";
                        text: string;
                        size: "sm";
                        color: string;
                        flex: 0;
                        align?: "end";
                      }[];
                    };
                  }),
                  {
                    type: "separator",
                    margin: "xxl"
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "合計",
                        size: "sm",
                        color: "#555555",
                        flex: 0
                      },
                      {
                        type: "text",
                        text: `¥${order.meals.reduce((acc, cur) => acc + cur.meal.price * cur.quantity, 0).toLocaleString("ja-JP")}`,
                        size: "sm",
                        color: "#111111",
                        align: "end"
                      }
                    ]
                  }
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
