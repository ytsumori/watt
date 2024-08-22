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
      orderTotalPrice: true,
      isDiscounted: true,
      meals: {
        select: {
          meal: {
            select: {
              title: true,
              price: true,
              listPrice: true
            }
          },
          options: {
            select: {
              mealItemOption: {
                select: {
                  title: true,
                  extraPrice: true,
                  mealItem: {
                    select: {
                      title: true,
                      position: true
                    }
                  }
                }
              }
            },
            orderBy: {
              mealItemOption: {
                mealItem: {
                  position: "asc"
                }
              }
            }
          }
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
                          ...Array(order.peopleCount)
                            .fill(0)
                            .flatMap((_, index) => {
                              const orderMeal = order.meals.at(index);
                              return [
                                ...(order.peopleCount > 1
                                  ? [
                                      {
                                        type: "text" as "text",
                                        text: `${index + 1}人目`,
                                        size: "sm",
                                        color: "#555555",
                                        wrap: true,
                                        margin: "sm"
                                      }
                                    ]
                                  : []),
                                ...(orderMeal
                                  ? [
                                      {
                                        type: "box" as "box",
                                        layout: "horizontal" as "horizontal",
                                        contents: [
                                          {
                                            type: "text" as "text",
                                            text: orderMeal.meal.title,
                                            size: "sm",
                                            color: "#555555",
                                            wrap: true,
                                            weight: "bold"
                                          },
                                          {
                                            type: "text" as "text",
                                            text: `${(order.isDiscounted ? orderMeal.meal.price : orderMeal.meal.listPrice).toLocaleString("ja-JP")}円`,
                                            size: "sm",
                                            color: "#111111",
                                            align: "end" as "end"
                                          }
                                        ]
                                      },
                                      ...orderMeal.options.map((option) => {
                                        return {
                                          type: "box" as "box",
                                          layout: "horizontal" as "horizontal",
                                          contents: [
                                            {
                                              type: "text" as "text",
                                              text: `・${option.mealItemOption.mealItem.title} ${option.mealItemOption.title}`,
                                              size: "sm",
                                              color: "#555555",
                                              wrap: true
                                            },
                                            {
                                              type: "text" as "text",
                                              text: `${option.mealItemOption.extraPrice >= 0 ? "+" : ""}${option.mealItemOption.extraPrice.toLocaleString("ja-JP")}円`,
                                              size: "sm",
                                              color: "#111111",
                                              align: "end" as "end"
                                            }
                                          ]
                                        };
                                      })
                                    ]
                                  : [
                                      {
                                        type: "text" as "text",
                                        text: "注文無し",
                                        size: "sm",
                                        color: "#555555",
                                        wrap: true,
                                        weight: "bold" as "bold"
                                      }
                                    ])
                              ];
                            }),
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
                                text: `${order.orderTotalPrice.toLocaleString("ja-JP")}円`,
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
