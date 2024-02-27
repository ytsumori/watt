"use server";

import { pushMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";

export async function notifyStaff({
  restaurantId,
  mealId,
}: {
  restaurantId: string;
  mealId: string;
}) {
  // const staffs = await prisma.staff.findMany({
  //   where: {
  //     restaurantId,
  //   },
  // });
  // const meal = await prisma.meal.findUnique({
  //   where: {
  //     id: mealId,
  //   },
  // });
  // if (!meal) throw new Error("Meal not found");
  // staffs.forEach((staff) => {
  //   pushMessage({
  //     to: staff.lineId,
  //     messages: [
  //       {
  //         type: "flex",
  //         altText: "メンバーがお店に向かっています",
  //         contents: {
  //           type: "bubble",
  //           body: {
  //             type: "box",
  //             layout: "vertical",
  //             contents: [
  //               {
  //                 type: "text",
  //                 text: "来店予定通知",
  //                 weight: "bold",
  //                 color: "#1DB446",
  //                 size: "sm",
  //               },
  //               {
  //                 type: "text",
  //                 text: "お店に向かってるメンバーがいます",
  //                 weight: "bold",
  //                 size: "lg",
  //                 margin: "md",
  //                 wrap: true,
  //               },
  //               {
  //                 type: "separator",
  //                 margin: "xxl",
  //               },
  //               {
  //                 type: "box",
  //                 layout: "vertical",
  //                 margin: "xxl",
  //                 spacing: "sm",
  //                 contents: [
  //                   {
  //                     type: "text",
  //                     text: "注文予定の推しメシ",
  //                     weight: "bold",
  //                   },
  //                   {
  //                     type: "image",
  //                     url: meal.imageUrl,
  //                     size: "xl",
  //                     aspectRatio: "1:1",
  //                     aspectMode: "cover",
  //                     align: "start",
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           footer: {
  //             type: "box",
  //             layout: "vertical",
  //             contents: [
  //               {
  //                 type: "button",
  //                 action: {
  //                   type: "postback",
  //                   label: "店内が満席であることを知らせる",
  //                   data: "cancel",
  //                 },
  //                 style: "primary",
  //                 color: "#dc3444",
  //               },
  //             ],
  //           },
  //           styles: {
  //             footer: {
  //               separator: true,
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   });
  // });
}
