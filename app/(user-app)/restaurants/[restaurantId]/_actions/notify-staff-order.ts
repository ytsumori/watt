"use server";

import { multicastMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";

export async function notifyStaffOrder({ orderId }: { orderId: string }) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId
    },
    select: {
      orderNumber: true,
      peopleCount: true,
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
      completedAt: { not: null }
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
              {
                type: "text",
                text: "来店予定通知",
                weight: "bold",
                color: "#1DB446",
                size: "sm"
              },
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
                        size: "xs",
                        contents: [
                          {
                            type: "span",
                            text: "ニックネーム："
                          },
                          {
                            type: "span",
                            text: order.user.name ?? ""
                          }
                        ],
                        color: "#aaaaaa"
                      },
                      {
                        type: "text",
                        contents: [
                          {
                            type: "span",
                            text: "過去来店回数："
                          },
                          {
                            type: "span",
                            text: count.toString()
                          }
                        ],
                        size: "xs",
                        color: "#aaaaaa"
                      }
                    ],
                    margin: "sm"
                  }
                ]
              },
              {
                type: "box",
                layout: "vertical",
                spacing: "lg",
                contents: [
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "注文番号"
                      },
                      {
                        type: "text",
                        text: `#${order.orderNumber}`,
                        align: "end",
                        weight: "bold"
                      }
                    ],
                    spacing: "none"
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "人数"
                      },
                      {
                        type: "text",
                        text: `${order.peopleCount}人`,
                        weight: "bold",
                        align: "end"
                      }
                    ],
                    spacing: "none"
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [
                          ...(order.meals.map((mealOrder) => {
                            return {
                              type: "box",
                              layout: "horizontal",
                              contents: [
                                {
                                  type: "text",
                                  text: mealOrder.meal.title,
                                  size: "sm",
                                  color: "#555555",
                                  flex: 0
                                },
                                {
                                  type: "text",
                                  text: `¥${mealOrder.meal.price.toLocaleString("ja-JP")} × ${mealOrder.quantity}`,
                                  size: "sm",
                                  color: "#111111",
                                  align: "end"
                                }
                              ],
                              margin: "md"
                            };
                          }) as {
                            type: "box";
                            layout: "horizontal";
                            contents: {
                              type: "text";
                              text: string;
                              size: "sm";
                              color: string;
                              flex?: 0;
                              align?: "end";
                            }[];
                          }[]),
                          {
                            type: "separator",
                            margin: "sm"
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
                                text: `¥${order.meals.reduce((sum, meal) => sum + meal.meal.price * meal.quantity, 0).toLocaleString("ja-JP")}`,
                                size: "sm",
                                color: "#111111",
                                align: "end",
                                weight: "bold"
                              }
                            ],
                            margin: "sm"
                          }
                        ]
                      }
                    ]
                  }
                ],
                margin: "lg"
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
